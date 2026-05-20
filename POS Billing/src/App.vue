<template>
  <div id="app">
    <Header
      :currentInvoiceNumber="currentInvoiceNumber"
      @toggle-history="showHistory = !showHistory"
      @refresh-products="fetchProducts"
      @open-config="showConfigModal = true"
    />

    <section class="integration-panel">
      <div class="integration-row">
        <div>
          <span class="status-label">Billing API:</span>
          <strong>{{ apiStatus }}</strong>
        </div>
        <div class="integration-actions">
          <button class="btn-secondary" @click="showConfigModal = true">Configure API</button>
          <button class="btn-secondary" @click="fetchProducts">Sync Products</button>
        </div>
      </div>
      <p class="integration-help">Using: {{ billingConfig.endpoint || 'Not configured' }}</p>
    </section>

    <main class="pos-main">
      <ProductsPanel
        :products="products"
        :searchQuery="searchQuery"
        @update:searchQuery="searchQuery = $event"
        @add-to-cart="addToCart"
        @barcode-scan="handleBarcodeScan"
      />

      <CartPanel
        :cart="cart"
        :discountType="discountType"
        :discountValue="discountValue"
        @clear-cart="clearCart"
        @remove-from-cart="removeFromCart"
        @increment-qty="incrementQty"
        @decrement-qty="decrementQty"
        @checkout="checkout"
        @update:discountValue="discountValue = $event"
        @update:discountType="discountType = $event"
      />
    </main>

    <PaymentModal
      :showPaymentModal="showPaymentModal"
      :total="total"
      @close="closePaymentModal"
      @complete-payment="handlePaymentComplete"
    />

    <Receipt :lastTransaction="lastTransaction" />

    <Toast :toast="toast" />

    <div v-if="showConfigModal" class="modal-overlay" @click.self="closeConfigModal">
      <div class="modal-card">
        <h2>Billing API Configuration</h2>

        <div class="field-group">
          <label for="api-endpoint">API Endpoint</label>
          <input id="api-endpoint" v-model="billingConfig.endpoint" placeholder="http://localhost:3001/api/external" />
        </div>

        <div class="field-group">
          <label for="api-key">API Key</label>
          <input id="api-key" v-model="billingConfig.apiKey" placeholder="Enter billing API key" />
        </div>

        <div class="modal-actions">
          <button class="btn-secondary" @click="closeConfigModal">Cancel</button>
          <button class="btn-primary" @click="saveConfig">Save Configuration</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import ProductsPanel from './components/ProductsPanel.vue';
import CartPanel from './components/CartPanel.vue';
import PaymentModal from './components/PaymentModal.vue';
import Receipt from './components/Receipt.vue';
import Toast from './components/Toast.vue';
import { createApiClient, getBillingConfig, saveBillingConfig } from './api.js';

export default {
  name: 'App',
  components: {
    Header,
    ProductsPanel,
    CartPanel,
    PaymentModal,
    Receipt,
    Toast
  },
  data() {
    return {
      products: [],
      searchQuery: '',
      showHistory: false,
      cart: [],
      discountType: 'percentage',
      discountValue: 0,
      showPaymentModal: false,
      currentInvoiceNumber: 1001,
      lastTransaction: null,
      toast: {
        show: false,
        message: '',
        type: 'success'
      },
      showConfigModal: false,
      billingConfig: {
        endpoint: '',
        apiKey: ''
      },
      apiConnected: false
    };
  },
  computed: {
    subtotal() {
      return this.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    },
    discountAmount() {
      if (this.discountValue <= 0) return 0;
      if (this.discountType === 'percentage') {
        return (this.subtotal * this.discountValue) / 100;
      }
      return Math.min(this.discountValue, this.subtotal);
    },
    total() {
      return this.subtotal - this.discountAmount;
    },
    apiStatus() {
      return this.apiConnected ? 'Connected' : 'Not connected';
    }
  },
  created() {
    this.billingConfig = getBillingConfig();
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      if (!this.billingConfig.endpoint || !this.billingConfig.apiKey) {
        this.apiConnected = false;
        this.showToast('Please configure the billing API first.', 'warning');
        return;
      }

      try {
        const client = createApiClient();
        const response = await client.get('/products?limit=100');
        const data = response.data?.data || [];
        this.products = data.map(product => ({
          id: product._id,
          name: product.name,
          price: product.price,
          category: product.category?.name || '',
          stock: product.stockQuantity,
          branch: product.branch?.name || ''
        }));
        this.apiConnected = true;
        this.showToast('Products loaded from inventory backend.', 'success');
      } catch (error) {
        this.apiConnected = false;
        this.showToast('Unable to load products from backend. Check your API settings.', 'error');
        console.error('Product fetch error:', error);
      }
    },
    async saveConfig() {
      if (!this.billingConfig.endpoint || !this.billingConfig.apiKey) {
        this.showToast('API endpoint and API key are required.', 'warning');
        return;
      }
      this.billingConfig = saveBillingConfig(this.billingConfig);
      this.showConfigModal = false;
      this.showToast('Billing configuration saved.', 'success');
      await this.fetchProducts();
    },
    closeConfigModal() {
      this.showConfigModal = false;
    },
    addToCart(product) {
      if (product.stock <= 0) return;
      const existingItem = this.cart.find(item => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity++;
          this.showToast('Product quantity updated', 'success');
        } else {
          this.showToast('Maximum stock reached', 'warning');
        }
      } else {
        this.cart.push({ product: { ...product }, quantity: 1 });
        this.showToast(`${product.name} added to cart`, 'success');
      }
    },
    removeFromCart(index) {
      const item = this.cart[index];
      this.cart.splice(index, 1);
      this.showToast(`${item.product.name} removed from cart`, 'success');
    },
    incrementQty(index) {
      const item = this.cart[index];
      if (item.quantity < item.product.stock) {
        item.quantity++;
      }
    },
    decrementQty(index) {
      const item = this.cart[index];
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeFromCart(index);
      }
    },
    clearCart() {
      if (confirm('Are you sure you want to clear the cart?')) {
        this.cart = [];
        this.discountValue = 0;
        this.showToast('Cart cleared', 'success');
      }
    },
    checkout() {
      if (this.cart.length === 0) return;
      this.showPaymentModal = true;
    },
    closePaymentModal() {
      this.showPaymentModal = false;
    },
    async handlePaymentComplete(paymentInfo) {
      if (!this.apiConnected) {
        this.showToast('Please connect to the inventory backend before completing payment.', 'error');
        return;
      }

      const sales = this.cart.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        totalAmount: item.product.price * item.quantity,
        branch: item.product.branch || null
      }));

      try {
        const client = createApiClient();
        for (const sale of sales) {
          await client.post('/pos-transactions', sale);
        }

        const transaction = {
          invoiceNumber: this.currentInvoiceNumber,
          items: [...this.cart],
          subtotal: this.subtotal,
          discountAmount: this.discountAmount,
          total: this.total,
          paymentMethod: paymentInfo.paymentMethod,
          cashReceived: paymentInfo.cashReceived,
          change: paymentInfo.cashReceived - this.total,
          timestamp: new Date()
        };

        this.cart.forEach(item => {
          const product = this.products.find(p => p.id === item.product.id);
          if (product) {
            product.stock -= item.quantity;
          }
        });

        this.lastTransaction = transaction;
        this.cart = [];
        this.discountValue = 0;
        this.closePaymentModal();
        this.currentInvoiceNumber++;
        this.showToast('Payment completed and synced to backend.', 'success');
        setTimeout(() => window.print(), 500);
      } catch (error) {
        this.showToast('Sale could not be saved to backend. Please check API settings.', 'error');
        console.error('Billing transaction error:', error);
      }
    },
    handleBarcodeScan(query) {
      const product = this.products.find(p => p.name.toLowerCase().includes(query.toLowerCase()));
      if (product) {
        this.addToCart(product);
        this.searchQuery = '';
      }
    },
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    }
  }
};
</script>

<style>
:root {
  --primary: #4f46e5;
  --primary-dark: #4338ca;
  --primary-light: #eef2ff;
  --success: #10b981;
  --success-light: #ecfdf5;
  --warning: #f59e0b;
  --warning-light: #fffbeb;
  --danger: #ef4444;
  --danger-light: #fef2f2;
  --bg: #f1f5f9;
  --surface: #ffffff;
  --surface-alt: #f8fafc;
  --border: #e2e8f0;
  --text: #1e293b;
  --text-secondary: #64748b;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.08);
  --radius-sm: 8px;
  --radius: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.integration-panel {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 18px 24px;
}

.integration-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.status-label {
  color: #475569;
  font-weight: 600;
}

.integration-actions {
  display: flex;
  gap: 10px;
}

.btn-secondary,
.btn-primary {
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #0f172a;
}

.btn-primary {
  border: none;
  background: #4f46e5;
  color: #ffffff;
}

.integration-help {
  margin-top: 8px;
  color: #64748b;
  font-size: 0.95rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-card {
  width: min(520px, calc(100% - 24px));
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 24px 68px rgba(15, 23, 42, 0.16);
  padding: 24px;
}

.modal-card h2 {
  margin: 0 0 16px;
  color: #0f172a;
}

.field-group {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
}

.field-group label {
  font-size: 0.95rem;
  color: #334155;
  font-weight: 600;
}

.field-group input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px 14px;
  color: #0f172a;
  background: #f8fafc;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.pos-main {
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 0;
}

@media (max-width: 900px) {
  .pos-main {
    flex-direction: column;
  }
}
</style>

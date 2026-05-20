<template>
  <aside class="cart-panel">
    <div class="cart-header">
      <h2>🛒 Cart <span class="cart-count">{{ cartTotalItems }}</span></h2>
      <button class="btn-icon" @click="$emit('clear-cart')" title="Clear Cart" v-if="cart.length > 0">🗑️</button>
    </div>

    <div class="cart-items" v-if="cart.length > 0">
      <div
        v-for="(item, index) in cart"
        :key="item.product.id"
        class="cart-item"
      >
        <div class="item-info">
          <div class="item-name">{{ item.product.name }}</div>
          <div class="item-unit-price">₱{{ formatNumber(item.product.price) }} each</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" @click="$emit('decrement-qty', index)">−</button>
          <span class="qty-value">{{ item.quantity }}</span>
          <button class="qty-btn" @click="$emit('increment-qty', index)" :disabled="item.quantity >= item.product.stock">+</button>
        </div>
        <span class="item-total">₱{{ formatNumber(item.product.price * item.quantity) }}</span>
        <button class="remove-btn" @click="$emit('remove-from-cart', index)" title="Remove item">×</button>
      </div>
    </div>

    <div v-else class="cart-empty">
      <div class="empty-icon">🛒</div>
      <p>Your cart is empty</p>
      <p style="font-size: 0.8rem; opacity: 0.7;">Add some products to get started</p>
    </div>

    <div class="cart-footer" v-if="cart.length > 0">
      <div class="totals-row">
        <span>Subtotal:</span>
        <span>₱{{ formatNumber(subtotal) }}</span>
      </div>
      <div class="totals-row discount-row" v-if="discountAmount > 0">
        <span>Discount ({{ discountType === 'percentage' ? discountValue + '%' : '₱' + formatNumber(discountValue) }}):</span>
        <span>-₱{{ formatNumber(discountAmount) }}</span>
      </div>
      <div class="totals-row grand-total">
        <span>Total:</span>
        <span>₱{{ formatNumber(total) }}</span>
      </div>

      <div class="discount-input-row" v-if="showDiscountInput">
        <select :value="discountType" @change="$emit('update:discountType', $event.target.value)">
          <option value="percentage">%</option>
          <option value="fixed">₱</option>
        </select>
        <input
          type="number"
          :value="discountValue"
          @input="$emit('update:discountValue', Number($event.target.value))"
          placeholder="Enter discount"
          min="0"
          :max="discountType === 'percentage' ? 100 : subtotal"
        >
      </div>

      <div class="cart-actions">
        <button class="btn btn-outline" @click="showDiscountInput = !showDiscountInput">
          💰 Discount
        </button>
        <button class="btn btn-primary" @click="$emit('checkout')" :disabled="cart.length === 0">
          💳 Checkout
        </button>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'CartPanel',
  props: {
    cart: {
      type: Array,
      required: true
    },
    discountType: {
      type: String,
      default: 'percentage'
    },
    discountValue: {
      type: Number,
      default: 0
    }
  },
  emits: [
    'clear-cart',
    'remove-from-cart',
    'increment-qty',
    'decrement-qty',
    'checkout',
    'update:discountValue',
    'update:discountType'
  ],
  data() {
    return {
      showDiscountInput: false
    }
  },
  computed: {
    cartTotalItems() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },

    subtotal() {
      return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    },

    discountAmount() {
      if (this.discountValue <= 0) return 0;

      if (this.discountType === 'percentage') {
        return (this.subtotal * this.discountValue) / 100;
      } else {
        return Math.min(this.discountValue, this.subtotal);
      }
    },

    total() {
      return this.subtotal - this.discountAmount;
    }
  },
  methods: {
    formatNumber(num) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }
}
</script>

<style scoped>
:root {
  --primary: #4F46E5;
  --primary-light: #EEF2FF;
  --success: #10B981;
  --success-light: #ECFDF5;
  --danger: #EF4444;
  --danger-light: #FEF2F2;
  --surface: #FFFFFF;
  --surface-alt: #F8FAFC;
  --border: #E2E8F0;
  --text: #1E293B;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.08);
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --bg: #F1F5F9;
}

.cart-panel {
  width: 420px;
  background: var(--surface);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: var(--shadow-lg);
  z-index: 5;
}

.cart-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.cart-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-count {
  background: var(--primary);
  color: #fff;
  font-size: 0.7rem;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.btn-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.btn-icon:hover {
  background: var(--bg);
  border-color: #cbd5e1;
  color: var(--text);
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cart-items::-webkit-scrollbar {
  width: 4px;
}

.cart-items::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--surface-alt);
  border-radius: var(--radius);
  transition: var(--transition);
  border: 1px solid transparent;
}

.cart-item:hover {
  border-color: var(--border);
}

.cart-item .item-info {
  flex: 1;
  min-width: 0;
}

.cart-item .item-name {
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item .item-unit-price {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.cart-item .qty-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  color: var(--text);
  user-select: none;
}

.qty-btn:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
}

.qty-btn:active {
  background: var(--primary);
  color: #fff;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-value {
  width: 36px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  user-select: none;
}

.cart-item .item-total {
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
  min-width: 55px;
  text-align: right;
  color: var(--text);
}

.remove-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 1rem;
  transition: var(--transition);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: var(--danger-light);
  color: var(--danger);
}

.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 12px;
  padding: 40px;
}

.cart-empty .empty-icon {
  font-size: 3rem;
  opacity: 0.5;
}

.cart-empty p {
  font-weight: 500;
  font-size: 0.9rem;
}

.cart-footer {
  border-top: 1px solid var(--border);
  padding: 16px 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--surface-alt);
  border-radius: 0 0 0 var(--radius-lg);
}

.totals-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.totals-row.discount-row {
  color: var(--success);
  font-weight: 600;
}

.totals-row.grand-total {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
  padding-top: 8px;
  border-top: 2px dashed var(--border);
  margin-top: 4px;
}

.discount-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.discount-input-row select {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border);
  font-size: 0.8rem;
  background: var(--surface);
  cursor: pointer;
  font-weight: 500;
  outline: none;
}

.discount-input-row select:focus {
  border-color: var(--primary);
}

.discount-input-row input {
  flex: 1;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border);
  font-size: 0.85rem;
  outline: none;
  transition: var(--transition);
  width: 90px;
}

.discount-input-row input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.06);
}

.cart-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 12px 20px;
  border-radius: var(--radius-xl);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  flex: 1;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.btn-primary:hover {
  background: #4338CA;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #c7d2fe;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.btn-outline {
  background: var(--surface);
  border: 1.5px solid var(--border);
  color: var(--text);
  flex: 1;
}

.btn-outline:hover {
  background: var(--bg);
  border-color: #cbd5e1;
}

@media (max-width: 900px) {
  .cart-panel {
    width: 100%;
    max-height: 45vh;
    border-left: none;
    border-top: 1px solid var(--border);
  }
}
</style>

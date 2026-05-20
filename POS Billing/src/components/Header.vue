<template>
  <header class="pos-header">
    <div class="brand">
      <div class="logo">P</div>
      <div>
        <h1>POS Billing</h1>
        <span>Connected to Inventory</span>
      </div>
    </div>
    <div class="header-actions">
      <span class="invoice-counter">📋 #{{ currentInvoiceNumber }}</span>
      <button class="btn-icon" @click="$emit('toggle-history')" title="Transaction History">
        📜
      </button>
      <button class="btn-icon" @click="$emit('open-config')" title="Configure API">
        ⚙️
      </button>
      <button class="btn-icon" @click="$emit('refresh-products')" title="Sync Inventory">
        🔄
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    currentInvoiceNumber: {
      type: Number,
      required: true
    }
  },
  emits: ['toggle-history', 'refresh-products', 'open-config']
}
</script>

<style scoped>
:root {
  --primary: #4F46E5;
  --primary-light: #EEF2FF;
  --surface: #FFFFFF;
  --border: #E2E8F0;
  --text: #1E293B;
  --text-secondary: #64748B;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --radius: 12px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.pos-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  z-index: 10;
  box-shadow: var(--shadow-sm);
}

.pos-header .brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pos-header .brand .logo {
  width: 42px;
  height: 42px;
  background: var(--primary);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -1px;
}

.pos-header .brand h1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.3px;
}

.pos-header .brand span {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.pos-header .header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pos-header .invoice-counter {
  background: var(--primary-light);
  color: var(--primary);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.3px;
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
  background: #F1F5F9;
  border-color: #cbd5e1;
  color: var(--text);
}
</style>

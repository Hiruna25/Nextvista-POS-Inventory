<template>
  <div v-if="showPaymentModal" class="modal-overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <h2>💳 Payment</h2>
      <div class="amount-display">₱{{ formatNumber(total) }}</div>

      <div class="payment-methods">
        <button
          v-for="method in paymentMethods"
          :key="method.id"
          class="pay-method-btn"
          :class="{ selected: selectedPaymentMethod === method.id }"
          @click="selectedPaymentMethod = method.id"
        >
          {{ method.name }}
        </button>
      </div>

      <div v-if="selectedPaymentMethod === 'cash'" class="cash-input-row">
        <input
          type="number"
          v-model.number="localCashReceived"
          @input="calculateChange"
          placeholder="Cash received"
          min="0"
          step="0.01"
          ref="cashInput"
        >
        <span>₱</span>
      </div>

      <div v-if="selectedPaymentMethod === 'cash' && localCashReceived > 0" class="change-display" :class="{ positive: change >= 0, negative: change < 0 }">
        {{ change >= 0 ? `Change: ₱${formatNumber(change)}` : `Short: ₱${formatNumber(Math.abs(change))}` }}
      </div>

      <div v-if="selectedPaymentMethod === 'cash'" class="quick-cash-btns">
        <button
          v-for="amount in quickCashAmounts"
          :key="amount"
          class="quick-cash-btn"
          @click="setQuickCash(amount)"
        >
          ₱{{ formatNumber(amount) }}
        </button>
      </div>

      <div class="modal-actions">
        <button class="btn btn-outline" @click="$emit('close')">Cancel</button>
        <button
          class="btn btn-primary"
          @click="$emit('complete-payment', { paymentMethod: selectedPaymentMethod, cashReceived: localCashReceived })"
          :disabled="!canCompletePayment"
        >
          Complete Payment
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentModal',
  props: {
    showPaymentModal: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      required: true
    }
  },
  emits: ['close', 'complete-payment'],
  data() {
    return {
      selectedPaymentMethod: 'cash',
      localCashReceived: 0,
      paymentMethods: [
        { id: 'cash', name: '💵 Cash' },
        { id: 'card', name: '💳 Card' },
        { id: 'digital', name: '📱 Digital Wallet' }
      ],
      quickCashAmounts: [100, 200, 500, 1000]
    }
  },
  computed: {
    change() {
      if (this.selectedPaymentMethod !== 'cash' || this.localCashReceived <= 0) return 0;
      return this.localCashReceived - this.total;
    },

    canCompletePayment() {
      if (this.selectedPaymentMethod === 'cash') {
        return this.localCashReceived >= this.total;
      }
      return true;
    }
  },
  methods: {
    formatNumber(num) {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    setQuickCash(amount) {
      this.localCashReceived = amount;
      this.calculateChange();
    },
    calculateChange() {
      // Change calculation is handled in computed properties
    }
  },
  watch: {
    showPaymentModal(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$refs.cashInput) {
            this.$refs.cashInput.focus();
          }
        });
      }
    }
  }
}
</script>

<style scoped>
:root {
  --primary: #4F46E5;
  --primary-light: #EEF2FF;
  --primary-dark: #4338CA;
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
  --radius-xl: 20px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: var(--surface);
  border-radius: var(--radius-xl);
  padding: 28px;
  width: 90%;
  max-width: 480px;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.25s ease;
  max-height: 85vh;
  overflow-y: auto;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal .amount-display {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text);
  padding: 16px;
  background: var(--surface-alt);
  border-radius: var(--radius);
  margin-bottom: 16px;
  letter-spacing: -1px;
}

.payment-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}

.pay-method-btn {
  padding: 14px;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: var(--transition);
  text-align: center;
}

.pay-method-btn:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.pay-method-btn.selected {
  border-color: var(--primary);
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 700;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
}

.cash-input-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}

.cash-input-row input {
  flex: 1;
  padding: 12px 16px;
  border-radius: var(--radius);
  border: 2px solid var(--border);
  font-size: 1.1rem;
  font-weight: 600;
  outline: none;
  transition: var(--transition);
}

.cash-input-row input:focus {
  border-color: var(--primary);
}

.change-display {
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 10px;
  border-radius: var(--radius);
  margin-bottom: 12px;
}

.change-display.positive {
  background: var(--success-light);
  color: var(--success);
}

.change-display.negative {
  background: var(--danger-light);
  color: var(--danger);
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-actions .btn {
  flex: 1;
}

.quick-cash-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.quick-cash-btn {
  padding: 8px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: var(--transition);
  white-space: nowrap;
}

.quick-cash-btn:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
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
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.btn-primary:hover {
  background: var(--primary-dark);
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
}

.btn-outline:hover {
  background: #F1F5F9;
  border-color: #cbd5e1;
}
</style>

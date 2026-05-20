<template>
  <div class="receipt-print-area" v-if="lastTransaction">
    <div class="store-name">POS BILLING SYSTEM</div>
    <div class="store-address">123 Main Street, City, Country</div>
    <div class="divider"></div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in lastTransaction.items" :key="item.product.id">
          <td>{{ item.product.name }}</td>
          <td class="text-right">{{ item.quantity }}</td>
          <td class="text-right">{{ formatNumber(item.product.price) }}</td>
          <td class="text-right">{{ formatNumber(item.product.price * item.quantity) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="divider"></div>
    <div class="totals-row">
      <span>Subtotal:</span>
      <span>₱{{ formatNumber(lastTransaction.subtotal) }}</span>
    </div>
    <div v-if="lastTransaction.discountAmount > 0" class="totals-row">
      <span>Discount:</span>
      <span>-₱{{ formatNumber(lastTransaction.discountAmount) }}</span>
    </div>
    <div class="totals-row total-line">
      <span>TOTAL:</span>
      <span>₱{{ formatNumber(lastTransaction.total) }}</span>
    </div>
    <div class="divider"></div>
    <div>Payment: {{ lastTransaction.paymentMethod.toUpperCase() }}</div>
    <div v-if="lastTransaction.change > 0">Change: ₱{{ formatNumber(lastTransaction.change) }}</div>
    <div class="divider"></div>
    <div style="text-align: center; font-size: 10px;">Thank you for your business!</div>
  </div>
</template>

<script>
export default {
  name: 'Receipt',
  props: {
    lastTransaction: {
      type: Object,
      default: null
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
.receipt-print-area {
  display: none;
}

@media print {
  :global(body *) {
    visibility: hidden;
  }
  
  :global(.receipt-print-area),
  :global(.receipt-print-area *) {
    visibility: visible;
  }
  
  .receipt-print-area {
    display: block !important;
    position: fixed;
    left: 0;
    top: 0;
    width: 80mm;
    padding: 10mm 5mm;
    font-family: 'Courier New', monospace;
    font-size: 11px;
    color: #000;
    background: #fff;
    z-index: 99999;
  }
  
  .store-name {
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 4px;
  }
  
  .store-address {
    text-align: center;
    font-size: 9px;
    margin-bottom: 8px;
  }
  
  .divider {
    border-top: 1px dashed #000;
    margin: 6px 0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  table th,
  table td {
    font-size: 10px;
    padding: 2px 0;
    text-align: left;
  }
  
  .text-right {
    text-align: right;
  }
  
  .bold {
    font-weight: bold;
  }
  
  .total-line {
    font-size: 13px;
    font-weight: bold;
  }
  
  .totals-row {
    display: flex;
    justify-content: space-between;
  }
  
  @page {
    margin: 0;
    size: 80mm auto;
  }
}
</style>

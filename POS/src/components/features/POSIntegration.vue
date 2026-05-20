<template>
  <Card>
    <template #header>
      <h2><i class="fas fa-cash-register"></i> POS System Integration</h2>
      <div>
        <Button @click="$emit('sync')" variant="primary" size="sm">
          <i class="fas fa-sync-alt"></i> Sync Now
        </Button>
        <Button @click="$emit('configure')" variant="secondary" size="sm" style="margin-left: 10px">
          <i class="fas fa-cog"></i> Configure
        </Button>
      </div>
    </template>
    <div class="pos-status">
      <div :class="['pos-status-indicator', posConnected ? 'pos-status-connected' : 'pos-status-disconnected']"></div>
      <span>POS System: {{ posConnected ? 'Connected' : 'Disconnected' }}</span>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Last Sync</label>
        <p>{{ lastPOSSyncFormatted }}</p>
      </div>
      <div class="form-group">
        <label>Transactions Today</label>
        <p>{{ posTransactionsToday }}</p>
      </div>
      <div class="form-group">
        <label>Items Sold Today</label>
        <p>{{ posItemsSoldToday }}</p>
      </div>
      <div class="form-group">
        <label>Revenue Today</label>
        <p>{{ formatCurrency(todayRevenue) }}</p>
      </div>
    </div>

    <h3>Recent Transactions</h3>
    <div style="max-height: 300px; overflow-y: auto">
      <div v-for="transaction in recentPOSTransactions.slice(0, 5)" :key="transaction.id" class="pos-transaction">
        <div><strong>#{{ transaction.id }}</strong> - {{ formatCurrency(transaction.total_amount) }}</div>
      </div>
      <div v-if="recentPOSTransactions.length === 0">No recent transactions</div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { POSTransaction } from '@/types'
import { useFormatting } from '@/composables/useFormatting'
import Card from '@/components/shared/Card.vue'
import Button from '@/components/shared/Button.vue'

const props = defineProps<{
  posConnected: boolean
  lastPOSSync: string | null
  posTransactions: POSTransaction[]
  recentPOSTransactions: POSTransaction[]
}>()

defineEmits<{
  sync: []
  configure: []
}>()

const { formatCurrency, formatShortDate } = useFormatting()

const lastPOSSyncFormatted = computed(() => {
  return props.lastPOSSync ? formatShortDate(props.lastPOSSync) : 'Never'
})

const posTransactionsToday = computed(() => {
  const today = new Date().toDateString()
  return props.posTransactions.filter(t => new Date(t.transaction_date).toDateString() === today).length
})

const posItemsSoldToday = computed(() => {
  const today = new Date().toDateString()
  return props.posTransactions
    .filter(t => new Date(t.transaction_date).toDateString() === today)
    .reduce((sum, t) => sum + t.quantity, 0)
})

const todayRevenue = computed(() => {
  const today = new Date().toDateString()
  return props.posTransactions
    .filter(t => new Date(t.transaction_date).toDateString() === today)
    .reduce((sum, t) => sum + t.total_amount, 0)
})
</script>

<style scoped>
.pos-status {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.pos-status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.pos-status-connected {
  background-color: #27ae60;
  box-shadow: 0 0 5px #27ae60;
}

.pos-status-disconnected {
  background-color: #e74c3c;
  box-shadow: 0 0 5px #e74c3c;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 150px;
}

.form-group label {
  font-weight: 500;
  color: #7f8c8d;
  font-size: 14px;
}

.form-group p {
  margin: 5px 0 0 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

h3 {
  margin: 20px 0 10px 0;
  color: #2c3e50;
  font-size: 16px;
}

.pos-transaction {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 13px;
}

.pos-transaction:last-child {
  border-bottom: none;
}
</style>

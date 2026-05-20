<template>
  <Card>
    <template #header>
      <h2><i class="fas fa-magic"></i> Replenishment Suggestions</h2>
      <div style="display: flex; gap: 10px;">
        <Button @click="refreshSuggestions" variant="secondary" size="sm" icon="fas fa-sync-alt">
          Refresh
        </Button>
        <div style="display: flex; gap: 5px;">
          <Button 
            @click="priorityFilter = null" 
            :variant="priorityFilter === null ? 'primary' : 'secondary'" 
            size="sm"
          >
            All
          </Button>
          <Button 
            @click="priorityFilter = 'critical'" 
            :variant="priorityFilter === 'critical' ? 'primary' : 'secondary'" 
            size="sm"
          >
            Critical
          </Button>
          <Button 
            @click="priorityFilter = 'high'" 
            :variant="priorityFilter === 'high' ? 'primary' : 'secondary'" 
            size="sm"
          >
            High
          </Button>
        </div>
      </div>
    </template>

    <div class="suggestions-list">
      <div v-if="suggestions.length === 0" class="empty-state">
        <i class="fas fa-check-circle"></i>
        <p>All stock levels are optimal! No replenishment needed.</p>
      </div>

      <div v-for="suggestion in suggestions" :key="suggestion.id" :class="['suggestion-card', `priority-${suggestion.priority}`]">
        <div class="suggestion-header">
          <div>
            <h3>{{ suggestion.name }}</h3>
            <span v-if="suggestion.supplierName" style="color: #7f8c8d; font-size: 12px;">
              {{ suggestion.supplierName }}
            </span>
          </div>
          <span :class="['priority', `priority-${suggestion.priority}`]">
            {{ suggestion.priority.toUpperCase() }}
          </span>
        </div>

        <div class="suggestion-details">
          <div class="detail-row">
            <span>Current Stock:</span>
            <strong>{{ suggestion.currentStock }} units</strong>
          </div>
          <div class="detail-row">
            <span>Min. Threshold:</span>
            <strong>{{ suggestion.threshold }} units</strong>
          </div>
          <div class="detail-row">
            <span>Max. Stock Level:</span>
            <strong>{{ suggestion.maxStock }} units</strong>
          </div>
          <div class="detail-row">
            <span>Recommended Order:</span>
            <strong class="highlight">{{ suggestion.recommendedQty }} units</strong>
          </div>
          <div class="detail-row">
            <span>Estimated Cost:</span>
            <strong>{{ formatCurrency(suggestion.estimatedCost) }}</strong>
          </div>
          <div class="detail-row">
            <span>Days to Stockout:</span>
            <strong :class="suggestion.daysToStockout <= 7 ? 'urgent' : ''">
              {{ suggestion.daysToStockout }} days
            </strong>
          </div>
        </div>

        <div class="suggestion-actions">
          <Button @click="createOrder(suggestion)" variant="success" size="sm" icon="fas fa-shopping-cart">
            Create Order
          </Button>
          <Button @click="addToCart(suggestion)" variant="info" size="sm" icon="fas fa-cart-plus">
            Add to Cart
          </Button>
          <Button @click="dismiss(suggestion.id)" variant="cancel" size="sm">
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '@/types'
import { useFormatting } from '@/composables/useFormatting'
import Card from '@/components/shared/Card.vue'
import Button from '@/components/shared/Button.vue'

const props = defineProps<{
  inventory: Product[]
  selectedBranch: number
  getCurrentBranchStock: (product: Product, branch: number) => number
}>()

const emit = defineEmits<{
  'create-order': [product: Product]
  'add-to-cart': [product: Product]
}>()

const { formatCurrency } = useFormatting()

const dismissedItems = ref<(string | number)[]>([])
const priorityFilter = ref<'critical' | 'high' | 'medium' | null>(null)

const suggestions = computed(() => {
  return props.inventory
    .filter((product) => {
      const stock = props.getCurrentBranchStock(product, props.selectedBranch)
      const threshold = product.lowStockThreshold ?? product.min_stock_level ?? 10
      // Only show items that are below threshold and not dismissed
      return stock <= threshold && !dismissedItems.value.includes(product.id)
    })
    .map((product) => {
      const currentStock = props.getCurrentBranchStock(product, props.selectedBranch)
      const threshold = product.lowStockThreshold ?? product.min_stock_level ?? 10
      const maxStock = product.max_stock_level ?? threshold * 3
      const dailySales = product.dailySales ?? 1
      const daysToStockout = dailySales > 0 ? Math.ceil(currentStock / dailySales) : 999

      // Calculate recommended quantity to reach optimal stock level
      const optimalStock = Math.max(maxStock, threshold * 2)
      const recommendedQty = Math.max(optimalStock - currentStock, threshold)

      // Calculate priority based on days to stockout and current stock level
      let priority: 'critical' | 'high' | 'medium'
      if (daysToStockout <= 2 || currentStock === 0) {
        priority = 'critical'
      } else if (daysToStockout <= 7 || currentStock <= threshold * 0.5) {
        priority = 'high'
      } else {
        priority = 'medium'
      }

      return {
        id: product.id,
        name: product.name,
        supplierName: product.supplier_name,
        currentStock,
        threshold,
        maxStock,
        recommendedQty,
        estimatedCost: recommendedQty * product.cost,
        daysToStockout,
        priority,
        product
      }
    })
    .filter((suggestion) => priorityFilter.value === null || suggestion.priority === priorityFilter.value)
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2 }
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) -
             (priorityOrder[b.priority as keyof typeof priorityOrder] || 3)
    })
})

const refreshSuggestions = () => {
  dismissedItems.value = []
}

const createOrder = (suggestion: any) => {
  emit('create-order', suggestion.product)
}

const addToCart = (suggestion: any) => {
  emit('add-to-cart', suggestion.product)
}

const dismiss = (productId: string | number) => {
  dismissedItems.value.push(productId)
}
</script>

<style scoped>
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #27ae60;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 10px;
}

.suggestion-card {
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  padding: 15px;
  background: #f8fafc;
  border-left: 4px solid #f39c12;
}

.suggestion-card.priority-critical {
  border-left-color: #e74c3c;
  background: #fadbd8;
}

.suggestion-card.priority-high {
  border-left-color: #f39c12;
  background: #fdeaa7;
}

.suggestion-card.priority-medium {
  border-left-color: #3498db;
  background: #d4e6f1;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 10px;
}

.suggestion-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
}

.priority {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.priority-critical {
  background: #e74c3c;
}

.priority-high {
  background: #f39c12;
}

.priority-medium {
  background: #3498db;
}

.suggestion-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
  padding: 12px 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.detail-row span {
  color: #7f8c8d;
}

.detail-row strong {
  color: #2c3e50;
  font-weight: 600;
}

.detail-row .highlight {
  color: #27ae60;
  font-size: 16px;
}

.detail-row .urgent {
  color: #e74c3c;
}

.suggestion-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>

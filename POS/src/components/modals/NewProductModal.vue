<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose" @keydown.esc="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h3>
          <i class="fas fa-plus-circle"></i> Add New Product
        </h3>
        <button @click="handleClose" class="close-btn" title="Close (ESC)">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <Newproduct
          :categories="categories"
          :suppliers="suppliers"
          :show-dirty-warning="true"
          @add-product="handleAddProduct"
          @close="handleClose"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, Category, Supplier } from '@/types'
import Newproduct from '@/components/features/newproduct.vue'

interface Props {
  isOpen: boolean
  categories: Category[]
  suppliers: Supplier[]
}

interface Emits {
  'close': []
  'save': [product: Product]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = () => {
  emit('close')
}

const handleAddProduct = (product: Product) => {
  emit('save', product)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e0e6ed;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-header i {
  font-size: 22px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 20px;
  color: white;
  cursor: pointer;
  padding: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.modal-body {
  padding: 24px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
    max-height: 95vh;
  }

  .modal-header {
    padding: 16px;
  }

  .modal-header h3 {
    font-size: 18px;
  }

  .modal-body {
    padding: 16px;
  }
}
</style>

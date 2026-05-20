<template>
  <section class="products-panel">
    <div class="search-bar">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          v-model="localSearchQuery"
          @keyup.enter="$emit('barcode-scan', localSearchQuery)"
          placeholder="Search products by name or scan barcode..."
          ref="searchInput"
          autofocus
        >
      </div>
      <span class="barcode-hint">🔎 Enter = Barcode</span>
    </div>

    <div class="category-filters">
      <button
        class="cat-pill"
        :class="{ active: activeCategory === 'all' }"
        @click="activeCategory = 'all'"
      >All</button>
      <button
        v-for="cat in categories"
        :key="cat"
        class="cat-pill"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >{{ cat }}</button>
    </div>

    <div class="product-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        :class="{ 'out-of-stock': product.stock <= 0 }"
        @click="$emit('add-to-cart', product)"
      >
        <span class="prod-category">{{ product.category }}</span>
        <span class="prod-name">{{ product.name }}</span>
        <span class="prod-price">₱{{ formatNumber(product.price) }}</span>
        <span
          class="prod-stock"
          :class="{ low: product.stock > 0 && product.stock <= 5, out: product.stock <= 0 }"
        >
          {{ product.stock <= 0 ? 'Out of stock' : 'Stock: ' + product.stock }}
        </span>
        <button class="quick-add" @click.stop="$emit('add-to-cart', product)" :disabled="product.stock <= 0">+</button>
      </div>
      <div v-if="filteredProducts.length === 0" class="no-products">
        <p>😕 No products found matching "{{ localSearchQuery }}"</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ProductsPanel',
  props: {
    products: {
      type: Array,
      required: true
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  emits: ['add-to-cart', 'barcode-scan', 'update:searchQuery'],
  data() {
    return {
      activeCategory: 'all',
      localSearchQuery: ''
    }
  },
  computed: {
    categories() {
      const cats = [...new Set(this.products.map(p => p.category))];
      return cats.sort();
    },

    filteredProducts() {
      let filtered = this.products;

      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === this.activeCategory);
      }

      if (this.localSearchQuery.trim()) {
        const query = this.localSearchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }

      return filtered;
    }
  },
  watch: {
    searchQuery(newVal) {
      this.localSearchQuery = newVal;
    },
    localSearchQuery(newVal) {
      this.$emit('update:searchQuery', newVal);
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
  --surface: #FFFFFF;
  --surface-alt: #F8FAFC;
  --border: #E2E8F0;
  --text: #1E293B;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  --warning: #F59E0B;
  --danger: #EF4444;
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.products-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
  gap: 16px;
}

.search-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
}

.search-input-wrap {
  flex: 1;
  position: relative;
}

.search-input-wrap input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid var(--border);
  border-radius: var(--radius-xl);
  font-size: 0.95rem;
  background: var(--surface);
  transition: var(--transition);
  outline: none;
  color: var(--text);
}

.search-input-wrap input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
}

.search-input-wrap .search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 1.1rem;
  pointer-events: none;
}

.barcode-hint {
  font-size: 0.7rem;
  color: var(--text-muted);
  white-space: nowrap;
  font-weight: 500;
  background: var(--surface-alt);
  padding: 8px 14px;
  border-radius: 20px;
}

.category-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.cat-pill {
  padding: 8px 18px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 500;
  transition: var(--transition);
  white-space: nowrap;
  color: var(--text-secondary);
  user-select: none;
}

.cat-pill:hover {
  border-color: #cbd5e1;
  background: var(--surface-alt);
}

.cat-pill.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  font-weight: 600;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 12px;
  overflow-y: auto;
  flex: 1;
  padding-right: 4px;
  align-content: start;
}

.product-grid::-webkit-scrollbar {
  width: 5px;
}

.product-grid::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.product-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  user-select: none;
  min-height: 130px;
}

.product-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.product-card:active {
  transform: scale(0.97);
}

.product-card.out-of-stock {
  opacity: 0.55;
  cursor: not-allowed;
  pointer-events: none;
}

.product-card .prod-category {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--primary);
  font-weight: 700;
  background: var(--primary-light);
  padding: 4px 10px;
  border-radius: 12px;
  align-self: flex-start;
}

.product-card .prod-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text);
  line-height: 1.3;
  flex: 1;
}

.product-card .prod-price {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--text);
  letter-spacing: -0.3px;
}

.product-card .prod-stock {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 500;
}

.product-card .prod-stock.low {
  color: var(--warning);
  font-weight: 600;
}

.product-card .prod-stock.out {
  color: var(--danger);
  font-weight: 600;
}

.product-card .quick-add {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  opacity: 0;
  transform: scale(0.8);
}

.product-card:hover .quick-add {
  opacity: 1;
  transform: scale(1);
}

.product-card .quick-add:hover {
  background: var(--primary);
  color: #fff;
}

.no-products {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
  font-size: 1rem;
}

@media (max-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>

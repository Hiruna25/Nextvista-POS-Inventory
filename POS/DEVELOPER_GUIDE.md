# 🚀 Quick Start Guide for Developers

## Installation & Setup

### Prerequisites
- Node.js 14+
- npm or yarn

### Getting Started (2 minutes)
```bash
# 1. Navigate to project
cd "new folder (2)"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Visit http://localhost:5173

# 5. Build for production
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/          # All Vue components
│   ├── shared/         # Reusable components
│   │   ├── Button.vue              # Button component
│   │   ├── Card.vue                # Card wrapper
│   │   └── Notification.vue        # Notification toast
│   ├── dashboard/      # Dashboard specific
│   │   └── SummaryCard.vue         # Metric cards
│   ├── features/       # Feature components
│   │   ├── InventoryTable.vue      # Product table
│   │   ├── AnalyticsSection.vue    # Analytics tabs
│   │   ├── ReplenishmentSuggestions.vue
│   │   ├── POSIntegration.vue      # POS status
│   │   └── SupplierPortal.vue      # Supplier orders
│   └── modals/         # Modal dialogs
│       ├── ProductModal.vue        # Add/Edit products
│       ├── StockAdjustmentModal.vue # Stock changes
│       └── HistoryModal.vue        # History view
├── composables/         # Reusable logic (Vue hooks)
│   ├── useInventoryData.ts    # Mock data loading
│   ├── useFormatting.ts       # Currency, date formatting
│   ├── useStockCalculations.ts # Stock math
│   ├── useNotification.ts     # Notification system
│   ├── useCharts.ts           # Chart generation
│   ├── useFilters.ts          # Advanced filtering
│   └── useExport.ts           # CSV/JSON export
├── types/               # TypeScript interfaces
│   └── index.ts         # All type definitions
├── utils/               # Helper functions
│   └── helpers.ts       # Utility functions
├── App.vue              # Root component
├── main.ts              # Application entry point
└── style.css            # Global styles
```

---

## 🎯 Core Concepts

### Components (Vue 3 Composition API)
```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '@/types'

// Props
const props = defineProps<{ product: Product }>()

// Emits
const emit = defineEmits<{ save: [data: Product] }>()

// Reactive state
const isOpen = ref(false)

// Computed properties
const displayName = computed(() => props.product.name.toUpperCase())

// Methods
const handleClick = () => {
  isOpen.value = !isOpen.value
}
</script>
```

### Composables (Reusable Logic)
```typescript
// composable pattern
export function useMyFeature() {
  const data = ref([])
  
  const filteredData = computed(() => {
    return data.value.filter(item => item.active)
  })
  
  const loadData = async () => {
    // logic here
  }
  
  return { data, filteredData, loadData }
}

// Usage in component:
const { data, filteredData, loadData } = useMyFeature()
```

### TypeScript Types
```typescript
// Define data models
export interface Product {
  id: number
  name: string
  categoryId: string | number
  supplierId: string | number
  cost: number
  price: number
  barcode: string
  lowStockThreshold: number
  dailySales: number
  description?: string
  branchStock: BranchStock[]
  lastUpdated: string
}

export interface BranchStock {
  branchId: number
  quantity: number
}
```

---

## 🎨 Styling Guide

### Colors
```css
/* Primary Gradient */
--primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--success: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
--danger: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
--warning: linear-gradient(135deg, #f39c12 0%, #d68910 100%);
--info: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
```

### Button Variants
```html
<!-- Primary Blue -->
<Button variant="primary">Save</Button>

<!-- Success Green -->
<Button variant="success">Create</Button>

<!-- Danger Red -->
<Button variant="danger">Delete</Button>

<!-- Info -->
<Button variant="info">Export</Button>

<!-- With Icon -->
<Button variant="success" icon="fas fa-plus">Add</Button>

<!-- Sizes -->
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

### Card Styling
```html
<Card>
  <template #header>
    <h2>Title</h2>
  </template>
  <!-- Card body content -->
</Card>
```

### Notification Types
```typescript
// Success
showNotification('success', 'Product saved!')

// Error
showNotification('error', 'Failed to save')

// Warning
showNotification('warning', 'Low stock alert')

// Info
showNotification('info', 'Data exported')
```

---

## 💾 Working with Data

### Loading Mock Data
```typescript
const { inventory, categories, suppliers, branches, loadInitialData } = useInventoryData()

onMounted(async () => {
  await loadInitialData() // Load mock data
})
```

### Formatting Values
```typescript
const { formatCurrency, formatDate } = useFormatting()

const price = 99.99
const display = formatCurrency(price) // $99.99

const date = new Date()
const formatted = formatDate(date) // formatted string
```

### Stock Calculations
```typescript
const { getCurrentBranchStock } = useStockCalculations()

const stock = getCurrentBranchStock(product, branchId)
```

### Exporting Data
```typescript
const { exportToCSV, exportToJSON, exportInventoryReport } = useExport()

// Export all inventory
exportInventoryReport(inventory, branchId, getCurrentBranchStock)

// Export to CSV
exportToCSV(data, 'filename.csv')

// Export to JSON
exportToJSON(data, 'filename.json')
```

---

## 🔄 Common Workflows

### Adding a Feature Component

1. **Create component file**
   ```bash
   src/components/features/MyFeature.vue
   ```

2. **Build with Composition API**
   ```typescript
   <template>
     <div class="my-feature">
       <!-- template -->
     </div>
   </template>

   <script setup lang="ts">
   import { ref, computed } from 'vue'
   
   // Component logic
   </script>

   <style scoped>
   /* Component styles */
   </style>
   ```

3. **Import in App.vue**
   ```typescript
   import MyFeature from '@/components/features/MyFeature.vue'
   ```

4. **Use in template**
   ```html
   <MyFeature :data="myData" @action="handleAction" />
   ```

### Adding a New Composable

1. **Create file**
   ```bash
   src/composables/useMyComposable.ts
   ```

2. **Implement hooks**
   ```typescript
   import { ref, computed } from 'vue'
   
   export function useMyComposable() {
     const data = ref([])
     
     const computed = computed(() => {
       // compute value
     })
     
     const action = () => {
       // do something
     }
     
     return { data, computed, action }
   }
   ```

3. **Use in components**
   ```typescript
   const { data, computed, action } = useMyComposable()
   ```

### Adding a Modal

1. **Create modal component**
   ```bash
   src/components/modals/MyModal.vue
   ```

2. **Define props and emits**
   ```typescript
   const props = defineProps<{ isOpen: boolean }>()
   const emit = defineEmits<{ close: []; save: [data: any] }>()
   ```

3. **Use overlay pattern**
   ```html
   <div v-if="isOpen" class="modal-overlay" @click="emit('close')">
     <div class="modal-content" @click.stop>
       <!-- content -->
     </div>
   </div>
   ```

4. **Add in App.vue**
   ```html
   <MyModal
     :is-open="showMyModal"
     @close="showMyModal = false"
     @save="handleSave"
   />
   ```

---

## 🧪 Testing Features

### Test Product Creation
1. Click "New Product" button
2. Fill form (name, category, supplier, cost, price)
3. Watch profit margin update
4. Click "Create Product"
5. See notification

### Test Stock Adjustment
1. Find product in table
2. Click "Adjust Stock" icon
3. Select adjustment type
4. Enter quantity
5. Click "Adjust"
6. View updated stock

### Test Export
1. Click "Export" button
2. CSV file downloads
3. Open in Excel/Google Sheets
4. Verify data completeness

### Test Responsive Design
1. Resize browser window
2. Check breakpoints: 1200px, 768px, 480px
3. Test on mobile device
4. Verify touch controls

---

## 🐛 Debugging Tips

### Console Errors
```typescript
// Check browser console (F12)
// Look for Vue errors and API failures
// Check Network tab for failed requests
```

### Component State
```typescript
// Use Vue DevTools
// Right-click → Inspect → Vue tab
// See reactive data and computed properties
```

### HMR Issues
```bash
# If changes not reflecting:
# 1. Save file again
# 2. Clear browser cache
# 3. Restart dev server
npm run dev
```

### Type Errors
```typescript
// If TypeScript errors appear:
// 1. Check @/types/index.ts for interface
// 2. Ensure proper type imports
// 3. Use Type<T> for generics
```

---

## 📦 Build & Deploy

### Development
```bash
npm run dev
# Runs on http://localhost:5173
# Hot Module Replacement enabled
```

### Production Build
```bash
npm run build
# Creates optimized dist/ folder
```

### Preview Built App
```bash
npm run preview
# Test production build locally
```

### Deploy
```bash
# Copy dist/ folder to web server
# Works with any static host (Netlify, Vercel, etc.)
```

---

## 🔗 Important Paths

- **Path Alias**: `@` = `src/`
- **Example**: `@/components/shared/Button.vue` = `src/components/shared/Button.vue`

---

## 📚 Key Files to Study

1. **src/App.vue** - Main application layout
2. **src/types/index.ts** - Data models
3. **src/composables/useInventoryData.ts** - Data management
4. **src/components/modals/ProductModal.vue** - Form example
5. **src/components/shared/Button.vue** - Component styling

---

## 🎯 Next Steps

1. **Run the app**: `npm run dev`
2. **Test all features**: Use USER_GUIDE.md
3. **Review code**: Start with App.vue
4. **Study patterns**: Look at existing components
5. **Make changes**: Follow the patterns
6. **Deploy**: Use `npm run build`

---

## 📖 Documentation Files

- **USER_GUIDE.md** - User-facing documentation
- **FEATURES_STATUS.md** - Feature checklist
- **IMPROVEMENTS_SUMMARY.md** - UI/UX details
- **CHANGES_SUMMARY.md** - What was changed
- **README.md** - Original project readme
- **COMPONENT_STRUCTURE.md** - Component details

---

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 5173 in use | Change port: `npm run dev -- --port 3000` |
| Components not found | Check @/ path alias in tsconfig.json |
| Styles not applying | Ensure `<style scoped>` syntax |
| Modal not closing | Check emit syntax and click handlers |
| Data not updating | Ensure using ref() for reactivity |
| TypeScript errors | Check type imports from @/types |

---

**Happy Coding! 🚀**

For more details, see the complete USER_GUIDE.md file.

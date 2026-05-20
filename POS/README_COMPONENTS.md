# NexusPos - Component-Based Inventory Management System

This is a modern Vue 3 + TypeScript inventory management system refactored into a modular, component-based architecture using the Composition API.

## Project Structure

```
src/
├── components/
│   ├── shared/           # Reusable base components
│   ├── dashboard/        # Dashboard components
│   ├── features/         # Feature-specific components
│   └── modals/           # Modal components
├── composables/          # Reusable logic (hooks)
├── types/                # TypeScript definitions
├── utils/                # Utility functions
├── stores/               # Global state management
├── App.vue               # Root component
└── main.ts               # Entry point
```

## Key Improvements from Original

### 1. **Component Structure**
- Monolithic HTML split into reusable, testable components
- Each component has a single responsibility
- Clear separation of concerns

### 2. **TypeScript Support**
- Full type safety with TypeScript
- Defined interfaces for all data types
- Better IDE autocomplete and error detection

### 3. **Composition API**
- Modern Vue 3 Composition API instead of Options API
- Better code reusability through composables
- Improved logic sharing between components

### 4. **Composables** (Custom Hooks)
- `useNotification()` - Notification management
- `useFormatting()` - Date and currency formatting
- `useStockCalculations()` - Stock level calculations
- `useInventoryData()` - Data loading and management

### 5. **Shared Components**
- `Button.vue` - Reusable button with variants
- `Card.vue` - Card wrapper component
- `Notification.vue` - Global notification display
- `SummaryCard.vue` - Dashboard summary cards

### 6. **Feature Components** (Partially Implemented)
- `InventoryTable.vue` - Product inventory table
- `POSIntegration.vue` - POS system integration
- `SupplierPortal.vue` - Supplier management

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173/`

## Component Communication

### Props (Parent → Child)
```typescript
<SummaryCard
  :value="lowStockCount"
  :trend="inventoryTrend.lowStock"
  :config="{ title: 'Low Stock', class: 'warning' }"
/>
```

### Emits (Child → Parent)
```typescript
defineEmits<{
  sort: [field: string]
  edit: [product: Product]
  'delete': [product: Product]
}>()
```

### Composables (Shared Logic)
```typescript
import { useNotification } from '@/composables/useNotification'
const { showNotification } = useNotification()
```

## Adding New Components

### Step 1: Create Component File
```typescript
// src/components/features/MyComponent.vue
<template>
  <div class="my-component">
    <!-- template -->
  </div>
</template>

<script setup lang="ts">
import type { MyType } from '@/types'
import { useMyComposable } from '@/composables/useMyComposable'

defineProps<{
  data: MyType[]
}>()

defineEmits<{
  'my-event': [value: string]
}>()

const { composableFunction } = useMyComposable()
</script>

<style scoped>
/* Component styles */
</style>
```

### Step 2: Create Composable (if needed)
```typescript
// src/composables/useMyComposable.ts
import { ref, computed } from 'vue'

export function useMyComposable() {
  const state = ref('')
  
  const processData = (data: unknown) => {
    // Logic here
  }
  
  return { state, processData }
}
```

### Step 3: Add Types (if needed)
```typescript
// src/types/index.ts
export interface MyType {
  id: number
  name: string
}
```

### Step 4: Use in Parent Component
```typescript
import MyComponent from '@/components/features/MyComponent.vue'

// Use in template
<MyComponent :data="myData" @my-event="handleEvent" />
```

## Next Steps to Complete

Create remaining feature components:
- [ ] Modal components (Product, Stock, History, etc.)
- [ ] AdvancedFilters.vue
- [ ] ForecastingSection.vue
- [ ] AnalyticsSection.vue
- [ ] ReplenishmentSuggestions.vue
- [ ] ReportsSection.vue

Create additional composables:
- [ ] useCharts() - Chart.js integration
- [ ] useFilters() - Filter logic
- [ ] useExport() - Export/import functionality

## Technology Stack

- **Vue 3** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Chart.js** - Data visualization
- **FontAwesome** - Icons
- **CSS** - Styling (scoped)

## State Management Strategy

Currently using composables for local state. For larger apps, consider:
- **Pinia** - Official state management
- **Stores folder** - Already created for future use

## Testing

Components are designed to be easily testable:
- Pure functions in composables
- Props-driven components
- No tight coupling

Suggested testing with:
- **Vitest** - Unit tests
- **Vue Test Utils** - Component testing

## Notes

- All components use `<script setup lang="ts">` syntax
- TypeScript strict mode enabled for safety
- Scoped styles to prevent style conflicts
- Responsive design with mobile support ready

## File Mapping

| Original HTML Section | Component |
|---|---|
| Notification | `Notification.vue` |
| Dashboard Cards | `SummaryCard.vue` |
| Inventory Table | `InventoryTable.vue` |
| POS Integration | `POSIntegration.vue` |
| Supplier Portal | `SupplierPortal.vue` |
| Modals | `components/modals/*` |

## Performance Optimizations

- Tree-shaking enabled with ES modules
- Lazy loading ready for modal components
- Optimized re-renders with computed properties
- Efficient list rendering with keys

---

For more information, see [COMPONENT_STRUCTURE.md](./COMPONENT_STRUCTURE.md)

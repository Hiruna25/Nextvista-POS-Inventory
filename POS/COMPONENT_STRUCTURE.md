# Component Architecture

## Folder Structure

```
src/
├── components/
│   ├── shared/              # Reusable base components
│   │   ├── Button.vue       # Styled button component
│   │   ├── Card.vue         # Card wrapper component
│   │   └── Notification.vue # Notification display
│   │
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── SummaryCard.vue  # Summary statistics card
│   │   └── DashboardGrid.vue
│   │
│   ├── features/            # Feature-specific components
│   │   ├── InventoryTable.vue
│   │   ├── InventoryControls.vue
│   │   ├── POSIntegration.vue
│   │   ├── SupplierPortal.vue
│   │   ├── ForecastingSection.vue
│   │   ├── AnalyticsSection.vue
│   │   ├── ReplenishmentSuggestions.vue
│   │   ├── ReportsSection.vue
│   │   └── AdvancedFilters.vue
│   │
│   └── modals/              # Modal components
│       ├── ProductModal.vue
│       ├── StockAdjustmentModal.vue
│       ├── HistoryModal.vue
│       ├── BarcodeModal.vue
│       ├── ImportModal.vue
│       ├── BulkEditModal.vue
│       ├── BranchModal.vue
│       └── SupplierOrderModal.vue
│
├── composables/             # Vue composables (reusable logic)
│   ├── useNotification.ts
│   ├── useFormatting.ts
│   ├── useStockCalculations.ts
│   ├── useInventoryData.ts
│   └── useCharts.ts (for chart handling)
│
├── types/                   # TypeScript type definitions
│   └── index.ts
│
├── utils/                   # Utility functions
│   └── helpers.ts
│
├── stores/                  # Pinia stores (optional, for global state)
│   └── inventoryStore.ts
│
├── App.vue                  # Root component
└── main.ts                  # Entry point
```

## Key Composables

- `useNotification()` - Manage notification display
- `useFormatting()` - Format currency, dates, etc.
- `useStockCalculations()` - Calculate stock levels, expiry, etc.
- `useInventoryData()` - Load and manage inventory data
- `useCharts()` - Initialize and update charts (Chart.js)

## Component Communication

1. **Parent to Child**: Props
2. **Child to Parent**: Emits
3. **Global State**: Composables (preferred) or Pinia stores
4. **Shared Logic**: Composables (useXxx pattern)

## Setup Instructions

1. All composables are already created
2. Shared components: Notification, Button, Card, SummaryCard
3. Add remaining feature components as needed
4. Import and use in App.vue
5. Each component can be developed and tested independently

##  Created Components

✓ Notification.vue
✓ Button.vue  
✓ Card.vue
✓ SummaryCard.vue
✓ useNotification.ts
✓ useFormatting.ts
✓ useStockCalculations.ts
✓ useInventoryData.ts
✓ helpers.ts (utilities)
✓ types/index.ts

## Next Steps

Create the remaining feature components:
- InventoryTable.vue
- POSIntegration.vue
- SupplierPortal.vue
- And modal components as needed

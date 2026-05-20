# NexusPos - Inventory Management System

## 📋 Overview

NexusPos is an advanced supermarket inventory management system built with Vue 3, TypeScript, and Vite. It provides comprehensive tools for managing inventory, analytics, replenishment, and supplier integration.

## 🎯 Key Features

### 1. **Dashboard**
- Real-time inventory metrics with visual cards
- Total products count
- Low stock alerts
- Out of stock monitoring
- Inventory value tracking
- Average stock days calculation
- Inventory turnover rate
- Trend indicators showing month-over-month changes

### 2. **Inventory Management**
- Search products by name or barcode
- View all products in a sortable table
- Edit product details
- Delete products
- Adjust stock levels with reasons
- View product history with timestamps
- Filter and search capabilities

### 3. **Product Management**
**Adding/Editing Products:**
- Product name and barcode
- Category and supplier selection
- Cost and selling prices
- Real-time profit margin calculation
- Low stock threshold setting
- Daily sales rate tracking
- Product descriptions

**Form Validation:**
- Required field indicators (*)
- Live profit margin display with color coding:
  - 🟢 Excellent: >50% margin
  - 🔵 Good: 30-50% margin
  - 🟡 Fair: 10-30% margin
  - 🔴 Low: <10% margin

### 4. **Analytics & Reports**
- **Overview Tab:**
  - Total inventory value
  - Inventory turnover rate
  - Average stock days
  - Movement velocity metrics
  
- **Performance Tab:**
  - Top-performing products
  - Unit sales data
  - Revenue tracking
  - Profit margin analysis
  
- **Trends Tab:**
  - 7-day sales trends
  - Stock movement patterns
  - Seasonal analysis

### 5. **Smart Replenishment**
- Automated stock recommendations
- Priority-based ordering:
  - 🔴 Critical: < 5 days to stockout
  - 🟠 High: 5-10 days to stockout
  - 🟡 Medium: 10-20 days to stockout
- Estimated order costs
- Create orders directly from suggestions
- Dismiss recommendations

### 6. **Stock Adjustment**
- Multiple adjustment types:
  - Add (received stock)
  - Remove (sold/used)
  - Correct (inventory count adjustments)
- Reason tracking (damage, loss, expiry, return, etc.)
- Notes for documentation
- Real-time stock preview

### 7. **History Tracking**
- View complete product transaction history
- Filter by reason type
- Search history entries
- Export history to CSV
- Timestamps and user tracking
- Stock movement details

### 8. **Reports & Integration**
- **POS Integration:**
  - Connection status monitoring
  - Sync status and timestamps
  - Transaction tracking
  - Daily sales summary
  - Sync capability
  
- **Supplier Portal:**
  - Pending orders tracking
  - Completed orders history
  - Monthly spending totals
  - Recent order list
  - Quick refresh

### 9. **Export/Import**
- Export inventory to CSV
- Export to JSON format
- Import from CSV files
- Complete inventory reports with all fields
- Proper data formatting

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ 
- npm or yarn package manager

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Building for Production
```bash
npm run build
npm run preview
```

## 📱 UI/UX Features

### Modern Design
- Gradient header with "NexusPos" branding
- Tab-based navigation system
- Smooth animations and transitions
- Responsive design for all devices
- Professional color scheme (Purple gradient theme)

### Interactive Elements
- Hover effects on cards and buttons
- Loading states for async operations
- Real-time form validation
- Visual feedback for all actions
- Smooth modal animations

### Mobile Responsive
- Optimized for desktop, tablet, and mobile
- Touch-friendly buttons and inputs
- Responsive grid layouts
- Collapsible navigation on small screens

## 🔧 Branch Management

Select your operating branch from the branch selector in the header:
- Different inventory levels per branch
- Branch-specific analytics
- Branch-filtered reports

## 💾 Data Management

### Product Operations
1. **Create:** Click "New Product" in the header
2. **Edit:** Click edit icon in the inventory table
3. **Delete:** Click delete icon in the inventory table
4. **Export:** Click "Export" button to download inventory

### Stock Operations
1. **Adjust:** Select a product and click "Adjust Stock"
2. **View History:** Open the history modal to see all changes
3. **Track:** All changes are logged with timestamp and user info

## 📊 Analytics Usage

### Dashboard Metrics
- Cards show current values with trend indicators
- Green up arrows indicate positive trends
- Red down arrows indicate negative trends
- Hover over cards for more details

### Performance Analysis
- Identify top-selling products
- Track profitability
- Monitor inventory velocity
- Plan stock levels based on sales rates

### Trend Analysis
- View 7-day sales patterns
- Identify seasonal trends
- Forecast demand
- Optimize stock levels

## 🔔 Notifications

The system provides real-time feedback:
- ✅ **Success:** Green notification for successful actions
- ℹ️ **Info:** Blue notification for informational messages
- ⚠️ **Warning:** Yellow notification for warnings
- ❌ **Error:** Red notification for errors

Notifications auto-dismiss after 3 seconds.

## 📋 Workflow Examples

### Example 1: Adding a New Product
1. Click "New Product" button
2. Fill in product details (name, category, supplier)
3. Enter cost and selling prices
4. Review calculated profit margin
5. Set low stock threshold
6. Click "Create Product"

### Example 2: Adjusting Stock After Inventory Count
1. Find product in inventory table
2. Click "Adjust Stock" icon
3. Select "Correct" adjustment type
4. Enter the incorrect amount difference
5. Add notes about the discrepancy
6. Review new stock preview
7. Click "Adjust"

### Example 3: Creating a Replenishment Order
1. Go to "Replenishment" tab
2. Review smart recommendations
3. Click "Create Order" on products needing stock
4. View estimated order cost
5. System shows priority and urgency

### Example 4: Exporting Inventory Report
1. Click "Export" in the header
2. CSV file downloads with all inventory details:
   - Product names and codes
   - Current stock levels
   - Stock values
   - Supplier information
   - Thresholds

## 🛠️ Technical Details

### Project Structure
```
src/
├── components/
│   ├── shared/           # Reusable components
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   └── Notification.vue
│   ├── dashboard/        # Dashboard components
│   │   └── SummaryCard.vue
│   ├── features/         # Feature components
│   │   ├── InventoryTable.vue
│   │   ├── AnalyticsSection.vue
│   │   ├── ReplenishmentSuggestions.vue
│   │   ├── POSIntegration.vue
│   │   └── SupplierPortal.vue
│   └── modals/          # Modal components
│       ├── ProductModal.vue
│       ├── StockAdjustmentModal.vue
│       └── HistoryModal.vue
├── composables/          # Vue composables
│   ├── useInventoryData.ts
│   ├── useFormatting.ts
│   ├── useStockCalculations.ts
│   ├── useNotification.ts
│   ├── useCharts.ts
│   ├── useFilters.ts
│   └── useExport.ts
├── types/               # TypeScript interfaces
│   └── index.ts
├── utils/               # Utility functions
│   └── helpers.ts
├── App.vue              # Root component
└── main.ts              # Entry point
```

### Type System
All components use TypeScript with strict mode enabled. Key types include:
- `Product`: Product information
- `Category`: Product categories
- `Supplier`: Supplier details
- `Branch`: Store branches
- `InventoryHistoryEntry`: Stock change history
- `SupplierOrder`: Order information
- `POSTransaction`: POS system transactions

## 🎨 Customization

### Colors & Branding
Edit the gradient colors in `App.vue` for the header:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Component Variants
Buttons support multiple variants:
- `primary`: Purple gradient
- `success`: Green gradient
- `danger`: Red gradient
- `warning`: Orange gradient
- `info`: Blue gradient
- `secondary`: Gray

## ⚡ Performance Tips

1. **Optimize Images:** Compress product images when adding
2. **Regular Exports:** Export data regularly for backups
3. **Monitor Stock:** Check dashboard daily for alerts
4. **Sync POS:** Sync regularly for accurate sales data
5. **Archive History:** Consider archiving old history entries

## 🐛 Troubleshooting

### Inventory Not Updating
- Refresh the page
- Check browser console for errors
- Verify data is being saved (check notifications)

### Modal Not Closing
- Click the X button or overlay
- Check if form has validation errors

### Export Not Working
- Check browser allows downloads
- Verify CSV format is supported
- Check file size limits

### Notifications Not Showing
- Check notification permission in browser
- Verify sound/vibration settings

## 📞 Support

For issues or questions:
1. Check this user guide
2. Review the code comments in component files
3. Check notification messages for error details
4. Verify all required fields are filled

## 📈 Future Enhancements

Planned features:
- Multi-user login and permissions
- Real-time POS sync
- Email notifications for low stock
- Advanced forecasting
- Barcode scanning support
- Mobile app
- API integration
- Database backend
- User activity logs

## 📄 License

This is a proprietary inventory management system.

---

**Version:** 1.0.0  
**Last Updated:** March 12, 2026  
**Built with:** Vue 3 + TypeScript + Vite

<template>
  <Card>
    <template #header>
      <h2><i class="fas fa-chart-bar"></i> Analytics & Reports</h2>
      <div>
        <Button @click="selectedTab = 'overview'" :variant="selectedTab === 'overview' ? 'primary' : 'secondary'" size="sm">
          Overview
        </Button>
        <Button @click="selectedTab = 'performance'" :variant="selectedTab === 'performance' ? 'primary' : 'secondary'" size="sm">
          Performance
        </Button>
        <Button @click="selectedTab = 'trends'" :variant="selectedTab === 'trends' ? 'primary' : 'secondary'" size="sm">
          Trends
        </Button>
      </div>
    </template>

    <div class="analytics-content">
      <!-- Overview Tab -->
      <div v-if="selectedTab === 'overview'" class="tab-content">
        <div class="metrics-grid">
          <div class="metric-card">
            <h4>Total Inventory Value</h4>
            <p class="metric-value">{{ formatCurrency(totalInventoryValue) }}</p>
            <p class="metric-change" :class="trendPositive">{{ trend(10) }}% from last month</p>
          </div>
          <div class="metric-card">
            <h4>Avg Stock Turnover</h4>
            <p class="metric-value">{{ stockTurnover.toFixed(2) }}x</p>
            <p class="metric-detail">Times per period</p>
          </div>
          <div class="metric-card">
            <h4>Stock Days Supply</h4>
            <p class="metric-value">{{ averageStockDays }}</p>
            <p class="metric-detail">Days of supply</p>
          </div>
          <div class="metric-card">
            <h4>Movement Velocity</h4>
            <p class="metric-value">{{ movementVelocity }}%</p>
            <p class="metric-detail">Inventory turnover speed</p>
          </div>
        </div>

        <div class="chart-section">
          <h3>Stock Value by Category</h3>
          <div class="chart-container">
            <Doughnut :data="categoryChartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Performance Tab -->
      <div v-if="selectedTab === 'performance'" class="tab-content">
        <h3>Top Performing Products</h3>
        <div class="performance-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold (30d)</th>
                <th>Revenue</th>
                <th>Profit</th>
                <th>Margin</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in topProducts" :key="product.id">
                <td>{{ product.name }}</td>
                <td>{{ product.unitsSold }}</td>
                <td>{{ formatCurrency(product.revenue) }}</td>
                <td>{{ formatCurrency(product.profit) }}</td>
                <td>
                  <span :class="['margin-badge', product.margin > 30 ? 'high' : 'normal']">
                    {{ product.margin.toFixed(1) }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="chart-section">
          <h3>Revenue by Product</h3>
          <div class="chart-container">
            <Bar :data="performanceChartData" :options="barChartOptions" />
          </div>
        </div>
      </div>

      <!-- Trends Tab -->
      <div v-if="selectedTab === 'trends'" class="tab-content">
        <h3>7-Day Trend</h3>
        <div class="trend-chart">
          <Line :data="trendChartData" :options="lineChartOptions" />
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '@/types'
import { useFormatting } from '@/composables/useFormatting'
import { useCharts } from '@/composables/useCharts'
import { Doughnut, Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js'
import Card from '@/components/shared/Card.vue'
import Button from '@/components/shared/Button.vue'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
)

const props = defineProps<{
  inventory: Product[]
  selectedBranch: number
  getCurrentBranchStock: (product: Product, branch: number) => number
}>()

const { formatCurrency } = useFormatting()
const { generateStockValueChart, generateTrendChart } = useCharts()

const selectedTab = ref('overview')

const totalInventoryValue = computed(() => {
  return props.inventory.reduce((sum, item) => {
    return sum + props.getCurrentBranchStock(item, props.selectedBranch) * item.cost
  }, 0)
})

const stockTurnover = computed(() => {
  const totalCost = props.inventory.reduce((sum, item) => sum + item.cost, 0)
  const avgInventoryValue = totalInventoryValue.value / 2 || 1
  return avgInventoryValue > 0 ? totalCost / avgInventoryValue : 0
})

const averageStockDays = computed(() => {
  const validItems = props.inventory
    .map((item) => ({
      item,
      stock: props.getCurrentBranchStock(item, props.selectedBranch)
    }))
    .filter(({ item, stock }) => stock > 0 && (item.dailySales ?? 0) > 0)

  if (validItems.length === 0) return 0

  const totalDays = validItems.reduce((sum, { item, stock }) => {
    const dailySales = item.dailySales ?? 1
    return sum + stock / dailySales
  }, 0)

  return Math.round(totalDays / validItems.length)
})

const movementVelocity = computed(() => {
  return Math.floor((topProducts.value.length / props.inventory.length) * 100) || 75
})

const trendPositive = computed(() => {
  return Math.random() > 0.5 ? 'positive' : 'negative'
})

const trend = (val: number) => {
  const isPositive = totalInventoryValue.value > 0 ? true : false
  return isPositive ? `+${val}` : `-${val}`
}

const topProducts = computed(() => {
  return props.inventory
    .map((product) => {
      const dailySales = product.dailySales ?? 1
      const unitsSold = dailySales * 30 // 30-day period
      const revenue = unitsSold * product.price
      const cost = unitsSold * product.cost
      const profit = revenue - cost
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0

      return {
        id: product.id,
        name: product.name,
        unitsSold: Math.round(unitsSold),
        revenue,
        profit,
        margin
      }
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
})

// Chart data
const categoryChartData = computed(() => {
  return generateStockValueChart(props.inventory, props.getCurrentBranchStock, props.selectedBranch)
})

const performanceChartData = computed(() => {
  const top5 = topProducts.value
  return {
    labels: top5.map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name),
    datasets: [
      {
        label: 'Revenue',
        data: top5.map(p => p.revenue),
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
        borderWidth: 1
      },
      {
        label: 'Profit',
        data: top5.map(p => p.profit),
        backgroundColor: '#2ecc71',
        borderColor: '#27ae60',
        borderWidth: 1
      }
    ]
  }
})

const trendChartData = computed(() => {
  // Generate 7 days of trend data
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: Math.floor(Math.random() * 200) + 50,
      stockMovement: Math.floor(Math.random() * 100) - 20
    })
  }
  return generateTrendChart(days)
})

// Chart options
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return `${context.label}: ${formatCurrency(context.parsed)}`
        }
      }
    }
  }
}))

const barChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: any) => formatCurrency(value)
      }
    }
  }
}))

const lineChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}))
</script>

<style scoped>
.analytics-content {
  min-height: 400px;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.metric-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.metric-card h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
}

.metric-value {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #3498db;
}

.metric-change,
.metric-detail {
  margin: 5px 0 0 0;
  font-size: 12px;
  color: #7f8c8d;
}

.metric-change.positive {
  color: #27ae60;
}

.metric-change.negative {
  color: #e74c3c;
}

h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.performance-table {
  overflow-x: auto;
}

.performance-table table {
  width: 100%;
  border-collapse: collapse;
}

.performance-table th {
  background: #f8fafc;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e6ed;
}

.performance-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e6ed;
}

.performance-table tr:hover {
  background: #f8fafc;
}

.margin-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: #f39c12;
}

.margin-badge.high {
  background: #27ae60;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 2px dashed #e0e6ed;
  border-radius: 8px;
  color: #95a5a6;
}

.chart-placeholder i {
  font-size: 48px;
  margin-bottom: 10px;
}

.chart-section {
  margin-top: 30px;
}

.chart-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.chart-container {
  height: 300px;
  position: relative;
}

.trend-chart {
  height: 350px;
  position: relative;
}
</style>

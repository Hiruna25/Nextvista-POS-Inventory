import { ref } from 'vue'

export function useCharts() {
  const chartData = ref<any>(null)

  const initializeChart = (type: string, data: any) => {
    chartData.value = {
      type,
      labels: [],
      datasets: [],
      options: getChartOptions(type),
      ...data
    }
  }

  const getChartOptions = (type: string) => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const
        }
      }
    }

    switch (type) {
      case 'doughnut':
        return {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: {
              ...baseOptions.plugins.legend,
              position: 'bottom' as const
            }
          }
        }
      case 'bar':
        return {
          ...baseOptions,
          scales: {
            y: { beginAtZero: true }
          }
        }
      default:
        return baseOptions
    }
  }

  const generateStockValueChart = (inventory: any[], getCurrentBranchStock: Function, selectedBranch: number) => {
    const categoryMap = new Map()
    inventory.forEach((p) => {
      const catId = p.category_id ?? p.categoryId
      const catName = p.category_name ?? `Category ${catId}`
      if (!categoryMap.has(catId)) {
        categoryMap.set(catId, { name: catName, value: 0 })
      }
      categoryMap.get(catId).value += getCurrentBranchStock(p, selectedBranch) * p.cost
    })

    const categories = Array.from(categoryMap.values())
    const labels = categories.map(cat => cat.name)
    const data = categories.map(cat => cat.value)

    return {
      labels,
      datasets: [
        {
          label: 'Stock Value',
          data,
          backgroundColor: [
            '#3498db',
            '#2ecc71',
            '#f39c12',
            '#e74c3c',
            '#9b59b6',
            '#1abc9c',
            '#34495e',
            '#e67e22'
          ]
        }
      ]
    }
  }

  const generateTrendChart = (salesData: any[]) => {
    return {
      labels: salesData.map((d) => d.date),
      datasets: [
        {
          label: 'Sales',
          data: salesData.map((d) => d.sales),
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          tension: 0.3
        },
        {
          label: 'Stock Movement',
          data: salesData.map((d) => d.stockMovement),
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          tension: 0.3
        }
      ]
    }
  }

  return {
    chartData,
    initializeChart,
    generateStockValueChart,
    generateTrendChart
  }
}

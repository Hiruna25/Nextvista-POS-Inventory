import type { Product } from '@/types'

interface ExportOptions {
  includeHeaders?: boolean
  dateFormat?: 'iso' | 'locale'
  delimiter?: string
}

export function useExport() {
  
  const exportToCSV = (data: any[], filename: string, options: ExportOptions = {}) => {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export')
      }

      const { includeHeaders = true, delimiter = ',' } = options
      const headers = Object.keys(data[0])

     
      let csv = ''
      if (includeHeaders) {
        csv += headers.map((h) => escapeCSVValue(h)).join(delimiter) + '\n'
      }

      csv += data
        .map((row) =>
          headers
            .map((header) => {
              const value = row[header]
              return escapeCSVValue(value)
            })
            .join(delimiter)
        )
        .join('\n')

      downloadFile(csv, filename, 'text/csv;charset=utf-8')
      return true
    } catch (error) {
      console.error('CSV export error:', error)
      throw error
    }
  }

  
  const exportToJSON = (data: any[], filename: string) => {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export')
      }

      const json = JSON.stringify(data, null, 2)
      downloadFile(json, filename, 'application/json;charset=utf-8')
      return true
    } catch (error) {
      console.error('JSON export error:', error)
      throw error
    }
  }

  
  const exportInventoryReport = (
    inventory: Product[],
    selectedBranch: number,
    getCurrentBranchStock: (product: Product, branch: number) => number,
    format: 'csv' | 'json' = 'csv'
  ) => {
    try {
      if (!inventory || inventory.length === 0) {
        throw new Error('No inventory data to export')
      }

      const data = inventory.map((product) => {
        const branchStock = getCurrentBranchStock(product, selectedBranch)
        const stockValue = branchStock * product.cost
        const isLowStock = branchStock <= (product.min_stock_level || 10)

        return {
          'Product ID': product.id,
          'Product Name': product.name,
          'Category': product.category_name || 'N/A',
          'Supplier': product.supplier_name || 'N/A',
          'Barcode': product.barcode || 'N/A',
          'Cost': formatCurrency(product.cost),
          'Price': formatCurrency(product.price),
          'Stock': branchStock,
          'Stock Value': formatCurrency(stockValue),
          'Min Stock Level': product.min_stock_level || 10,
          'Status': isLowStock ? 'LOW STOCK' : 'OK',
          'Last Updated': new Date().toLocaleString()
        }
      })

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `inventory-report-${timestamp}.${format === 'json' ? 'json' : 'csv'}`

      if (format === 'json') {
        exportToJSON(data, filename)
      } else {
        exportToCSV(data, filename)
      }

      return true
    } catch (error) {
      console.error('Inventory report export error:', error)
      throw error
    }
  }

  /**
   * Export inventory summary statistics
   */
  const exportInventorySummary = (
    inventory: Product[],
    selectedBranch: number,
    getCurrentBranchStock: (product: Product, branch: number) => number
  ) => {
    try {
      const totalProducts = inventory.length
      const totalValue = inventory.reduce(
        (sum, p) => sum + getCurrentBranchStock(p, selectedBranch) * p.cost,
        0
      )
      const lowStockCount = inventory.filter(
        (p) => getCurrentBranchStock(p, selectedBranch) > 0 && 
                getCurrentBranchStock(p, selectedBranch) <= (p.min_stock_level || 10)
      ).length
      const outOfStockCount = inventory.filter(
        (p) => getCurrentBranchStock(p, selectedBranch) === 0
      ).length

      const summary = [
        {
          'Metric': 'Total Products',
          'Value': totalProducts
        },
        {
          'Metric': 'Total Inventory Value',
          'Value': formatCurrency(totalValue)
        },
        {
          'Metric': 'Low Stock Items',
          'Value': lowStockCount
        },
        {
          'Metric': 'Out of Stock Items',
          'Value': outOfStockCount
        },
        {
          'Metric': 'Report Generated',
          'Value': new Date().toLocaleString()
        }
      ]

      const timestamp = new Date().toISOString().split('T')[0]
      exportToCSV(summary, `inventory-summary-${timestamp}.csv`)
      return true
    } catch (error) {
      console.error('Summary export error:', error)
      throw error
    }
  }

  /**
   * Import data from CSV file
   */
  const importFromCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      try {
        if (!file) {
          throw new Error('No file provided')
        }

        if (!file.name.endsWith('.csv')) {
          throw new Error('Invalid file format. Please provide a CSV file.')
        }

        const reader = new FileReader()

        reader.onload = (event) => {
          try {
            const csv = event.target?.result as string
            const lines = csv.trim().split('\n')

            if (lines.length < 2) {
              throw new Error('CSV file must contain headers and at least one data row')
            }

            const headers = lines[0].split(',').map((h) => h.trim())
            const data = lines.slice(1)
              .map((line) => {
                const values = parseCSVLine(line)
                const obj: any = {}
                headers.forEach((header, index) => {
                  obj[header] = values[index] || ''
                })
                return obj
              })
              .filter((row) => Object.values(row).some((v) => v !== ''))

            resolve(data)
          } catch (error) {
            reject(new Error(`Error parsing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`))
          }
        }

        reader.onerror = () => {
          reject(new Error('Error reading file'))
        }

        reader.readAsText(file)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Parse CSV line considering quoted values
   */
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  /**
   * Escape CSV values to handle special characters
   */
  const escapeCSVValue = (value: any): string => {
    if (value === null || value === undefined) {
      return ''
    }

    const stringValue = String(value)
    const needsQuotes = stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')

    if (needsQuotes) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }

    return stringValue
  }

  /**
   * Download file to client
   */
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    try {
      const blob = new Blob([content], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      throw error
    }
  }

  /**
   * Format currency values
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return {
    exportToCSV,
    exportToJSON,
    exportInventoryReport,
    exportInventorySummary,
    importFromCSV
  }
}

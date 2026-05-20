export function useFormatting() {
  const formatCurrency = (value: number): string => {
    return '$' + parseFloat(String(value)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const formatShortDate = (dateString: string): string => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateForInput = (date?: Date | string): string => {
    if (!date) return ''
    if (typeof date === 'string') {
      return date.split('T')[0]
    }
    return date.toISOString().split('T')[0]
  }

  return {
    formatCurrency,
    formatDate,
    formatShortDate,
    formatDateForInput
  }
}

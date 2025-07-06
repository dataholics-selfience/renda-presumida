// Currency formatting utilities for Brazilian Real (R$)

export const formatCurrency = (value: string): string => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  if (!numericValue) return '';
  
  // Convert to number and format
  const number = parseInt(numericValue, 10) / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

export const applyCurrencyMask = (value: string): string => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  if (!numericValue) return '';
  
  // Convert to number and format
  const number = parseInt(numericValue, 10) / 100;
  
  // Format with thousands separator and decimal places
  const formatted = number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `R$ ${formatted}`;
};

export const removeCurrencyMask = (value: string): string => {
  // Remove currency symbol and formatting, keep only numbers and decimal
  return value.replace(/[^\d,]/g, '').replace(',', '.');
};

export const formatCurrencyDisplay = (value: string): string => {
  // If value is already formatted or empty, return as is
  if (!value || value === 'Não informado' || value.includes('R$')) {
    return value;
  }
  
  // Try to parse and format the value
  const numericValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
  
  if (isNaN(numericValue)) {
    return value; // Return original if can't parse
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue);
};
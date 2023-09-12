import type { Dinero } from 'dinero.js';
import { toDecimal } from 'dinero.js';

export function currencyCodeToSymbol(currencyCode: string) {
    try {
      const formatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode, currencyDisplay: 'narrowSymbol' });
      const parts = formatter.formatToParts(0); // Format zero to get currency symbol
      let symbol = '';
  
      for (const part of parts) {
        if (part.type === 'currency') {
          symbol = part.value;
          break;
        }
      }
  
      return symbol;
    } catch (error) {
      console.error('Error converting currency code to symbol:', error);
      return null;
    }
}

export function formatDinero (amount: Dinero<number>) {
    return toDecimal(amount, ({ value, currency }) => `${new Intl.NumberFormat(undefined, { style: 'currency', currencyDisplay: 'narrowSymbol', currency: currency.code, }).format(parseInt(value))}`);
}
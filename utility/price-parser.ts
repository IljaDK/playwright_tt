export const parsePrice = (price: string) => parseFloat(price.replace(',', '.').replace(/[^\d\.]/g, ''));

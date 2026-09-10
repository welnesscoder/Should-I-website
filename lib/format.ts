export function formatCurrency(value: number): string {
  const rounded = Math.round(value);
  return rounded.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function formatCurrencyPrecise(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function formatHours(hours: number): string {
  return `${hours.toFixed(hours < 10 ? 1 : 0)} hour${hours === 1 ? "" : "s"}`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count.toLocaleString()} ${count === 1 ? singular : plural}`;
}

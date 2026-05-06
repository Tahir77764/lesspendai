/**
 * Pricing utilities to calculate potential savings
 */

export function calculateSavings(currentSpend: number, optimizedSpend: number): number {
  return currentSpend - optimizedSpend;
}

export function getPricingTier(spendAmount: number): string {
  if (spendAmount > 10000) return 'enterprise';
  if (spendAmount > 1000) return 'pro';
  return 'starter';
}

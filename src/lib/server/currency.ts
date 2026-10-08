import type { CurrencyBreakdownItem } from '#lib/index.js';

export type { CurrencyBreakdownItem };

const FALLBACK_RATES: Record<string, number> = {
	CAD: 1.0,
	USD: 0.7,
	EUR: 0.63,
	GBP: 0.53,
	JPY: 111.0,
	CNY: 4.7,
	AUD: 1.01,
	CHF: 0.58,
	HKD: 5.51,
	NZD: 1.25,
	SGD: 0.9
};

let cachedRates: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Fetch exchange rates with CAD as the base currency.
 * 1 CAD = rates[CURRENCY] CURRENCY
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
	const now = Date.now();
	if (cachedRates && now - cachedRates.timestamp < CACHE_TTL_MS) {
		return cachedRates.rates;
	}

	// Try primary API (open.er-api.com - free, no API key required)
	try {
		const res = await fetch('https://open.er-api.com/v6/latest/CAD', {
			signal: AbortSignal.timeout(4000)
		});
		if (res.ok) {
			const data = (await res.json()) as { result?: string; rates?: Record<string, number> };
			if (data.rates && typeof data.rates === 'object') {
				const rates: Record<string, number> = {
					...FALLBACK_RATES,
					...data.rates,
					CAD: 1.0
				};
				cachedRates = { rates, timestamp: now };
				return rates;
			}
		}
	} catch (err) {
		console.warn('Failed to fetch rates from open.er-api.com, trying fallback API:', err);
	}

	// Try secondary API (api.frankfurter.dev - free, open source ECB data)
	try {
		const res = await fetch('https://api.frankfurter.dev/v1/latest?base=CAD', {
			signal: AbortSignal.timeout(4000)
		});
		if (res.ok) {
			const data = (await res.json()) as { rates?: Record<string, number> };
			if (data.rates && typeof data.rates === 'object') {
				const rates: Record<string, number> = {
					...FALLBACK_RATES,
					...data.rates,
					CAD: 1.0
				};
				cachedRates = { rates, timestamp: now };
				return rates;
			}
		}
	} catch (err) {
		console.warn('Failed to fetch rates from api.frankfurter.dev:', err);
	}

	// If cached rates exist even if expired, use them rather than purely static fallbacks
	if (cachedRates) {
		return cachedRates.rates;
	}

	return { ...FALLBACK_RATES };
}

/**
 * Convert an amount from a specified currency to CAD using base-CAD exchange rates.
 * Because rates are formatted as: 1 CAD = rate * CURRENCY,
 * amountInCAD = amount / rate.
 */
export function convertCurrencyToCad(
	amount: number,
	fromCurrency: string,
	rates: Record<string, number>
): number {
	const code = (fromCurrency || 'CAD').toUpperCase().trim();
	if (code === 'CAD') {
		return amount;
	}

	const rate = rates[code];
	if (rate && rate > 0) {
		return amount / rate;
	}

	return amount;
}

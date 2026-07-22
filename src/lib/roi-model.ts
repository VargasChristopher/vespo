/* Shared back-of-napkin ROI model for the audit funnel, the ROI calculator,
   and the pricing profit simulator. Deliberately conservative industry
   street-food averages; every page that renders these numbers surfaces the
   assumptions verbatim in a footnote. */

export const AVG_TICKET = 16; // $, national street-food average
export const APP_ORDER_SHARE = 0.2; // 1 in 5 orders through delivery apps
export const APP_FEE = 0.2; // default third-party commission rate
export const PEAK_ORDER_SHARE = 0.5; // half of daily volume moves in rush windows
export const LINE_BUSTING_LIFT = 0.25; // QR order-ahead lift on peak-window volume

/** $ lost per year to third-party commissions (rounded to $1,000).
    Commissions only apply to the app-order share — window orders paid at
    the truck never carried a fee, so charging the full day would overstate. */
export function annualCommissionLeak(
  dailyOrders: number,
  ticket = AVG_TICKET,
  rate = APP_FEE
) {
  const raw = dailyOrders * APP_ORDER_SHARE * ticket * rate * 365;
  return Math.round(raw / 1000) * 1000;
}

/** Extra orders per day once the window stops being the bottleneck —
    the 25% lift applies to the peak share of volume. */
export function extraOrdersPerDay(dailyOrders: number) {
  return Math.round(dailyOrders * PEAK_ORDER_SHARE * LINE_BUSTING_LIFT);
}

/** $ per year from those extra line-busting orders. */
export function annualLineBustingRevenue(dailyOrders: number, ticket: number) {
  return extraOrdersPerDay(dailyOrders) * ticket * 365;
}

/** Combined first-year revenue impact: kept commissions + extra orders
    (rounded to $100). */
export function netAnnualLift(dailyOrders: number, ticket: number) {
  const raw =
    annualCommissionLeak(dailyOrders, ticket) +
    annualLineBustingRevenue(dailyOrders, ticket);
  return Math.round(raw / 100) * 100;
}

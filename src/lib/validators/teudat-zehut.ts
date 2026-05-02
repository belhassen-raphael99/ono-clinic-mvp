/**
 * Validates an Israeli Teudat Zehut (national ID number).
 *
 * The ID is up to 9 digits; shorter IDs are left-padded with zeros.
 * The 9th digit is a Luhn-style checksum:
 *   1. For each digit, multiply by 1 (odd position) or 2 (even position).
 *   2. If the doubled result is > 9, take its digit-sum (== subtract 9).
 *   3. The total of all 9 results must be divisible by 10.
 */
export function isValidTeudatZehut(id: string): boolean {
  if (typeof id !== "string") return false;
  if (!/^\d{1,9}$/.test(id)) return false;

  const padded = id.padStart(9, "0");

  // All-zeros passes the checksum trivially but is never a real ID.
  if (padded === "000000000") return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = Number(padded[i]);
    digit *= (i % 2) + 1;
    if (digit > 9) digit -= 9;
    sum += digit;
  }

  return sum % 10 === 0;
}

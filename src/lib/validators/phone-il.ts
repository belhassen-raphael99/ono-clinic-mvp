/**
 * Validates an Israeli phone number.
 *
 * Accepts:
 *   - Mobile: 05X-XXXXXXX or 05XXXXXXXX (10 digits)
 *   - Landline: 0X-XXXXXXX or 0XXXXXXXX (9 digits, area codes 2/3/4/8/9)
 *   - VoIP: 07X-XXXXXXX (10 digits)
 *   - International prefix +972 substituted for the leading 0
 *   - Optional dashes or spaces between groups
 */
export function isValidIsraeliPhone(phone: string): boolean {
  if (typeof phone !== "string") return false;

  // Strip whitespace and dashes; convert +972 to leading 0
  const normalized = phone.replace(/[-\s]/g, "").replace(/^\+972/, "0");

  // Must start with 0 and be exactly 9 (landline) or 10 (mobile/VoIP) digits
  return /^0\d{8,9}$/.test(normalized);
}

/**
 * Validates an Israeli medical license number.
 * Format: exactly 5 digits, no other characters.
 */
export function isValidMedicalLicense(license: string): boolean {
  if (typeof license !== "string") return false;
  return /^\d{5}$/.test(license);
}

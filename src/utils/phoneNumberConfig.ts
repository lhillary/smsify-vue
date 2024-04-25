import parsePhoneNumberFromString from 'libphonenumber-js';

/**
 * Formats a phone number for human-readable display using international format.
 * @param phoneNumber The phone number to format.
 * @param countryCode Default country code if the phone number does not include one.
 * @returns The formatted phone number.
 */
export function formatPhoneNumberForDisplay(phoneNumber: string, countryCode: 'US'): string | undefined {
	const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode);
	if (parsedNumber && parsedNumber.isValid()) {
		// Use the formatInternational method available on PhoneNumber object
		return parsedNumber.formatInternational();
	}
	return undefined;
}

/**
 * Normalizes a phone number to E.164 format for consistent storage and use with APIs.
 * @param phoneNumber The phone number to normalize.
 * @param countryCode Default country code if the phone number does not include one.
 * @returns The normalized phone number in E.164 format, or undefined if invalid.
 */
export function normalizePhoneNumber(phoneNumber: string, countryCode: 'US'): string | undefined {
	const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode);
	if (parsedNumber && parsedNumber.isValid()) {
		return parsedNumber.number; // E.164 format
	}
	return undefined;
}

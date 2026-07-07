import { defineStore } from 'pinia';
import { getPhoneNumbersApi } from '../utils/httpConfig';
import { type PhoneNumber, ApiV1PhoneNumberAvailableNumbersGet200ResponseInner, ApiV1PhoneNumberPurchaseNumberPostRequest } from '@/api-client';

const phoneNumbersApi = getPhoneNumbersApi();

export const usePhoneNumberStore = defineStore('phoneNumber', {
	state: () => ({
		availablePhoneNumbers: null as null | ApiV1PhoneNumberAvailableNumbersGet200ResponseInner[],
		userPhoneNumbers: null as null | PhoneNumber[],
	}),
	actions: {
		listAvailableNumbers(searchTerm = ''): Promise<ApiV1PhoneNumberAvailableNumbersGet200ResponseInner[]> {
			return new Promise((resolve, reject) => {
				phoneNumbersApi.apiV1PhoneNumberAvailableNumbersGet(searchTerm)
					.then((response) => {
						this.availablePhoneNumbers = response.data;
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed fetching available numbers:', error);
						reject(error);
					});
			});
		},
		purchasePhoneNumber(params: ApiV1PhoneNumberPurchaseNumberPostRequest): Promise<PhoneNumber> {
			return new Promise((resolve, reject) => {
				phoneNumbersApi.apiV1PhoneNumberPurchaseNumberPost(params)
					.then((response) => {
						this.fetchAllPhoneNumbers();
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed to purchase number:', error);
						reject(error);
					});
			});
		},
		/**
		 * `sync: true` asks the backend to reconcile with the connected Twilio
		 * account: import pre-existing numbers, revive soft-deleted rows, and
		 * repair webhooks. Used when landing on the numbers page; plain fetches
		 * elsewhere skip it since it's a heavier call.
		 */
		fetchAllPhoneNumbers(sync = false): Promise<PhoneNumber[]> {
			return new Promise((resolve, reject) => {
				phoneNumbersApi.apiV1PhoneNumberUserNumbersGet(sync ? { params: { sync: true } } : undefined)
					.then((response) => {
						// The API soft-deletes and still returns deleted rows.
						const phoneNumbers = response.data.filter((phoneNumber) => !phoneNumber.deletedAt);
						this.userPhoneNumbers = phoneNumbers;
						resolve(phoneNumbers);
					})
					.catch((error) => {
						console.error('Failed fetching phone numbers:', error);
						reject(error);
					});
			});
		},
		deletePhoneNumber(phoneNumberId: number): Promise<void> {
			return new Promise((resolve, reject) => {
				phoneNumbersApi.apiV1PhoneNumberDeletePhoneNumberIdPut(phoneNumberId)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed deleting phone number:', error);
						reject(error);
					});
			});
		},
	},
});
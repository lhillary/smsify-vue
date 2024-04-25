import { defineStore } from 'pinia';
import { getContactsApi } from '../utils/httpConfig';
import { Contact, ApiV1ContactPostRequest, ApiV1ContactUpdateContactIdPutRequest } from '@/api-client';

const contactsApi = getContactsApi();

export const useContactsStore = defineStore('contact', {
	state: () => ({
		campaignContacts: null as null | Contact[],
		allContacts: null as null | Contact[],
	}),
	actions: {
		createContact(params: ApiV1ContactPostRequest): Promise<Contact> {
			return new Promise((resolve, reject) => {
				contactsApi.apiV1ContactPost(params)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed creating contact:', error);
						reject(error);
					});
			});
		},
		fetchAllContacts(): Promise<Contact[]> {
			return new Promise((resolve, reject) => {
				contactsApi.apiV1ContactGet()
					.then((response) => {
						this.allContacts = response.data;
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed getting contacts:', error);
						reject(error);
					});
			});
		},
		fetchCampaignContacts(campaignId: number): Promise<Contact[]> {
			return new Promise((resolve, reject) => {
				contactsApi.apiV1ContactByCampaignCampaignIdGet(campaignId)
					.then((response) => {
						this.campaignContacts = response.data;
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed getting contacts:', error);
						reject(error);
					});
			});
		},
		updateContact(contactId: number, params: ApiV1ContactUpdateContactIdPutRequest) {
			return new Promise((resolve, reject) => {
				contactsApi.apiV1ContactUpdateContactIdPut(contactId, params)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed updating contact:', error);
						reject(error);
					});
			});
		},
		deleteContact(contactId: number) {
			return new Promise((resolve, reject) => {
				contactsApi.apiV1ContactDeleteContactIdPut(contactId)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed deleting contact:', error);
						reject(error);
					});
			});
		},
	},
});

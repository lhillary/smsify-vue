import { defineStore } from 'pinia';
import { getSMSApi } from '../utils/httpConfig';
import { ApiV1SmsSendBulkPostRequest, Response, Message } from '@/api-client';

const smsApi = getSMSApi();

export const useSmsStore = defineStore('sms', {
	state: () => ({
		campaignResponses: null as null | Response[],
		campaignMessages: null as null | Message[],
	}),
	actions: {
		sendBulkSMS(params: ApiV1SmsSendBulkPostRequest): Promise<void> {
			return new Promise((resolve, reject) => {
				smsApi.apiV1SmsSendBulkPost(params)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed sending bulk SMS:', error);
						reject(error);
					});
			});
		},
		getResponsesByCampaign(campaignId: number): Promise<Response[]> {
			return new Promise((resolve, reject) => {
				smsApi.apiV1SmsResponsesCampaignIdGet(campaignId)
					.then((response) => {
						this.campaignResponses = response.data;
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed fetching campaign responses:', error);
						reject(error);
					});
			});
		},
		getMessagesByCampaign(campaignId: number): Promise<Message[]> {
			return new Promise((resolve, reject) => {
				smsApi.apiV1SmsMessagesCampaignIdGet(campaignId)
					.then((response) => {
						this.campaignMessages = response.data;
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed fetching campaign messages:', error);
						reject(error);
					});
			});
		},
	},
});

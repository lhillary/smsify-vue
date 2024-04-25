import { defineStore } from 'pinia';
import { getCampaignsApi } from '../utils/httpConfig';
import { type Campaign, type ApiV1CampaignPostRequest, type ApiV1CampaignUpdateCampaignIdPutRequest } from '@/api-client';

const campaignsApi = getCampaignsApi();

export const useCampaignsStore = defineStore('campaign', {
	state: () => ({
		userCampaigns: null as null | Campaign[],
		currentCampaign: null as null | Campaign,
	}),
	actions: {
		createCampaign(params: ApiV1CampaignPostRequest): Promise<Campaign> {
			return new Promise((resolve, reject) => {
				campaignsApi.apiV1CampaignPost(params)
					.then((response) => {
						this.currentCampaign = response.data;
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed creating campaign:', error);
						reject(error);
					});
			});
		},
		fetchAllCampaigns(): Promise<Campaign[]> {
			return new Promise((resolve, reject) => {
				campaignsApi.apiV1CampaignGet()
					.then((response) => {
						this.userCampaigns = response.data;
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed fetching campaigns:', error);
						reject(error);
					});
			});
		},
		fetchCampaignById(campaignId: number): Promise<Campaign> {
			return new Promise((resolve, reject) => {
				campaignsApi.apiV1CampaignCampaignIdGet(campaignId)
					.then((response) => {
						this.currentCampaign = response.data;
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed fetching campaign:', error);
						reject(error);
					});
			});
		},
		updateCampaign(campaignId: number, params: ApiV1CampaignUpdateCampaignIdPutRequest): Promise<Campaign> {
			return new Promise((resolve, reject) => {
				campaignsApi.apiV1CampaignUpdateCampaignIdPut(campaignId, params)
					.then((response) => {
						this.currentCampaign = response.data;
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed to update campaign:', error);
						reject(error);
					});
			});
		},
		deleteCampaign(campaignId: number): Promise<void> {
			return new Promise((resolve, reject) => {
				campaignsApi.apiV1CampaignDeleteCampaignIdPut(campaignId)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed to delete campaign:', error);
						reject(error);
					});
			});
		},
	},
});
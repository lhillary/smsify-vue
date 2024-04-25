import { defineStore } from 'pinia';
import { getCategoriesApi } from '../utils/httpConfig';
import { CampaignCategory, ApiV1CategoryPostRequest, ApiV1CategoryUpdateCategoryIdPutRequest } from '@/api-client';

const categoryApi = getCategoriesApi();

export const useCategoryStore = defineStore('category', {
	state: () => ({
		currentCampaignCategories: null as null | CampaignCategory[],
	}),
	actions: {
		createCategory(params: ApiV1CategoryPostRequest): Promise<CampaignCategory> {
			return new Promise((resolve, reject) => {
				categoryApi.apiV1CategoryPost(params)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed creating campaign category:', error);
						reject(error);
					});
			});
		},
		getCategoriesByCampaign(campaignId: number): Promise<CampaignCategory[]> {
			return new Promise((resolve, reject) => {
				categoryApi.apiV1CategoryByCampaignCampaignIdGet(campaignId)
					.then((response) => {
						this.currentCampaignCategories = response.data;
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed fetching campaign categories:', error);
						reject(error);
					});
			});
		},
		updateCategory(categoryId: number, params: ApiV1CategoryUpdateCategoryIdPutRequest) {
			return new Promise((resolve, reject) => {
				categoryApi.apiV1CategoryUpdateCategoryIdPut(categoryId, params)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed updating campaign category:', error);
						reject(error);
					});
			});
		},
		deleteCategory(categoryId: number) {
			return new Promise((resolve, reject) => {
				categoryApi.apiV1CategoryDeleteCategoryIdPut(categoryId)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Failed deleting campaign category:', error);
						reject(error);
					});
			});
		},
	},
});

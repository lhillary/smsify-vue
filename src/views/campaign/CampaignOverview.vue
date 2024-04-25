<template>
	<div class="surface-ground">
		<spinner v-if="loading"></spinner>
		<div class="grid">
			<div
				v-for="(campaign, index) in campaigns"
				:key="index"
				class="col-12 md:col-6 xl:col-4 p-3"
			>
				<div class="surface-card shadow-2 border-round p-4">
					<div class="flex border-bottom-1 surface-border pb-4">
						<div class="mr-3" style="width: 70px; height: 70px">
							<Button icon="pi pi-megaphone" rounded></Button>
						</div>
						<div class="flex flex-column align-items-start">
							<span class="text-xl text-900 font-medium mb-1">{{ campaign.name }}</span>
							<span class="text-600 font-medium mb-2">{{ campaign.description }}</span>
							<span class="bg-blue-50 text-blue-400 border-round inline-flex py-1 px-2 text-sm">{{ campaign.status }}</span>
						</div>
					</div>
					<div class="flex justify-content-between pt-4">
						<Button @click="confirmDeleteCampaign(campaign.campaignId)" label="Delete" icon="pi pi-trash" class="p-button-outlined p-button-secondary w-6 mr-2"></Button>
						<Button @click="goToCampaign(campaign.campaignId)" label="View" icon="pi pi-search" class="p-button-outlined p-button-secondary w-6 ml-2"></Button>
					</div>
				</div>
			</div>
			<div class="p-5 flex flex-column flex-auto justify-content-center align-items-start">
				<Button @click="goToCreateCampaign" icon="pi pi-plus" rounded></Button>
			</div>
			<div 
				v-if="!campaigns || campaigns.length < 1"
				class="p-5 flex flex-column flex-auto justify-content-center align-items-start"
			>
				<span class="text-xl text-900 font-medium mb-1 p-2">
					You have no campaigns. Create one now!
				</span>
				<Button @click="goToCreateCampaign" icon="pi pi-plus" rounded></Button>
			</div>
		</div>
	</div>
	<ConfirmDialog></ConfirmDialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { routeNames } from '@/router/route-names';
import { useCampaignsStore } from '@/stores/campaign';
import { useConfirm } from 'primevue/useconfirm';
import Spinner from '../../components/general/Loader.vue';

export default defineComponent({
	name: 'CampaignOverview',
	components: { Spinner },
	setup() {
		const router = useRouter();
		const campaignStore = useCampaignsStore();
		const loading = ref(false);
		const campaigns = computed(() => useCampaignsStore().$state.userCampaigns);
		const confirm = useConfirm();

		const getCampaigns = async () => {
			loading.value = true;
			try {
				await campaignStore.fetchAllCampaigns();
			} catch(error) {
				console.error('Failed to fetch campaigns:', error);
			} finally {
				loading.value = false;
			}
		};

		const deleteCampaign = async (campaignId: number) => {
			loading.value = true;
			try {
				await campaignStore.deleteCampaign(campaignId);
			} catch(error) {
				console.error('Failed to delete campaign:', error);
			}
		};

		const goToCreateCampaign = () => {
			router.push({ name: routeNames.createCampaign });
		};

		const goToCampaign = (campaignId: number) => {
			router.push({ name: routeNames.campaignDetails, params: { campaignId: campaignId } });
		};

		const confirmDeleteCampaign = (campaignId: number) => {
			confirm.require({
				message: 'Are you sure you want to proceed with deleting this campaign?',
				header: 'Confirm Delete Campaign',
				icon: 'pi pi-exclamation-triangle',
				rejectClass: 'p-button-secondary p-button-outlined',
				rejectLabel: 'Cancel',
				acceptLabel: 'Delete',
				accept: () => {
					deleteCampaign(campaignId);
				},
			});
		};

		return {
			routeNames,
			campaignStore,
			loading,
			getCampaigns,
			campaigns,
			goToCreateCampaign,
			goToCampaign,
			deleteCampaign,
			confirmDeleteCampaign,
		};
	},
	created() {
		this.getCampaigns();
	},
});
</script>
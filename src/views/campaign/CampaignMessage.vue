<template>
	<spinner v-if="loading || currentCampaignLoading || phoneNumbersLoading"></spinner>
	<TabMenu v-model:activeIndex="active" :model="tabItems" class="mb-4">
		<template #item="{ item, props }">
			<router-link
				v-slot="{ href, navigate }" 
				:to="{ name: item.route }" 
				custom
			>
				<a v-ripple :href="href" v-bind="props.action" @click="navigate">
					<span v-bind="props.icon" />
					<span v-bind="props.label">{{ item.label }}</span>
				</a>
			</router-link>
		</template>
	</TabMenu>
	<ScrollPanel style="width: 100%; height: 78vh">
		<div class="text-900 font-medium text-xl mb-3">Send A Message</div>
		<p class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">Send out a bulk SMS message to your campaign contacts.</p>
		<p v-if="currentCampaign?.phoneNumberId" class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">Note: Please remember that you are sending messages from this phone number: </p>
		<p v-else class="text-red-500 font-italic m-0 mb-4 p-0 text-600 line-height-3 mr-3">Messaging is disabled. You do not currently have a phone number associated with this campaign.</p>
		<div class="surface-card p-4 shadow-2 border-round">
			<div class="grid formgrid p-fluid">
				<div class="field mb-4 col-12">
					<label for="message" class="font-medium">Message Editor</label>
					<Editor 
						v-on:text-change="parseText" 
						editorStyle="height: 320px" 
						:readonly="!currentCampaign?.phoneNumberId" 
					>
						<template v-slot:toolbar>
							<span class="ql-formats">
							</span>
						</template>
					</Editor>
					<div class="col-12">
						<Button @click="sendBulkSMS" label="Send Message" class="w-auto mt-3" icon="pi pi-send" :disabled="!currentCampaign?.phoneNumberId"></Button>
					</div>
				</div>
			</div>
		</div>
	</ScrollPanel>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { routeNames } from '@/router/route-names';
import { useCampaignsStore } from '@/stores/campaign';
import { usePhoneNumberStore } from '@/stores/phoneNumbers';
import { useSmsStore } from '@/stores/sms';
import { useRoute } from 'vue-router';
import { ApiV1SmsSendBulkPostRequest } from '@/api-client';
import Spinner from '../../components/general/Loader.vue';

export default defineComponent({
	name: 'CampaignMessage',
	components: { Spinner },
	setup() {
		const route = useRoute();
		const campaignId = Number(route.params.campaignId);
		const campaignStore = useCampaignsStore();
		const smsStore = useSmsStore();
		const phoneNumberStore = usePhoneNumberStore();

		const currentCampaign = computed(() => useCampaignsStore().$state.currentCampaign);
		const phoneNumbers = computed(() => usePhoneNumberStore().$state.userPhoneNumbers);

		const loading = ref(false);
		const phoneNumbersLoading = ref(false);
		const currentCampaignLoading = ref(false);

		const active = ref(1);
		const tabItems = ref([
			{ label: 'Configure', icon: 'pi pi-cog', route: routeNames.campaignDetails },
			{ label: 'Send Message', icon: 'pi pi-send', route: routeNames.campaignMessage },
			{ label: 'Response Log', icon: 'pi pi-table', route: routeNames.campaignResponses },
			{ label: 'Results', icon: 'pi pi-chart-bar', route: routeNames.campaignResults },
		]);

		const message = ref('');

		const getPhoneNumbers = async () => {
			phoneNumbersLoading.value = true;
			try {
				await phoneNumberStore.fetchAllPhoneNumbers();
			} catch(error) {
				console.error('Failed to fetch phone numbers:', error);
			} finally {
				phoneNumbersLoading.value = false;
			}
		};

		const getCurrentCampaign = async () => {
			currentCampaignLoading.value = true;
			try {
				await campaignStore.fetchCampaignById(campaignId);
				
			} catch(error) {
				console.error('Failed to fetch campaign:', error);
			} finally {
				currentCampaignLoading.value = false;
			}
		};

		const sendBulkSMS = async () => {
			loading.value = true;
			const params: ApiV1SmsSendBulkPostRequest = {
				campaignId: campaignId,
				messageContent: message.value,
				twilioNumber: findCampaignPhoneNumber(),
			};
			console.log(params);
			try {
				await smsStore.sendBulkSMS(params);
			} catch (error) {
				console.error('Failed to send bulk SMS:', error);
			} finally {
				loading.value = false;
			}
		};

		const findCampaignPhoneNumber = (): string => {
			if (phoneNumbers.value) {
				const foundPhone = phoneNumbers.value.find(phone => phone.phoneNumberId === currentCampaign.value?.phoneNumberId);
				if (foundPhone) {
					return foundPhone.phoneNumber;
				}
			}
			return '';
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const parseText = (e: any) => {
			message.value = e.textValue;
		};
		
		return {
			campaignId,
			campaignStore,
			smsStore,
			currentCampaign,
			phoneNumbers,
			loading,
			currentCampaignLoading,
			phoneNumbersLoading,
			active,
			tabItems,
			message,
			sendBulkSMS,
			getPhoneNumbers,
			getCurrentCampaign,
			parseText,
		};
	},
	created() {
		this.getCurrentCampaign();
		this.getPhoneNumbers();
	},
});
</script>
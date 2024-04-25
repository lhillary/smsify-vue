<template>
	<spinner v-if="createLoading"></spinner>
	<ScrollPanel style="width: 100%; height: 85vh">
		<div class="text-900 font-medium text-xl mb-3">Create A New Campaign</div>
		<p class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">Odio euismod lacinia at quis risus sed vulputate odio. Non nisi est sit amet. Egestas integer eget aliquet nibh praesent tristique magna.</p>
		<div class="surface-card p-4 shadow-2 border-round">
			<div class="grid formgrid p-fluid">
				<div class="field mb-4 col-12">
					<label for="name" class="font-medium">Name</label>
					<InputText v-model="name" id="name" type="text" />
				</div>
				<div class="field mb-4 col-12">
					<label for="description" class="font-medium">Description</label>
					<Textarea v-model="description" id="description" type="text" />
				</div>
				<div class="surface-100 mb-3 col-12" style="height: 2px"></div>
				<div class="field mb-4 col-12">
					<label for="phone" class="font-medium">Phone Number</label>
					<Dropdown v-model="selectedPhoneNumber" :options="phoneNumberOptions" optionLabel="name" :filter="true" filterBy="name" :showClear="true"></Dropdown>
					<p class="m-0 mb-4 pt-3 text-600 line-height-3 mr-3">In order to send messages via your campaign, you will need to associate it with a phone number. If you have not yet purchased a phone number, that's okay! You can always come back and add it.</p>
				</div>
				<div class="surface-100 mb-3 col-12" style="height: 2px"></div>
				<div class="col-12">
					<router-link
						:to="{ name: routeNames.campaigns }"
					>
						<Button label="Cancel" severity="secondary" outlined class="w-auto mt-3 mr-3"></Button>
					</router-link>
					<Button @click="createCampaign" label="Create Campaign" class="w-auto mt-3"></Button>
				</div>
			</div>
		</div>
	</ScrollPanel>
</template>

<script lang=ts>
import { defineComponent, ref, computed } from 'vue';
import { routeNames } from '@/router/route-names';
import { usePhoneNumberStore } from '@/stores/phoneNumbers';
import { useCampaignsStore } from '@/stores/campaign';
import { type ApiV1CampaignPostRequest } from '@/api-client';
import Spinner from '../../components/general/Loader.vue';

export default defineComponent({
	name: 'CampaignCreate',
	components: { Spinner },
	setup() {
		const campaignStore = useCampaignsStore();
		const phoneNumberStore = usePhoneNumberStore();
		const phoneNumbersLoading = ref(false);
		const createLoading = ref(false);
		const selectedPhoneNumber = ref();
		const phoneNumbers = computed(() => usePhoneNumberStore().$state.userPhoneNumbers);
		const phoneNumberOptions = phoneNumbers.value ? phoneNumbers.value.map((phoneNumber) => {
			return {
				name: phoneNumber.phoneNumber,
				id: phoneNumber.phoneNumberId,
			};
		}) : [];
		const name = ref('');
		const description = ref('');

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

		const createCampaign = async () => {
			createLoading.value = true;
			const params: ApiV1CampaignPostRequest = {
				name: name.value,
				description: description.value,
			};

			if (selectedPhoneNumber.value) {
				params.phoneNumberId = selectedPhoneNumber.value.id;
			}

			try {
				await campaignStore.createCampaign(params);
			} catch(error) {
				console.error('Failed to fetch contacts:', error);
			} finally {
				createLoading.value = false;
			}
		};

		return {
			campaignStore,
			routeNames,
			phoneNumberStore,
			phoneNumbers,
			getPhoneNumbers,
			createCampaign,
			selectedPhoneNumber,
			phoneNumberOptions,
			phoneNumbersLoading,
			createLoading,
			name,
			description,
		};
	},
	created() {
		this.getPhoneNumbers();
	},
});
</script>
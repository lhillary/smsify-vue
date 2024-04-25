<template>
	<spinner v-if="loading"></spinner>
	<ScrollPanel style="width: 100%; height: 85vh">
		<div class="text-900 font-medium text-xl mb-3">Manage Phone Numbers</div>
		<p class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">Manage your existing phone numbers or purchase a new one.</p>
		<div class="surface-card p-4 shadow-2 border-round">
			<div class="grid formgrid p-fluid">
				<div class="text-500 font-medium text-lg mb-3">Purchase A New Number</div>
				<div class="surface-100 mb-3 col-12" style="height: 2px"></div>
				<div class="field mb-4 col-12">
					<label for="phone" class="font-medium">Search Available Phone Numbers</label>
					<AutoComplete
						v-model="selectedPhoneNumber"
						:suggestions="availablePhoneNumbers" 
						@complete="searchAvailablePhoneNumbers"
						field="phoneNumber"
						dataKey="phoneNumber"
						placeholder="Enter a number or part of it"
					/>
					<Button :disabled="!selectedPhoneNumber?.phoneNumber" class="w-auto mt-3" label="Purchase Number" @click="purchaseNumber" />
					<p class="m-0 mb-4 pt-3 text-600 line-height-3 mr-3">In order to send SMS messages via any of your campaigns, you will need to have a viable phone number. Search here to see what numbers are available.</p>
				</div>
				<div class="text-500 font-medium text-lg mb-3">Your Existing Phone Numbers</div>
				<div class="surface-100 mb-3 col-12" style="height: 2px"></div>
				<div v-if="!phoneNumbers?.length" class="field mb-4 col-12">
					<p class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">You do not have any existing numbers. Purchase a number above.</p>
				</div>
				<div v-else class="field mb-4 col-12">
					<DataTable 
						:value="phoneNumbers" 
						scrollable 
						scrollHeight="400px"
					>
						<Column field="phoneNumber" header="Phone Number"></Column>
						<Column field="country" header="Country"></Column>
						<Column field="isActive" header="Active"></Column>
						<Column bodyStyle="width: 4rem; text-align: center;">
							<template #body="slotProps">
								<Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteNumber(slotProps.data.phoneNumberId)" />
							</template>
						</Column>
					</DataTable>
				</div>
			</div>
		</div>
	</ScrollPanel>
	<ConfirmDialog></ConfirmDialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { usePhoneNumberStore } from '@/stores/phoneNumbers';
import Spinner from '../../components/general/Loader.vue';
import { type ApiV1PhoneNumberAvailableNumbersGet200ResponseInner, type ApiV1PhoneNumberPurchaseNumberPostRequest } from '@/api-client';
import { useConfirm } from 'primevue/useconfirm';

interface AutocompleteEvent {
  query: string;
}

export default defineComponent({
	name: 'PhoneNumberDetails',
	components: { Spinner },
	setup() {
		const phoneNumberStore = usePhoneNumberStore();
		const loading = ref(false);
		const selectedPhoneNumber = ref({} as ApiV1PhoneNumberAvailableNumbersGet200ResponseInner);
		const phoneNumbers = computed(() => usePhoneNumberStore().$state.userPhoneNumbers);
		const availablePhoneNumbers = ref([] as ApiV1PhoneNumberAvailableNumbersGet200ResponseInner[]);
		const confirm = useConfirm();

		const getPhoneNumbers = async () => {
			loading.value = true;
			try {
				await phoneNumberStore.fetchAllPhoneNumbers();
			} catch(error) {
				console.error('Failed to fetch phone numbers:', error);
			} finally {
				loading.value = false;
			}
		};

		const searchAvailablePhoneNumbers = async (event: AutocompleteEvent) => {
			const searchTerm = event.query as string;
			if (searchTerm.length > 2) {
				try {
					const numbers = await phoneNumberStore.listAvailableNumbers(searchTerm);
					availablePhoneNumbers.value = numbers.map(num => ({
						phoneNumber: num.phoneNumber,
						friendlyName: num.friendlyName,
					}));
				} catch (error) {
					console.error('Error fetching numbers:', error);
				}
			}
		};

		const purchaseNumber = async () => {
			loading.value = true;
			if (selectedPhoneNumber?.value.phoneNumber) {
				const params: ApiV1PhoneNumberPurchaseNumberPostRequest = {
					phoneNumber: selectedPhoneNumber?.value.phoneNumber,
					country: 'US',
				};
				try {
					await phoneNumberStore.purchasePhoneNumber(params);
				} catch(error) {
					console.error('Error purchasing number:', error);
				} finally {
					loading.value = false;
				}
			} else {
				loading.value = false;
				console.error('No phone number was selected');
				return;
			}
		};

		const deletePhoneNumber = async (phoneNumberId: number) => {
			console.log('DELETED:', phoneNumberId);
		};

		const confirmDeleteNumber = (phoneNumberId: number) => {
			confirm.require({
				message: 'Are you sure you want to proceed with deactivating this phone number?',
				header: 'Confirm Delete Phone Number',
				icon: 'pi pi-exclamation-triangle',
				rejectClass: 'p-button-secondary p-button-outlined',
				rejectLabel: 'Cancel',
				acceptLabel: 'Delete',
				accept: () => {
					deletePhoneNumber(phoneNumberId);
				},
			});
		};

		return {
			phoneNumberStore,
			loading,
			selectedPhoneNumber,
			phoneNumbers,
			getPhoneNumbers,
			searchAvailablePhoneNumbers,
			availablePhoneNumbers,
			purchaseNumber,
			confirmDeleteNumber,
		};
	},
	created() {
		this.getPhoneNumbers();
	},
});
</script>
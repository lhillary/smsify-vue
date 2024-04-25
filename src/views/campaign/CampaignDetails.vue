<template>
	<spinner v-if="loading || currentCampaignLoading || phoneNumbersLoading || contactsLoading || categoriesLoading"></spinner>
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
		<div class="mb-3 flex justify-content-between">
			<div class="text-900 font-medium text-xl" v-if="!editMode">{{ currentCampaign?.name }}</div>
			<div v-else class="text-base font-medium col-12">
				<label for="name" class="mr-3 block mb-1">Name</label>
				<InputText v-model="name" id="name" type="text" style="width: 85%;" />
			</div>
			<Button v-if="!editMode" @click="toggleEditMode" class="mr-3" icon="pi pi-pencil" rounded></Button>
		</div>
		<div class="mb-3 flex justify-content-between">
			<p v-if="!editMode" class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">
				{{ currentCampaign?.description }}
			</p>
			<div v-else class="text-base font-medium col-12">
				<label for="description" class="mr-3 block mb-1">Description</label>
				<Textarea v-model="description" id="description" type="text" style="width: 85%;" />
			</div>
		</div>
		<div class="mb-3 flex justify-content-between">
			<div class="text-base font-medium col-12">
				<div class="text-900 font-medium text-l mb-1">Campaign Status</div>
				<Tag :value="currentCampaign?.status"></Tag>
			</div>
		</div>
		<div v-if="editMode" class="col-12">
			<Button @click="toggleEditMode" label="Cancel" severity="secondary" outlined class="w-auto mb-3 mr-3"></Button>
			<Button @click="updateCampaign()" :disabled="!name && !description" label="Update Campaign" class="w-auto mb-3"></Button>
		</div>
		<div class="surface-card p-4 shadow-2 border-round">
			<div class="grid formgrid p-fluid">
				<div class="field mb-4 col-12">
					<template v-if="!editMode && !currentCampaign?.phoneNumberId">
						<p class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">
							You have no phone number associated with this campaign. Please select one below or purchase a phone number.
						</p>
					</template>
					<template v-else-if="!editMode && currentCampaign?.phoneNumberId">
						<p class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">
							The phone number associated with this campaign is:
							<span class="font-bold text-lg text-cyan-800">{{ findCampaignPhoneNumber() }}</span>
						</p>
					</template>
					<template v-if="!currentCampaign?.phoneNumberId">
						<div class="field">
							<label for="phone" class="font-medium mb-2">Phone Number</label>
							<Dropdown v-model="selectedPhoneNumber" :options="phoneNumberOptions" optionLabel="label" optionValue="value" :filter="true" filterBy="label" :showClear="true"></Dropdown>
							<Button @click="associatePhoneNumber" label="Add Phone Number" :disabled="!selectedPhoneNumber" class="w-auto mt-3"></Button>
							<p class="m-0 mb-4 pt-3 text-600 line-height-3 mr-3">In order to send messages via your campaign, you will need to associate it with a phone number. If you have not yet purchased a phone number, that's okay! You can always come back and add it.</p>
						</div>
					</template>
				</div>
				<div class="surface-100 mb-3 col-12" style="height: 2px"></div>
				<div class="field mb-2 col-12">
					<div class="text-900 font-medium text-l mb-1">Add Contacts</div>
					<p class="m-0 mb-4 pt-3 text-600 line-height-3 mr-3">Add your contacts now or come back and add them later.</p>
				</div>
				<div class="field mb-4 col-12">
					<Button @click="openAddContactModal" icon="pi pi-plus" rounded></Button>
				</div>
				<div v-if="campaignContacts?.length" class="field mb-4 col-12">
					<DataTable 
						v-model:editingRows="editingRows"
						:value="campaignContacts" 
						scrollable 
						scrollHeight="400px"
						dataKey="contactId" 
						editMode="row"
						@row-edit-save="onRowEditSave"
					>
						<Column field="name" header="Name" sortable>
							<template #editor="{ data, field }">
								<InputText v-model="data[field]" />
							</template>
						</Column>
						<Column field="phoneNumber" header="Phone Number">
							<template #editor="{ data, field }">
								<InputText v-model="data[field]" />
							</template>
						</Column>
						<Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align: center"></Column>
						<Column bodyStyle="width: 4rem; text-align: center;">
							<template #body="slotProps">
								<Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteContact(slotProps.data.contactId)" />
							</template>
						</Column>
					</DataTable>
				</div>
				<div class="surface-100 mb-3 col-12" style="height: 2px"></div>
				<div class="field mb-2 col-12">
					<div class="text-900 font-medium text-l mb-1">Add Response Categories</div>
					<p class="m-0 mb-4 pt-3 text-600 line-height-3 mr-3">Specify how you would like responses to your campaign to be categorized. Simply add a label (e.g., "Yes" or "No".) You may add up to five categories.</p>
				</div>
				<div class="field mb-4 col-12 md:col-2">
					<Button @click="openAddCategoryModal()" icon="pi pi-plus" rounded></Button>
				</div>
				<div class="surface-100 mb-3 col-12" style="height: 2px"></div>
				<div class="field mb-2 col-12">
					<div class="grid">
						<div
							v-for="(category, index) in campaignCategories"
							:key="index"
							class="col-12 md:col-6 xl:col-4 p-3"
						>
							<div class="surface-card shadow-2 border-round p-4">
								<div class="flex border-bottom-1 surface-border pb-4">
									<div class="mr-3" style="width: 70px; height: 70px">
										<Button icon="pi pi-filter" rounded></Button>
									</div>
									<div class="flex flex-column align-items-start">
										<span class="text-xl text-900 font-medium mb-1">{{ `Category ${index + 1}` }}</span>
										<span class="text-600 font-medium mb-2">{{ category.categoryLabel }}</span>
										<span class="bg-blue-50 text-blue-400 border-round inline-flex py-1 px-2 text-sm">Active</span>
									</div>
								</div>
								<div class="flex justify-content-between pt-4">
									<Button @click="confirmDeleteCategory(category.categoryId)" label="Delete" icon="pi pi-trash" class="p-button-outlined p-button-secondary w-6 mr-2"></Button>
									<Button @click="openAddCategoryModal(category.categoryId, true)" label="Edit" icon="pi pi-search" class="p-button-outlined p-button-secondary w-6 ml-2"></Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<DynamicDialog />
		<Toast />
		<ConfirmDialog></ConfirmDialog>
	</ScrollPanel>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import { markRaw, defineComponent, ref, computed } from 'vue';
import { routeNames } from '@/router/route-names';
import { usePhoneNumberStore } from '@/stores/phoneNumbers';
import { useContactsStore } from '@/stores/contact';
import { useCategoryStore } from '@/stores/category';
import { useCampaignsStore } from '@/stores/campaign';
import { useDialog } from 'primevue/usedialog';
import Spinner from '../../components/general/Loader.vue';
import AddContactModal from '@/components/campaign/AddContactModal.vue';
import AddCategoryModal from '@/components/campaign/AddCategoryModal.vue';
import DynamicDialog from 'primevue/dynamicdialog';
import ModalFooter from '@/components/modal/ModalFooter.vue';
import { ApiV1ContactPostRequest, ApiV1CampaignUpdateCampaignIdPutRequest, ApiV1CategoryPostRequest, PhoneNumber, ApiV1CategoryUpdateCategoryIdPutRequest } from '@/api-client';
import { formatPhoneNumberForDisplay, normalizePhoneNumber } from '@/utils/phoneNumberConfig';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

export default defineComponent({
	name: 'Campaign Details',
	components: { Spinner, DynamicDialog },
	props: {
		
	},
	setup() {
		const route = useRoute();
		const campaignId = Number(route.params.campaignId);

		const campaignStore = useCampaignsStore();
		const phoneNumberStore = usePhoneNumberStore();
		const contactsStore = useContactsStore();
		const categoryStore = useCategoryStore();
		const dialog = useDialog();
		const toast = useToast();
		const confirm = useConfirm();

		const editMode = ref(false);
		const loading = ref(false);
		const phoneNumbersLoading = ref(false);
		const currentCampaignLoading = ref(false);
		const contactsLoading = ref(false);
		const categoriesLoading = ref(false);
		const selectedPhoneNumber = ref<PhoneNumber | null>(null);
		const name = ref('');
		const description = ref('');
		const active = ref(0);
		const tabItems = ref([
			{ label: 'Configure', icon: 'pi pi-cog', route: routeNames.campaignDetails },
			{ label: 'Send Message', icon: 'pi pi-send', route: routeNames.campaignMessage },
			{ label: 'Response Log', icon: 'pi pi-table', route: routeNames.campaignResponses },
			{ label: 'Results', icon: 'pi pi-chart-bar', route: routeNames.campaignResults },
		]);
		const editingRows = ref([]);

		const phoneNumbers = computed(() => usePhoneNumberStore().$state.userPhoneNumbers);
		const currentCampaign = computed(() => useCampaignsStore().$state.currentCampaign);
		const campaignContacts = computed(() => useContactsStore().$state.campaignContacts);
		const campaignCategories = computed(() => useCategoryStore().$state.currentCampaignCategories);
		const phoneNumberOptions = computed(() => {
			return phoneNumbers.value ? phoneNumbers.value.map(phoneNumber => ({
				label: phoneNumber.phoneNumber,
				value: phoneNumber,
			})) : [];
		});

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

		const getContacts = async () => {
			contactsLoading.value = true;
			try {
				await contactsStore.fetchCampaignContacts(campaignId);
			} catch(error) {
				console.error('Failed to fetch contacts:', error);
			} finally {
				contactsLoading.value = false;
			}
		};

		const getCategories = async () => {
			categoriesLoading.value = true;
			try {
				await categoryStore.getCategoriesByCampaign(campaignId);
			} catch(error) {
				console.error('Failed to fetch categories:', error);
			} finally {
				categoriesLoading.value = false;
			}
		};

		const addContact = async (options: ApiV1ContactPostRequest) => {
			try {
				await contactsStore.createContact(options);
			} catch(error) {
				console.error('Failed to create contact:', error);
			} finally {
				getContacts();
			}
		};

		const openAddContactModal = () => {
			dialog.open(AddContactModal, {
				props: {
					header: 'Add Contact',
					modal: true,
					breakpoints: {
						'960px': '75vw', 
						'640px': '100vw',
					},
					draggable: false,
					style: {
						width: '52vw',
					},
					appendTo: 'body',
				},
				templates: {
					footer: markRaw(ModalFooter),
				},
				onClose: (options) => {
					const data = options ? options.data : null;
					if (data) {
						const phoneNumber = normalizePhoneNumber(data.phoneNumber.value, 'US');
						if (phoneNumber) {
							const cleaned: ApiV1ContactPostRequest = {
								name: data.name.value,
								phoneNumber: phoneNumber,
								campaignId: campaignId,
							};
							addContact(cleaned);
						} else {
							toast.add({ severity: 'error', summary: 'Phone number invalid', life: 3000 });
						}
					}
				},
			});
		};

		const toggleEditMode = () => {
			editMode.value = !editMode.value;
			name.value = '';
			description.value = '';
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const onRowEditSave = async (event: any) => {
			let { newData } = event;
			contactsLoading.value = true;
			const contact = newData;
			try {
				await contactsStore.updateContact(contact.contactId, {
					name: contact.name,
					phoneNumber: contact.phoneNumber,
				});
				getContacts();
			} catch (error) {
				console.error('Failed to update contact:', error);
			}
		};

		const deleteContact = async (contactId: number) => {
			contactsLoading.value = true;
			try {
				await contactsStore.deleteContact(contactId);
			} catch(error) {
				console.error('Failed to delete contact:', error);
			} finally {
				getContacts();
			}
		};

		const confirmDeleteContact = (contactId: number) => {
			confirm.require({
				message: 'Are you sure you want to proceed with deleting this contact?',
				header: 'Confirm Delete Contact',
				icon: 'pi pi-exclamation-triangle',
				rejectClass: 'p-button-secondary p-button-outlined',
				rejectLabel: 'Cancel',
				acceptLabel: 'Delete',
				accept: () => {
					deleteContact(contactId);
				},
			});
		};

		const updateCampaign = async (phoneNumberId?: number) => {
			currentCampaignLoading.value = true;
			editMode.value = false;
			let params: ApiV1CampaignUpdateCampaignIdPutRequest = {};
			if (name.value) 
				params.name = name.value;
			if (description.value)
				params.description = description.value;
			if (phoneNumberId)
				params.phoneNumberId = phoneNumberId;
			try {
				await campaignStore.updateCampaign(campaignId, params);
			} catch(error) {
				console.error('Failed to update campaign:', error);
			} finally {
				getCurrentCampaign();
			}
		};

		const associatePhoneNumber = () => {
			updateCampaign(selectedPhoneNumber?.value?.phoneNumberId);
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

		const createCampaignCategory = async (label: string) => {
			categoriesLoading.value = true;
			const labelArray = [
				label,
			];
			const params: ApiV1CategoryPostRequest = {
				campaignId: campaignId,
				categoryLabels: labelArray,
			};
			try {
				await categoryStore.createCategory(params);
			} catch (error) {
				console.error('Failed to update campaign:', error);
			} finally {
				getCategories();
			}
		};

		const openAddCategoryModal = (categoryId?: number, editMode = false) => {
			dialog.open(AddCategoryModal, {
				props: {
					header: editMode ? 'Edit Category' : 'Add Category',
					modal: true,
					breakpoints: {
						'960px': '75vw', 
						'640px': '100vw',
					},
					draggable: false,
					style: {
						width: '52vw',
					},
					appendTo: 'body',
				},
				templates: {
					footer: markRaw(ModalFooter),
				},
				data: {
					editMode: editMode ? true : false,
				},
				onClose: (options) => {
					const data = options ? options.data : null;
					if (data) {
						const labels = data.categoryLabels.value;
						if (labels) {
							if (editMode) {
								if (categoryId)
									updateCategory(categoryId, labels);
							} else {
								createCampaignCategory(labels);
							}
						} else {
							toast.add({ severity: 'error', summary: 'Category labels are invalid', life: 3000 });
						}
					}
				},
			});
		};

		const confirmDeleteCategory = (categoryId: number) => {
			confirm.require({
				message: 'Are you sure you want to proceed with deleting this category?',
				header: 'Confirm Delete Category',
				icon: 'pi pi-exclamation-triangle',
				rejectClass: 'p-button-secondary p-button-outlined',
				rejectLabel: 'Cancel',
				acceptLabel: 'Delete',
				accept: () => {
					deleteCategory(categoryId);
				},
			});
		};

		const deleteCategory = async (categoryId: number) => {
			categoriesLoading.value = true;
			try {
				await categoryStore.deleteCategory(categoryId);
			} catch(error) {
				console.error('Failed to delete category:', error);
			} finally {
				getCategories();
			}
		};

		const updateCategory = async (categoryId: number, label: string) => {
			categoriesLoading.value = true;
			const params: ApiV1CategoryUpdateCategoryIdPutRequest = {
				newLabel: label,
			};
			try {
				await categoryStore.updateCategory(categoryId, params);
			} catch (error) {
				console.error('Failed to update campaign:', error);
			} finally {
				getCategories();
			}
		};

		return {
			editMode,
			campaignStore,
			routeNames,
			phoneNumberStore,
			contactsStore,
			categoryStore,
			phoneNumbers,
			getCurrentCampaign,
			campaignContacts,
			getPhoneNumbers,
			getCategories,
			getContacts,
			selectedPhoneNumber,
			phoneNumberOptions,
			loading,
			phoneNumbersLoading,
			currentCampaignLoading,
			contactsLoading,
			categoriesLoading,
			currentCampaign,
			active,
			tabItems,
			toggleEditMode,
			name,
			description,
			openAddContactModal,
			formatPhoneNumberForDisplay,
			editingRows,
			onRowEditSave,
			deleteContact,
			confirmDeleteContact,
			updateCampaign,
			associatePhoneNumber,
			findCampaignPhoneNumber,
			createCampaignCategory,
			openAddCategoryModal,
			campaignCategories,
			confirmDeleteCategory,
			updateCategory,
			deleteCategory,
		};
	},
	created() {
		this.getCurrentCampaign();
		this.getPhoneNumbers();
		this.getContacts();
		this.getCategories();
	},
});
</script>
<template>
	<spinner v-if="contactsLoading || responsesLoading || messagesLoading"></spinner>
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
		<div class="text-900 font-medium text-xl mb-3">Response Log</div>
		<p class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">A log of your all responses received to this campaign.</p>
		<div class="surface-card p-4 shadow-2 border-round">
			<div class="grid formgrid p-fluid">
				<div class="field mb-4 col-12">
					<template v-if="!responseLog.length">
						<p class="m-0 mb-4 p-0 text-600 line-height-3 mr-3">
							You have not received any responses yet.
						</p>
					</template>
					<template v-else>
						<DataTable
							:value="responseLog"
							scrollable 
							scrollHeight="600px"
							stripedRows
						>
							<Column field="from" header="Respondent" sortable></Column>
							<Column field="phoneNumber" header="Phone Number"></Column>
							<Column field="response" header="Response"></Column>
							<Column field="respondingTo" header="Responding To" sortable></Column>
							<Column field="timeToRespond" header="Time To Respond" sortable></Column>
						</DataTable>
					</template>
				</div>
			</div>
		</div>
	</ScrollPanel>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { routeNames } from '@/router/route-names';
import Spinner from '../../components/general/Loader.vue';
import { useRoute } from 'vue-router';
import { useContactsStore } from '@/stores/contact';
import { useSmsStore } from '@/stores/sms';
import { ResponseLog } from '@/interfaces/general';
import { calculateTimeDifference } from '@/utils/general';

export default defineComponent({
	name: 'CampaignResponses',
	components: { Spinner },
	setup() {
		const route = useRoute();
		const campaignId = Number(route.params.campaignId);

		const smsStore = useSmsStore();
		const contactsStore = useContactsStore();

		const campaignResponses = computed(() => smsStore.$state.campaignResponses ?? []);
		const campaignMessages = computed(() => smsStore.$state.campaignMessages ?? []);
		const campaignContacts = computed(() => contactsStore.$state.campaignContacts ?? []);
		
		const responseLog = computed(() => {
			return campaignResponses.value.map(response => {
				const message = campaignMessages.value.find(m => m.messageId === response.messageId);
				const contact = message ? campaignContacts.value.find(c => c.contactId === message.contactId) : undefined;

				const sentAt = message?.sentAt;
				const receivedAt = response?.receivedAt;

				return {
					from: contact?.name ?? 'Unknown',
					phoneNumber: contact?.phoneNumber ?? 'Unknown',
					response: response.responseContent,
					respondingTo: message?.messageContent ?? 'No message content',
					timeToRespond: sentAt && receivedAt ? calculateTimeDifference(sentAt, receivedAt) : 'Unknown',
				} as ResponseLog;
			});
		});

		const contactsLoading = ref(false);
		const responsesLoading = ref(false);
		const messagesLoading = ref(false);

		const active = ref(2);
		const tabItems = ref([
			{ label: 'Configure', icon: 'pi pi-cog', route: routeNames.campaignDetails },
			{ label: 'Send Message', icon: 'pi pi-send', route: routeNames.campaignMessage },
			{ label: 'Response Log', icon: 'pi pi-table', route: routeNames.campaignResponses },
			{ label: 'Results', icon: 'pi pi-chart-bar', route: routeNames.campaignResults },
		]);

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

		const getResponses = async () => {
			responsesLoading.value = true;
			try {
				await smsStore.getResponsesByCampaign(campaignId);
			} catch(error) {
				console.error('Failed to fetch responses:', error);
			} finally {
				responsesLoading.value = false;
			}
		};

		const getMessages = async () => {
			messagesLoading.value = true;
			try {
				await smsStore.getMessagesByCampaign(campaignId);
			} catch(error) {
				console.error('Failed to fetch responses:', error);
			} finally {
				messagesLoading.value = false;
			}
		};

		return {
			campaignId,
			smsStore,
			contactsStore,
			routeNames,
			campaignResponses,
			campaignMessages,
			campaignContacts,
			contactsLoading,
			responsesLoading,
			messagesLoading,
			active,
			tabItems,
			getContacts,
			getResponses,
			getMessages,
			responseLog,
		};
	},
	created() {
		this.getContacts();
		this.getResponses();
		this.getMessages();
	},
});
</script>
<template>
	<spinner v-if="loading"></spinner>
	<ConfirmDialog></ConfirmDialog>
	<ScrollPanel style="width: 100%; height: 78vh">
		<div class="surface-section px-6 py-5">
			<div class="text-900 font-medium text-3xl mb-2">Settings</div>
			<p class="m-0 mb-5 p-0 text-600 line-height-3">Manage your integrations and account preferences.</p>

			<div
				v-if="connectRequired && !isTwilioConnected"
				class="flex align-items-center p-3 mb-4 bg-yellow-100 text-yellow-900 border-round"
			>
				<i class="pi pi-exclamation-triangle mr-3 text-xl"></i>
				<span>Connect your Twilio account to use SMS features like purchasing numbers and sending campaigns.</span>
			</div>

			<div class="surface-card shadow-2 p-4 border-1 border-50 border-round">
				<div class="flex align-items-start justify-content-between flex-column md:flex-row">
					<div>
						<div class="flex align-items-center mb-2">
							<span class="text-900 font-medium text-xl mr-3">Twilio</span>
							<Tag v-if="isTwilioConnected" severity="success" value="Connected"></Tag>
							<Tag v-else severity="warning" value="Not Connected"></Tag>
						</div>
						<p v-if="isTwilioConnected" class="m-0 text-600 line-height-3">
							Connected as <span class="font-medium text-900">{{ maskedSid }}</span>
						</p>
						<p v-else class="m-0 text-600 line-height-3" style="max-width: 40rem">
							Smsify sends messages and purchases phone numbers through your own Twilio account.
							Connect your account to enable SMS features. You'll be taken to Twilio to log in
							(or sign up) and approve access, then brought back here.
						</p>
					</div>
					<div class="mt-3 md:mt-0 flex-shrink-0">
						<Button
							v-if="isTwilioConnected"
							label="Disconnect"
							icon="pi pi-times"
							severity="danger"
							outlined
							@click="confirmDisconnect"
						></Button>
						<Button
							v-else
							label="Connect with Twilio"
							icon="pi pi-link"
							@click="connectWithTwilio"
						></Button>
					</div>
				</div>
			</div>
		</div>
	</ScrollPanel>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/stores/user';
import { TWILIO_AUTHORIZE_URL } from '@/constants/external-urls';
import { getApiErrorMessage } from '@/utils/toast';
import Spinner from '../../components/general/Loader.vue';

export default defineComponent({
	name: 'Settings',
	components: { Spinner },
	setup() {
		const loading = ref(false);
		const route = useRoute();
		const router = useRouter();
		const confirm = useConfirm();
		const toast = useToast();
		const userStore = useUserStore();

		const isTwilioConnected = computed(() => userStore.isTwilioConnected);
		const connectRequired = computed(() => route.query.reason === 'connect-required');

		// Show only the prefix and last four characters of the Account SID
		const maskedSid = computed(() => {
			const sid = userStore.connectedAccountSid;
			return sid ? `${sid.slice(0, 2)}\u2026${sid.slice(-4)}` : '';
		});

		onMounted(() => {
			if (route.query.connected === '1') {
				toast.add({
					severity: 'success',
					summary: 'Twilio connected',
					detail: 'Your Twilio account is connected. SMS features are now enabled.',
					life: 5000,
				});
				router.replace({ query: {} });
			}
		});

		const connectWithTwilio = () => {
			window.location.href = TWILIO_AUTHORIZE_URL;
		};

		const confirmDisconnect = () => {
			confirm.require({
				header: 'Disconnect Twilio?',
				message:
					'Your existing phone numbers and campaigns will stop working through Smsify until you reconnect. ' +
					'Your data stays saved here, but purchasing numbers and sending messages will be unavailable.',
				icon: 'pi pi-exclamation-triangle',
				acceptLabel: 'Disconnect',
				rejectLabel: 'Cancel',
				acceptClass: 'p-button-danger',
				accept: async () => {
					loading.value = true;
					try {
						await userStore.disconnectTwilio();
						toast.add({
							severity: 'info',
							summary: 'Twilio disconnected',
							detail: 'Reconnect at any time to resume SMS features.',
							life: 5000,
						});
					} catch (error) {
						console.error('Failed to disconnect Twilio:', error);
						toast.add({
							severity: 'error',
							summary: 'Disconnect failed',
							detail: getApiErrorMessage(error),
							life: 5000,
						});
					} finally {
						loading.value = false;
					}
				},
			});
		};

		return {
			loading,
			isTwilioConnected,
			connectRequired,
			maskedSid,
			connectWithTwilio,
			confirmDisconnect,
		};
	},
});
</script>

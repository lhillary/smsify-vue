<template>
	<div class="surface-overlay px-4 md:px-6 lg:px-8 flex align-items-center justify-content-center relative" style="min-height: 100vh">
		<div class="surface-card p-5 shadow-2 border-round w-full lg:w-6 text-center">
			<img src="../../assets/logo.svg" alt="Smsify" height="80" class="mb-4" />

			<div v-if="status === 'processing'">
				<ProgressSpinner style="width: 50px; height: 50px" />
				<div class="text-900 text-2xl font-medium mt-3 mb-2">Finishing Twilio connection…</div>
				<p class="text-600 line-height-3 m-0">Verifying your authorization with Twilio. This only takes a moment.</p>
			</div>

			<div v-else-if="status === 'success'">
				<i class="pi pi-check-circle text-green-500 text-5xl"></i>
				<div class="text-900 text-2xl font-medium mt-3 mb-2">Twilio connected!</div>
				<p class="text-600 line-height-3 m-0 mb-4">Taking you back to your settings…</p>
			</div>

			<div v-else-if="status === 'cancelled'">
				<i class="pi pi-times-circle text-orange-500 text-5xl"></i>
				<div class="text-900 text-2xl font-medium mt-3 mb-2">Connection cancelled</div>
				<p class="text-600 line-height-3 m-0 mb-4">
					It looks like the Twilio authorization was declined or didn't complete.
					You can try again whenever you're ready.
				</p>
				<Button label="Back to Settings" icon="pi pi-arrow-left" @click="goToSettings"></Button>
			</div>

			<div v-else-if="status === 'rejected'">
				<i class="pi pi-exclamation-circle text-red-500 text-5xl"></i>
				<div class="text-900 text-2xl font-medium mt-3 mb-2">Connection failed</div>
				<p class="text-600 line-height-3 m-0 mb-4">
					Twilio didn't confirm the authorization. This can happen if the flow was
					interrupted — please try connecting again.
				</p>
				<Button label="Try Again" icon="pi pi-refresh" class="mr-2" @click="retryAuthorize"></Button>
				<Button label="Back to Settings" severity="secondary" outlined @click="goToSettings"></Button>
			</div>

			<div v-else-if="status === 'conflict'">
				<i class="pi pi-exclamation-circle text-red-500 text-5xl"></i>
				<div class="text-900 text-2xl font-medium mt-3 mb-2">Account already linked</div>
				<p class="text-600 line-height-3 m-0 mb-4">
					That Twilio account is already connected to a different Smsify user.
					Please use another Twilio account, or disconnect it from the other user first.
				</p>
				<Button label="Back to Settings" icon="pi pi-arrow-left" @click="goToSettings"></Button>
			</div>

			<div v-else-if="status === 'sessionExpired'">
				<i class="pi pi-lock text-orange-500 text-5xl"></i>
				<div class="text-900 text-2xl font-medium mt-3 mb-2">Session expired</div>
				<p class="text-600 line-height-3 m-0 mb-4">
					Your Smsify session expired while you were on Twilio's site.
					Please log back in, then click "Connect with Twilio" again.
				</p>
				<Button label="Log In" icon="pi pi-sign-in" @click="goToLogin"></Button>
			</div>

			<div v-else>
				<i class="pi pi-exclamation-circle text-red-500 text-5xl"></i>
				<div class="text-900 text-2xl font-medium mt-3 mb-2">Something went wrong</div>
				<p class="text-600 line-height-3 m-0 mb-4">
					We couldn't complete the connection. Please try again from your settings page.
				</p>
				<Button label="Back to Settings" icon="pi pi-arrow-left" @click="goToSettings"></Button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import { useUserStore } from '@/stores/user';
import { routeNames } from '@/router/route-names';
import { TWILIO_AUTHORIZE_URL } from '@/constants/external-urls';

type CallbackStatus = 'processing' | 'success' | 'cancelled' | 'rejected' | 'conflict' | 'sessionExpired' | 'error';

export default defineComponent({
	name: 'TwilioCallback',
	setup() {
		const router = useRouter();
		const userStore = useUserStore();
		const status = ref<CallbackStatus>('processing');

		// Read the query string before Vue Router or anything else touches it,
		// then scrub the AccountSid out of the address bar and browser history
		// immediately (Twilio's own recommendation).
		const params = new URLSearchParams(window.location.search);
		const accountSid = params.get('AccountSid');
		const authError = params.get('error');
		window.history.replaceState({}, '', '/twilio/callback');

		const goToSettings = () => {
			router.push({ name: routeNames.settings });
		};

		const goToLogin = () => {
			router.push({ name: routeNames.unauthorized });
		};

		const retryAuthorize = () => {
			window.location.href = TWILIO_AUTHORIZE_URL;
		};

		onMounted(async () => {
			if (authError || !accountSid) {
				status.value = 'cancelled';
				return;
			}

			if (!userStore.isLoggedIn) {
				status.value = 'sessionExpired';
				return;
			}

			try {
				await userStore.connectTwilio(accountSid);
				status.value = 'success';
				setTimeout(() => {
					router.push({ name: routeNames.settings, query: { connected: '1' } });
				}, 1200);
			} catch (error) {
				console.error('Failed to link Twilio account:', error);
				const responseStatus = isAxiosError(error) ? error.response?.status : undefined;
				if (responseStatus === 400) {
					// Twilio rejected the SID — the authorization didn't complete
					status.value = 'rejected';
				} else if (responseStatus === 409) {
					status.value = 'conflict';
				} else if (responseStatus === 401) {
					// JWT expired mid-flow (e.g. user parked on the Twilio screen)
					status.value = 'sessionExpired';
				} else {
					status.value = 'error';
				}
			}
		});

		return {
			status,
			goToSettings,
			goToLogin,
			retryAuthorize,
		};
	},
});
</script>

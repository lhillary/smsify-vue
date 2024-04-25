<template>
	<ScrollPanel style="width: 100%; height: 78vh">
		<div class="text-900 font-medium text-xl mb-3 mt-3">{{ `Welcome, ${userName}` }}</div>
		<p class="m-0 mb-2 p-0 text-600 line-height-3">Welcome to your Smsify dashboard!</p>
		<p class="m-0 mb-6 p-0 text-600 line-height-3">Get started making a campaign, purchase a phone number, or manage your existing campaigns.</p>
		<div class="grid">
			<div class="col-12 lg:col-6 xl:col-3">
				<div class="surface-card shadow-2 p-3 border-1 border-50 border-round">
					<div class="flex justify-content-between mb-3">
						<div>
							<span class="block text-500 font-medium mb-3">Campaigns</span>
							<div class="text-900 font-medium text-xl">152</div>
						</div>
						<div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
							<i class="pi pi-megaphone text-blue-500 text-xl"></i>
						</div>
					</div>
					<router-link
						class="text-sm text-cyan-600"
						:to="{ name: routeNames.campaigns}"
					>
						Go to Campaigns >>
					</router-link>
				</div>
			</div>
			<div class="col-12 lg:col-6 xl:col-3">
				<div class="surface-card shadow-2 p-3 border-1 border-50 border-round">
					<div class="flex justify-content-between mb-3">
						<div>
							<span class="block text-500 font-medium mb-3">Phone Numbers</span>
							<div class="text-900 font-medium text-xl">152</div>
						</div>
						<div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
							<i class="pi pi-phone text-blue-500 text-xl"></i>
						</div>
					</div>
					<router-link
						class="text-sm text-cyan-600"
						:to="{ name: routeNames.phoneNumberDetails }"
					>
						Go to Phone Numbers >>
					</router-link>
				</div>
			</div>
		</div>
	</ScrollPanel>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { routeNames } from '@/router/route-names';
import { useUserStore } from '@/stores/user';

export default defineComponent({
	name: 'Landing',
	setup() {
		const userStore = useUserStore();
		const userName = computed(() => userStore.$state.user?.username);

		return {
			routeNames,
			userStore,
			userName,
		};
	},
});
</script>
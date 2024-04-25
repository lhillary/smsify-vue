<template>
	<div class="surface-overlay px-4 md:px-6 lg:px-8 flex align-items-center justify-content-center relative" style="min-height: 100vh">
		<spinner v-if="loading"></spinner>
		<form 
			@submit.prevent="login" 
			class="surface-card p-4 shadow-2 border-round w-full lg:w-6"
		>
			<div class="text-center mb-5">
				<img 
					src="../../assets/logo.svg" 
					alt="Image" 
					height="100" 
					class="mb-3" 
				/>
				<div class="text-900 text-3xl font-medium mb-3">
					Welcome Back
				</div>
				<span class="text-600 font-medium line-height-3">
					Don't have an account?
				</span>
				<router-link 
					:to="{ name: routeNames.register }" 
					class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
					Create today!
				</router-link>
			</div>

			<div>
				<label 
					for="email1" 
					class="block text-900 font-medium mb-2"
				>
					Email
				</label>
				<InputText 
					v-model="email"
					required
					id="email1" 
					type="text" 
					placeholder="Email address" 
					class="w-full mb-3" 
				/>

				<label 
					for="password1" 
					class="block text-900 font-medium mb-2"
				>
					Password
				</label>
				<Password
					v-model="password"
					:feedback="false"
					required
					id="password1"
					placeholder="Password"
					class="w-full mb-3" 
					input-class="w-full mb-3" 
				/>

				<div class="flex align-items-center justify-content-center mb-6">
					<div class="flex align-items-center p-error">
						{{ errorMessage }}
					</div>
				</div>

				<Button 
					type="submit"
					label="Sign In" 
					icon="pi pi-user" 
					class="w-full"
				>
				</Button>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useUserStore } from '../../stores/user';
import Spinner from '../../components/general/Loader.vue';
import { useRouter } from 'vue-router';
import { routeNames } from '@/router/route-names';

export default defineComponent({
	name: 'Unauthorized',
	components: { Spinner },
	setup() { 
		const router = useRouter();
		const userStore = useUserStore();
		const email = ref('');
		const password = ref('');
		const loading = ref(false);
		const errorMessage = ref('');

		const login = async () => {
			loading.value = true;
			errorMessage.value = '';
			try {
				await userStore.login(email.value, password.value);
				router.push({ name: routeNames.dashboard });
			} catch(error) {
				console.error('Login failed:', error);
				errorMessage.value = 'Failed to login. Check your credentials.';
			} finally {
				loading.value = false;
			}
		};

		return {
			userStore,
			email,
			password,
			loading,
			errorMessage,
			login,
			routeNames,
		};
	},
});
</script>
<template>
	<div class="surface-overlay px-4 md:px-6 lg:px-8 flex align-items-center justify-content-center relative" style="min-height: 100vh">
		<spinner v-if="loading"></spinner>
		<form 
			@submit.prevent="register"
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
					Create An Account
				</div>
				<span class="text-600 font-medium line-height-3">
					Already have an account?
				</span>
				<router-link 
					:to="{ name: routeNames.unauthorized }" 
					class="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
				>
					Login
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
					required
					v-model="email"
					id="email1" 
					type="text" 
					placeholder="Email address" 
					class="w-full mb-3" 
				/>
				<label 
					for="username1" 
					class="block text-900 font-medium mb-2"
				>
					Username
				</label>
				<InputText 
					required
					v-model="username"
					id="username1" 
					type="text" 
					placeholder="Username" 
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
					required
					id="password1"
					placeholder="Password"
					class="w-full mb-3" 
					input-class="w-full mb-3"
				/>
				<Button 
					type="submit"
					label="Register" 
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
import { useRouter } from 'vue-router';
import { routeNames } from '@/router/route-names';

export default defineComponent({
	name: 'Register',
	setup() { 
		const router = useRouter();
		const userStore = useUserStore();
		const email = ref('');
		const username = ref('');
		const password = ref('');
		const loading = ref(false);
		const errorMessage = ref('');

		const register = async () => {
			loading.value = true;
			errorMessage.value = '';
			try {
				await userStore.register(email.value, username.value, password.value);
				// kick them back to login after registering
				userStore.logout();
				router.push({ name: routeNames.unauthorized });
			} catch(error) {
				console.error('Registration failed:', error);
				errorMessage.value = 'Failed to register new account.';
			} finally {
				loading.value = false;
			}
		};

		return {
			userStore,
			email,
			username,
			password,
			loading,
			errorMessage,
			register,
			routeNames,
		};
	},
});
</script>
<template>
	<spinner v-if="loading"></spinner>
	<ScrollPanel style="width: 100%; height: 78vh">
		<div class="surface-section px-6 py-5">
			<div class="flex align-items-start flex-column lg:flex-row lg:justify-content-between">
				<div class="flex align-items-start flex-column md:flex-row">
					<Avatar image="https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp" class="flex align-items-center justify-content-center mr-2" size="xlarge" />
					<div>
						<span v-if="!editMode" class="text-900 font-medium text-3xl">{{ currentUser?.username }}</span>
						<InputText v-else v-model="username" placeholder="Username"></InputText>
						<i class="pi pi-star text-2xl ml-4 text-yellow-500"></i>
						<div class="flex align-items-center flex-wrap text-sm">
							<div class="mr-5 mt-3">
								<span v-if="!editMode" class="font-medium text-500">EMAIL</span>
								<div v-if="!editMode" class="text-700 mt-2">{{ currentUser?.email }}</div>
								<InputText v-else v-model="email" placeholder="Email"></InputText>
							</div>
							<div class="mr-5 mt-3">
								<span class="font-medium text-500">ACCOUNT</span>
								<div class="text-700 mt-2">Premium</div>
							</div>
						</div>
					</div>
				</div>
				<div class="mt-3 lg:mt-0">
					<Button v-if="!editMode" @click="toggleEditMode" icon="pi pi-pencil" class="p-button-rounded mr-2"></Button>
				</div>
			</div>
			<Button v-if="editMode" @click="toggleEditMode" label="Cancel" severity="secondary" outlined class="mt-5 mr-3"></Button>
			<Button v-if="editMode" @click="updateUser" label="Update Profile" class="mt-5"></Button>
		</div>
	</ScrollPanel>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { routeNames } from '@/router/route-names';
import { useUserStore } from '@/stores/user';
import Spinner from '../../components/general/Loader.vue';
import { type ApiV1UserUpdatePutRequest } from '@/api-client';

export default defineComponent({
	name: 'UserProfile',
	components: { Spinner },
	setup() {
		const loading = ref(false);
		const userStore = useUserStore();
		const editMode = ref(false);
		const logOut = () => {
			userStore.logout();
		};
		const currentUser = computed(() => useUserStore().$state.user);

		const toggleEditMode = () => {
			editMode.value = !editMode.value;
			console.log(currentUser);
		};

		const username = ref('');
		const email = ref('');

		const updateUser = async () => {
			loading.value = true;
			let params: ApiV1UserUpdatePutRequest = {};
			if (username.value) {
				params.username = username.value;
			}
			if (email.value) {
				params.email = email.value;
			}
			try {
				await userStore.update(params);
			} catch(error) {
				console.error('Failed to update profile:', error);
			} finally {
				loading.value = false;
			}
		};

		return {
			loading,
			routeNames,
			userStore,
			editMode,
			logOut,
			currentUser,
			toggleEditMode,
			username,
			email,
			updateUser,
		};
	},
});
</script>
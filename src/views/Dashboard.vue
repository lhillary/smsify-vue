<template>
	<div class="min-h-screen flex relative lg:static surface-ground">
		<div id="app-sidebar-2" class="bg-cyan-800 h-screen hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 select-none" style="width: 280px">
			<div class="flex flex-column h-full">
				<div class="flex align-items-center px-5 bg-white flex-shrink-0" style="height: 60px">
					<img src="../assets/logo.svg" alt="Image" height="60" />
				</div>
				<div class="overflow-y-auto mt-3">
					<ul class="list-none p-3 m-0">
						<li>
							<router-link  
								to="/"
								v-ripple 
								class="flex align-items-center cursor-pointer p-3 hover:bg-cyan-900 border-round text-bluegray-100 hover:text-bluegray-50 transition-duration-150 transition-colors p-ripple"
							>
								<i class="pi pi-home mr-2"></i>
								<span class="font-medium">Dashboard</span>
							</router-link >
						</li>
						<li>
							<router-link  
								:to="{ name: routeNames.phoneNumberDetails }"
								v-ripple 
								class="flex align-items-center cursor-pointer p-3 hover:bg-cyan-900 border-round text-bluegray-100 hover:text-bluegray-50 transition-duration-150 transition-colors p-ripple"
							>
								<i class="pi pi-phone mr-2"></i>
								<span class="font-medium">Phone Numbers</span>
							</router-link>
						</li>
						<li>
							<router-link 
								:to="{ name: routeNames.campaigns }"
								v-ripple 
								class="flex align-items-center cursor-pointer p-3 hover:bg-cyan-900 border-round text-bluegray-100 hover:text-bluegray-50 transition-duration-150 transition-colors p-ripple"
							>
								<i class="pi pi-megaphone mr-2"></i>
								<span class="font-medium">Campaigns</span>
							</router-link>
						</li>
						<li>
							<router-link 
								:to="{ name: routeNames.userProfile }"
								v-ripple 
								class="flex align-items-center cursor-pointer p-3 hover:bg-cyan-900 border-round text-bluegray-100 hover:text-bluegray-50 transition-duration-150 transition-colors p-ripple"
							>
								<i class="pi pi-user mr-2"></i>
								<span class="font-medium">Profile</span>
							</router-link>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="min-h-screen flex flex-column relative flex-auto">
			<div class="flex justify-content-between align-items-center px-5 surface-section shadow-2 relative lg:static border-bottom-1 surface-border bg-white" style="height: 60px">
				<div class="flex">
					<a
						v-ripple
						class="cursor-pointer block lg:hidden text-700 mr-3 mt-1 p-ripple"
						v-styleclass="{
							selector: '#app-sidebar-2',
							enterClass: 'hidden',
							enterActiveClass: 'fadeinleft',
							leaveToClass: 'hidden',
							leaveActiveClass: 'fadeoutleft',
							hideOnOutsideClick: true
						}"
					>
						<i class="pi pi-bars text-4xl"></i>
					</a>
				</div>
				<a
					v-ripple
					class="cursor-pointer block lg:hidden text-700 p-ripple"
					v-styleclass="{
						selector: '@next',
						enterClass: 'hidden',
						enterActiveClass: 'fadein',
						leaveToClass: 'hidden',
						leaveActiveClass: 'fadeout',
						hideOnOutsideClick: true
					}"
				>
					<i class="pi pi-ellipsis-v text-2xl"></i>
				</a>
				<ul class="list-none p-0 m-0 hidden lg:flex lg:align-items-center select-none lg:flex-row surface-section border-1 lg:border-none surface-border right-0 top-100 z-1 shadow-2 lg:shadow-none absolute lg:static">
					<li>
						<router-link 
							:to="{ name: routeNames.userProfile }"
							v-ripple 
							class="flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-duration-150 transition-colors p-ripple"
						>
							<i class="pi pi-user text-base lg:text-2xl mr-2 lg:mr-0"></i>
							<span class="block lg:hidden font-medium">Profile</span>
						</router-link>
					</li>
					<li>
						<a @click="logOut" v-ripple class="flex p-3 lg:px-3 lg:py-2 align-items-center text-600 hover:text-900 hover:surface-100 font-medium border-round cursor-pointer transition-duration-150 transition-colors p-ripple">
							<i class="pi pi-sign-out text-base lg:text-2xl mr-2 lg:mr-0"></i>
							<span class="block lg:hidden font-medium">Sign Out</span>
						</a>
					</li>
				</ul>
			</div>
			
			<div class="p-5 flex flex-column flex-auto">
				<div class="flex-auto">
					<router-view></router-view>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { routeNames } from '@/router/route-names';
import { useUserStore } from '@/stores/user';

export default defineComponent({
	name: 'Dashboard',
	setup() {
		const userStore = useUserStore();
		const logOut = () => {
			userStore.logout();
		};

		return {
			routeNames,
			userStore,
			logOut,
		};
	},
});
</script>
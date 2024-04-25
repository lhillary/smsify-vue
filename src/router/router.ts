import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import Unauthorized from '@/views/user/Unauthorized.vue';
import Register from '@/views/user/Register.vue';
import CampaignOverview from '@/views/campaign/CampaignOverview.vue';
import CampaignCreate from '@/views/campaign/CampaignCreate.vue';
import CampaignDetails from '@/views/campaign/CampaignDetails.vue';
import CampaignMessage from '@/views/campaign/CampaignMessage.vue';
import CampaignResponses from '@/views/campaign/CampaignResponses.vue';
import CampaignResults from '@/views/campaign/CampaignResults.vue';
import PhoneNumberDetails from '@/views/phoneNumber/PhoneNumberDetails.vue';
import Landing from '@/views/Landing.vue';
import UserProfile from '@/views/user/Profile.vue';
import { authGuard } from '@/router/guards';
import { routeNames } from '@/router/route-names';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: routeNames.dashboard,
		component: Dashboard,
		meta: { requiresAuth: true },
		children: [
			{
				path: '/',
				name: routeNames.landing,
				component: Landing,
				meta: { requiresAuth: true },
			},
			{
				path: '/campaigns',
				name: routeNames.campaigns,
				component: CampaignOverview,
				meta: { requiresAuth: true },
			},
			{
				path: '/campaigns/create',
				name: routeNames.createCampaign,
				component: CampaignCreate,
				meta: { requiresAuth: true },
			},
			{
				path: '/campaigns/:campaignId',
				name: routeNames.campaignDetails,
				component: CampaignDetails,
				meta: { requiresAuth: true },
			},
			{
				path: '/campaigns/:campaignId/message',
				name: routeNames.campaignMessage,
				component: CampaignMessage,
				meta: { requiresAuth: true },
			},
			{
				path: '/campaigns/:campaignId/responses',
				name: routeNames.campaignResponses,
				component: CampaignResponses,
				meta: { requiresAuth: true },
			},
			{
				path: '/campaigns/:campaignId/results',
				name: routeNames.campaignResults,
				component: CampaignResults,
				meta: { requiresAuth: true },
			},
			{
				path: '/phone-numbers',
				name: routeNames.phoneNumberDetails,
				component: PhoneNumberDetails,
				meta: { requiresAuth: true },
			},
			{
				path: '/user',
				name: routeNames.userProfile,
				component: UserProfile,
				meta: { requiresAuth: true },
			},
		],
	},
	{
		path: '/unauthorized',
		name: routeNames.unauthorized,
		component: Unauthorized,
	},
	{
		path: '/register',
		name: routeNames.register,
		component: Register,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach(authGuard);

export default router;

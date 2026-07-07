import axios from 'axios';
import router from '@/router/router';
import { routeNames } from '@/router/route-names';

/**
 * The spend endpoints (number search, purchase, release, sendBulk) return
 * 403 with { message: "Connect your Twilio account to use SMS features" }
 * for users who haven't linked a Twilio account. The generated API client
 * and our direct calls both go through the default axios instance, so one
 * response interceptor gives us the nudge-to-connect UX everywhere.
 */
export function setupHttpInterceptors(): void {
	axios.interceptors.response.use(
		(response) => response,
		(error) => {
			const status = error?.response?.status;
			const message: string = error?.response?.data?.message ?? '';

			if (status === 403 && message.toLowerCase().includes('connect your twilio account')) {
				const currentRoute = router.currentRoute.value;
				if (currentRoute.name !== routeNames.settings) {
					router.push({ name: routeNames.settings, query: { reason: 'connect-required' } });
				}
			}

			return Promise.reject(error);
		}
	);
}

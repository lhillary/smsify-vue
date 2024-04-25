import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useUserStore } from '../stores/user'; 
import { routeNames } from './route-names';

/**
 * This guard checks if the user is authenticated and redirects to appropriate routes based on the route meta.
 */
export function authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
	const userStore = useUserStore();
	const isAuthenticated = !!userStore.token;

	if (to.meta.requiresAuth && !isAuthenticated) {
		next({ name: routeNames.unauthorized }); 
	} else if (to.path === '/login' && isAuthenticated) {
		next({ name: 'Dashboard' }); 
	} else {
		next(); 
	}
}
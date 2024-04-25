import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { getUsersApi, updateAccessToken } from '../utils/httpConfig';
import { ApiV1UserLoginPost200ResponseUser, ApiV1UserUpdatePutRequest, type ApiV1UserLoginPost200Response, type ApiV1UserRegisterPost201Response } from '@/api-client';

const usersApi = getUsersApi();

export const useUserStore = defineStore('user', {
	state: () => {
		const storedUser = localStorage.getItem('user');
		return {
			user: storedUser ? JSON.parse(storedUser) as ApiV1UserLoginPost200ResponseUser : undefined,
			token: Cookies.get('token') || undefined,
		};
	},
	getters: {
		isLoggedIn: (state) => !!state.token,
	},
	actions: {
		login(email: string, password: string): Promise<ApiV1UserLoginPost200Response> {
			return new Promise((resolve, reject) => {
				usersApi.apiV1UserLoginPost({ email, password })
					.then((response) => {
						const { token, user } = response.data;
						if (token) {
							updateAccessToken(token);
							this.token = token;
							this.user = user;
							localStorage.setItem('user', JSON.stringify(user));
						}
						resolve(response.data);
					})
					.catch((error) => {
						console.error('Login failed:', error);
						reject(error);
					});
			});
		},
		register(email: string, username: string, password: string): Promise<ApiV1UserRegisterPost201Response> {
			return new Promise((resolve, reject) => {
				usersApi.apiV1UserRegisterPost({ email, username, password })
					.then((response) => {
						const { token } = response.data;
						if (token) {
							updateAccessToken(token);
						}
						resolve(response.data);
					})
					.catch((error) => {
						console.error(error);
						reject(error);
					});
			});	
		},
		update(params: ApiV1UserUpdatePutRequest): Promise<void> {
			return new Promise((resolve, reject) => {
				usersApi.apiV1UserUpdatePut(params)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => {
						console.error(error);
						reject(error);
					});
			});
		},
		logout() {
			this.token = undefined;
			this.user = undefined;
			Cookies.remove('token');
			localStorage.removeItem('user');
			updateAccessToken('');
			window.location.href = '/unauthorized';
		},
	},
});

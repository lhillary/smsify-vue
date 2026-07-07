import { BASE_API_URL } from '@/constants/external-urls';
import Cookies from 'js-cookie';
import axios, { AxiosResponse } from 'axios';
import { 
	Configuration, 
	UsersApi, 
	CampaignManagementApi, 
	PhoneNumberManagementApi, 
	ContactManagementApi,
	CategoryManagementApi,
	SMSApi,
} from '@/api-client';

// Function to create a new API configuration
function createApiConfiguration() {
	return new Configuration({
		basePath: BASE_API_URL,
		accessToken: () => Cookies.get('token') || '',
	});
}

// Exports functions that return new instances of the APIs using the latest configuration
export const getUsersApi = () => new UsersApi(createApiConfiguration());
export const getCampaignsApi = () => new CampaignManagementApi(createApiConfiguration());
export const getPhoneNumbersApi = () => new PhoneNumberManagementApi(createApiConfiguration());
export const getContactsApi = () => new ContactManagementApi(createApiConfiguration());
export const getCategoriesApi = () => new CategoryManagementApi(createApiConfiguration());
export const getSMSApi = () => new SMSApi(createApiConfiguration());

// Function to update the access token in cookies and refresh configurations
export const updateAccessToken = (token: string): void => {
	Cookies.set('token', token, { expires: 1 });
};

// Twilio Connect endpoints. These are not part of the generated client yet,
// so they are called directly with the same base URL and bearer token.
const authHeaders = () => ({ Authorization: `Bearer ${Cookies.get('token') || ''}` });

export const postTwilioConnect = (accountSid: string): Promise<AxiosResponse> =>
	axios.post(`${BASE_API_URL}/api/v1/twilio-connect`, { accountSid }, { headers: authHeaders() });

export const deleteTwilioConnect = (): Promise<AxiosResponse> =>
	axios.delete(`${BASE_API_URL}/api/v1/twilio-connect`, { headers: authHeaders() });
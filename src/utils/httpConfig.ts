import { BASE_API_URL } from '@/constants/external-urls';
import Cookies from 'js-cookie';
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
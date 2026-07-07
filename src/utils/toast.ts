import { isAxiosError } from 'axios';
import ToastEventBus from 'primevue/toasteventbus';

/**
 * Pulls a human-readable message out of an API error. The backend returns
 * { message: string } bodies on failures; fall back to a generic message
 * for network failures or unexpected shapes.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
	if (isAxiosError(error)) {
		if (!error.response) {
			return 'Unable to reach the server. Check your connection and try again.';
		}
		const message = error.response.data?.message;
		if (typeof message === 'string' && message.length > 0) {
			return message;
		}
	}
	return fallback;
}

/**
 * Emits toasts on PrimeVue's toast event bus so they can be raised from
 * anywhere (stores, utils, component code) without needing useToast()'s
 * component injection context. Rendered by the global <Toast /> in App.vue.
 */
export function showErrorToast(summary: string, error?: unknown): void {
	ToastEventBus.emit('add', {
		severity: 'error',
		summary,
		detail: error !== undefined ? getApiErrorMessage(error) : undefined,
		life: 6000,
	});
}

export function showSuccessToast(summary: string, detail?: string): void {
	ToastEventBus.emit('add', {
		severity: 'success',
		summary,
		detail,
		life: 4000,
	});
}

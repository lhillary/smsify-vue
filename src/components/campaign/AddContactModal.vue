<template>
	<form class="flex flex-column gap-3 mt-3 mb-3">
		<div class="flex gap-3">
			<div class="w-full">
				<label for="name" class="block mb-1 text-color text-base">Contact Name</label>
				<span class="p-input-icon-left w-full">
					<InputText name="name" type="text" v-model="contactName" class="w-full" id="name" placeholder="John Doe" required />
				</span>
			</div>
			<div class="w-full">
				<label for="phone" class="block mb-1 text-color text-base">Phone Number</label>
				<span class="p-input-icon-left w-full">
					<InputMask id="phone" v-model="contactPhoneNumber" mask="(999) 999-9999" class="w-full" placeholder="(999) 999-9999" required />
				</span>
			</div>
			<div class="w-half flex align-items-end justify-content-center">
				<Button @click="$event => addContact(contactInfo)" icon="pi pi-plus" :disabled="!contactInfo.name.value && !contactInfo.phoneNumber.value" text rounded />
			</div>
		</div>
	</form>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed } from 'vue';

export default defineComponent({
	name: 'AddContactModal',
	setup() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dialogRef: any = inject('dialogRef');
		const contactName = ref('');
		const contactPhoneNumber = ref('');
		const contactInfo = computed(() => {
			return {
				name: contactName,
				phoneNumber: contactPhoneNumber,
			};
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const addContact = (contactInfo: any) => {
			console.log(contactInfo);
			dialogRef.value.close(contactInfo);
		};

		return {
			contactName,
			contactPhoneNumber,
			addContact,
			contactInfo,
		};
	},
});
</script>
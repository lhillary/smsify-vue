<template>
	<p v-if="editMode" class="m-0 mb-4 pt-3 text-600 line-height-3 mr-3">Specify a different set of one or more words that you would like to sue to categorize your campaign responses.</p>
	<p v-else class="m-0 mb-4 pt-3 text-600 line-height-3 mr-3">Specify one or more words that you would like to use to categorize your campaign responses. For instance, if you want a "No" category, you might add a comma delimited "No, Nah, Never".</p>
	<form class="flex flex-column gap-3 mt-3 mb-3">
		<div class="flex gap-3">
			<div class="w-full">
				<label for="name" class="block mb-1 text-color text-base">Response Category</label>
				<span class="p-input-icon-left w-full">
					<InputText name="name" type="text" v-model="categoryName" class="w-full" id="name" placeholder="John Doe" required />
				</span>
			</div>
			<div class="w-half flex align-items-end justify-content-center">
				<Button @click="$event => addCategory(categoryInfo)" icon="pi pi-plus" :disabled="!categoryInfo.categoryLabels.value" text rounded />
			</div>
		</div>
	</form>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed } from 'vue';

export default defineComponent({
	name: 'AddCategoryModal',
	setup() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dialogRef: any = inject('dialogRef');
		const editMode = dialogRef.value.data.editMode;
		const categoryName = ref('');
		const contactPhoneNumber = ref('');
		const categoryInfo = computed(() => {
			return {
				categoryLabels: categoryName,
			};
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const addCategory = (categoryInfo: any) => {
			dialogRef.value.close(categoryInfo);
		};

		return {
			editMode,
			categoryName,
			contactPhoneNumber,
			addCategory,
			categoryInfo,
		};
	},
});
</script>
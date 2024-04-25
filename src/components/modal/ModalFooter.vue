<template>
	<div class="flex gap-3 justify-content-end border-top-1 surface-border col-12">
		<Button @click="$event => closeDialog()" label="Cancel" class="p-button-text"></Button>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
	name: 'ModalFooter',
	setup() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dialogRef: any = inject('dialogRef');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const closeDialog = () => {
			dialogRef.value.close();
		};
		return {
			closeDialog,
		};
	},
});
</script>
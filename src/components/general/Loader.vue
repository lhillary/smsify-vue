<template>
	<div class=" loader surface-overlay flex align-items-center justify-content-center absolute">
		<ProgressSpinner />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Spinner',
});
</script>

<style lang="scss">

	.loader {
		width: 100%;
		height: 100vh;
		z-index: 9999;
	}

</style>
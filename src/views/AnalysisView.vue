<template>This is the analysis component</template>

<script setup>
import { onMounted } from 'vue';
import { useUserDetailsStore } from '@/stores/userDetails';

const userDetails = useUserDetailsStore();

onMounted(() => {
	userDetails.preventUnauthorizedRouteNavigation();
});
</script>

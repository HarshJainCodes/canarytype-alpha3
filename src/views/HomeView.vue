<template>
	<div class="w-100 h-100">
		<keep-alive>
			<component
				:is="currComponent"
				class="w-100 h-100"
				v-model:typingFinished="typingFinished"
				v-model:lineChartData="lineChartData"
				v-model:rawLineChartData="rawLineChartData"
				v-model:typingSpeed="typingSpeed"
			></component>
		</keep-alive>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import TypingArea from '../components/TypingArea.vue';
import TypingResultContainer from '../components/TypingResultContainer.vue';
import { computed } from 'vue';

const typingFinished = ref(false);
const lineChartData = ref([]);
const rawLineChartData = ref([]);
const typingSpeed = ref(0);

const currComponent = computed(() => {
	return typingFinished.value ? TypingResultContainer : TypingArea;
});
</script>

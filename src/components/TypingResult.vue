<template>
	<Line :data="data"> </Line>
</template>

<script setup>
import { computed } from 'vue';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
);

const props = defineProps(['lineChartData', 'rawLineChartData']);

const data = computed(() => {
	return {
		labels: props.lineChartData.map((ele, index) => index + 1),
		datasets: [
			{
				label: 'Raw Typing Speed Per Second',
				data: props.rawLineChartData,
				tension: 0.3,
				borderColor: 'grey',
				pointRadius: 5,
				fill: {
					target: 'origin',
					below: 'grey',
				},
			},
			{
				label: 'Correct Typing Speed per Second',
				data: props.lineChartData,
				tension: 0.3,
				borderColor: 'rgb(9, 217, 57)',
				pointRadius: 5,
				fill: {
					target: 'origin',
					below: 'rgb(255, 0, 0)',
				},
			},
		],
	};
});
</script>

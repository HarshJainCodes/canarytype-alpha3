<template>
	<div class="w-100 h-100">
		<v-card class="w-100 h-100 elevation-4">
			<v-list class="w-100 h-100 pa-3" style="scrollbar-width: thin">
				<v-list-group v-for="(date, index) in userSubmissionsByDate" :key="index">
					<template #activator="{ props }">
						<v-list-item v-bind="props" class="elevation-2">
							{{ date[0].submissionDate.split('T')[0] }}
						</v-list-item>
					</template>

					<v-virtual-scroll
						:items="date"
						:height="date.length <= 4 ? date.length * 60 : 240"
						style="scrollbar-width: thin"
					>
						<template #default="{ item }">
							<v-list-item class="ma-1" @click="() => setCurrSubmission(item)">
								<div class="text-center">
									{{ item.submissionDate.split('T')[1].split('.')[0] }}
								</div>
							</v-list-item>
						</template>
					</v-virtual-scroll>
				</v-list-group>
			</v-list>
		</v-card>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	emits: ['select-user-submission'],
	props: {
		userSubmissionsByDate: {
			required: true,
			type: Array,
		},
	},
	setup(props, { emit }) {
		const setCurrSubmission = (submission) => {
			emit('select-user-submission', submission);
		};

		return {
			setCurrSubmission,
		};
	},
});
</script>

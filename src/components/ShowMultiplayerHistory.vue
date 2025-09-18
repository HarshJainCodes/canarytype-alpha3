<template>
	<div class="w-100 h-100">
		<v-card class="w-100 h-100 elevation-4">
			<v-list class="w-100 h-100 pa-3" style="scrollbar-width: thin">
				<v-list-group v-for="(onlineMatch, index) in userOnlineMatchesByDate" :key="index">
					<template #activator="{ props }">
						<v-list-item v-bind="props" class="elevation-2">
							{{ onlineMatch[0].matchDate.split('T')[0] }}
						</v-list-item>
					</template>
					<v-virtual-scroll
						:items="onlineMatch"
						:height="onlineMatch.length <= 4 ? onlineMatch.length * 70 : 280"
						style="scrollbar-width: thin"
					>
						<template #default="{ item: submission }">
							<v-list-item class="ma-1" @click="() => selectOnlineMatch(submission)">
								{{ submission.player1Name }} vs {{ submission.player2Name }}
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
	emits: ['select-online-match'],
	props: {
		userOnlineMatchesByDate: {
			required: true,
			type: Array,
		},
	},
	setup(props, { emit }) {
		const selectOnlineMatch = (match) => {
			emit('select-online-match', match);
		};

		return {
			selectOnlineMatch,
		};
	},
});
</script>

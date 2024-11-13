<template>
    <div class="w-100 h-100 d-flex flex-column">
        <div class="d-flex w-100 h-100">
            <div class="w-100 d-flex flex-column">
                {{ totalSubmissionsCount }} Submissions in last 1 year
                <div class="d-flex w-100 h-100 flex-row">
                    <div class="w-100 h-100" v-for="x in 53" :key="x">
                        <div class="d-flex w-100 h-100 flex-column">
                            <div class="w-100 h-100" style="padding: 1px;" v-for="y in 7" :key="y">
                                <v-tooltip :text="getTooltipText(y - 1, x - 1)">
                                    <template #activator="{ props }">
                                        <div v-bind="props" class="w-100 h-100 graph_cell" :class="{ 'hide_before_jan': hideBeforeJanAfterDec(y - 1, x - 1), 'one_contribution' : highlight5Jan(y - 1, x - 1) }">
                                        </div>
                                    </template>
                                </v-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-100 d-flex justify-space-between">
                    <div v-for="month in months" :key="month">
                        {{ month }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
    props:{
        datesContributed: {
            required: true,
            type: Array
        }
    },
    setup(props) {
        const offset = new Date(2024, 0, 1).getDay();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        const daysInMonths = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
        const totalSubmissionsCount = computed(() => {
            var count = 0;
            for (const date in props.datesContributed){
                count += props.datesContributed[date]
            }

            return count;
        })

        const index = computed(() => {
            const indexArr = []
            
            for (const date in props.datesContributed){
                console.log(`Date ${date}, Count ${props.datesContributed[date]}`)
                const splitDate = date.split("-")
                indexArr.push(daysInMonths[Number(splitDate[1]) - 1] + Number(splitDate[2] - 1 + offset))
            }

            return indexArr
        })

        const getTooltipText = (row, col) => {
            const index = row + col * 7;

            var month;
            var date;
            var submissionCount;
            for (var i = 1; i <= 12; i++){
                if (index - daysInMonths[i] + 1 - offset <= 0){
                    month = months[i - 1]
                    date = index - daysInMonths[i - 1] + 1 - offset
                    const formattedDate = `2024-${i.toString().length === 1 ? `0${i}` : `${i}`}-${date.toString().length === 1 ? `0${date}` : `${date}`}`
                    submissionCount = props.datesContributed[formattedDate] || 0
                    break;
                }
            }

            return `${submissionCount} submissions on ${date} ${month}, 2024`
        }

        const hideBeforeJanAfterDec = (row, col) => {
            if ((col === 0 && row < offset) || (col == 52 && row >= 53 * 7 - 366 - offset - 1)){
                return true
            }return false
        }

        const highlight5Jan = (row, col) => {
            const res =  index.value.some((idx) => (row === idx % 7) && (col === Math.floor((idx)/7)))
            return res;
        }

        return {
            months,
            totalSubmissionsCount,
            getTooltipText,
            hideBeforeJanAfterDec,
            highlight5Jan,
        }
    },
})
</script>

<style>
.graph_cell{
border: 1px solid black;
border-radius: 3px;
}

.hide_before_jan{
    display: none;
}

.one_contribution{
    background-color: lightgreen;
}
</style>
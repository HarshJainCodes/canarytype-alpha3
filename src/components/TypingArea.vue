<template>
    <div class="w-100 h-100 position-relative">
        <v-overlay
            id="overlay-before-match-start"
            width="100%"
            height="100%"
            :model-value="props.mode === 'multiplayer' && multiplayerCountdownTime > 0"
            contained
            persistent
        >
            <div class="text-h5 d-flex justify-center align-center h-50">
                Match Starts in {{ multiplayerCountdownTime }}
            </div>
        </v-overlay>
        <v-card class="w-100 h-100 d-flex flex-column pa-5">
            <v-spacer></v-spacer>
            <v-card-title>
                <div class="pt-10">{{ time }}</div>
            </v-card-title>

            <v-skeleton-loader data-qa-id="typingarea-skeleton-loader" type="paragraph" class="h-25" v-if="stringToType === undefined">
            </v-skeleton-loader>
            <v-card-text class="d-flex flex-column">
                <div class="text-to-type text-h4">
                    <div class="text-to-type-1 text-disabled" data-qa-id="stringToType">
                        {{ stringToType }}
                    </div>

                    <div class="resultDisplay"></div>

                    <textarea
                        data-qa-id="typing-textarea"
                        style="font-family: myRobotoFont; resize: none"
                        class="text-h4 text-transparent"
                        name="typingArea"
                        spellcheck="false"
                        v-on:keydown="startTimer"
                    ></textarea>
                </div>
            </v-card-text>
            <v-spacer></v-spacer>
        </v-card>
    </div>
</template>

<script setup>
import { onDeactivated } from 'vue'
import { onActivated } from 'vue'
import { ref, onMounted, defineEmits } from 'vue'
import { useRandomWords } from '@/Queries/ArenaQueries'
import { useQueryClient } from '@tanstack/vue-query'

const INITIAL_TIME = 20

const typingStarted = ref(false)
const time = ref(INITIAL_TIME)
let timer

const multiplayerCountdownTime = ref(5)
let multiplayerCountdownTimer

const props = defineProps({
    mode: String
})

const emit = defineEmits([
    'update:typingFinished',
    'update:lineChartData',
    'update:rawLineChartData',
    'update:typingSpeed'
])

const wordsTypedPerSecond = new Array(time.value).fill('')
const rawWordsTypedPerSecond = new Array(time.value).fill('')
const typingSpeedPerSecond = new Array(time.value).fill(0)
const rawTypingSpeedPerSecond = new Array(time.value).fill(0)

const randomWords = useRandomWords()
const queryClient = useQueryClient()

const stringToType = randomWords.data

onActivated(() => {
    if (typingStarted.value === true) {
        queryClient.invalidateQueries({ queryKey: ['randomWords'] })
        resetParams()
    }
})

onMounted(() => {
    if (props.mode === 'multiplayer') {
        multiplayerCountdownTimer = setInterval(() => {
            multiplayerCountdownTime.value--
            if (multiplayerCountdownTime.value <= 0) {
                document.querySelector('textarea').focus()
                clearInterval(multiplayerCountdownTimer)
                startTimer()
            }
        }, 1000)
    }
})

onDeactivated(() => {
    clearInterval(timer)
})

const resetParams = () => {
    stringToType.value = ''
    time.value = INITIAL_TIME
    typingStarted.value = false
    document.querySelector('textarea').value = ''
    document.querySelector('.resultDisplay').innerHTML = ''
    wordsTypedPerSecond.fill('')
    rawWordsTypedPerSecond.fill('')
}

const startTimer = (event) => {
    if (!typingStarted.value) {
        typingStarted.value = true

        timer = setInterval(() => {
            if (time.value > 1) {
                time.value--
            } else {
                emit('update:typingFinished', true)
                calculateTypingSpeed()
                calculateTypingSpeedPerSecond()
                clearInterval(timer)
            }
        }, 1000)
    }
    addSpanAroundText()
    if (event) {
        addWordsToTimestamp(event.key)
    }
}

// todo optimise this text
const addSpanAroundText = () => {
    setTimeout(() => {
        const enteredText = document.querySelector('textarea').value

        const resultDisplayEle = document.querySelector('.resultDisplay')
        resultDisplayEle.innerHTML = ''

        for (let i = 0; i < enteredText.length; i++) {
            if (enteredText[i] === stringToType.value[i]) {
                resultDisplayEle.innerHTML += `<span style="color: #00BFA5;">${enteredText[i]}</span>`
            } else {
                resultDisplayEle.innerHTML += `<span style="color: #EF5350;">${stringToType.value[i]}</span>`
            }
        }
    }, 10)
}

const addWordsToTimestamp = (key) => {
    const index = wordsTypedPerSecond.length - time.value

    if (key === 'Backspace') {
        if (wordsTypedPerSecond[index].length > 0) {
            wordsTypedPerSecond[index] = wordsTypedPerSecond[index].slice(0, -1)
        } else {
            // else block is required to make sure if you remove words then you remove it from correct index when it was typed
            let indexToRemove = index - 1

            while (wordsTypedPerSecond[indexToRemove].length === 0 && indexToRemove > 0) {
                indexToRemove--
            }
            if (wordsTypedPerSecond[indexToRemove].length > 0) {
                wordsTypedPerSecond[indexToRemove] = wordsTypedPerSecond[indexToRemove].slice(0, -1)
            }
        }
    } else {
        if (key != undefined) {
            rawWordsTypedPerSecond[index] += key
            wordsTypedPerSecond[index] += key
        }
    }
}

const calculateTypingSpeed = () => {
    const wordsTyped = document.querySelector('textarea').value.split(' ')
    const availableWords = stringToType.value.split(' ')

    let charsInTotalCorrectWords = 0

    for (const word of wordsTyped) {
        for (const word2 of availableWords) {
            if (word === word2) {
                charsInTotalCorrectWords += word.length
                break
            }
        }
    }

    const typingSpeed = Math.round((charsInTotalCorrectWords / 5) * (60 / INITIAL_TIME))
    emit('update:typingSpeed', typingSpeed)
}

const calculateTypingSpeedPerSecond = () => {
    let currWordIndex = 0
    let correctCharTillNow = 0
    let rawCharTillNow = 0
    for (let i = 0; i < wordsTypedPerSecond.length; i++) {
        for (let j = 0; j < wordsTypedPerSecond[i].length; j++) {
            if (
                wordsTypedPerSecond[i][j] !== ' ' &&
                wordsTypedPerSecond[i][j] == stringToType.value[currWordIndex]
            ) {
                correctCharTillNow++
            }
            currWordIndex++
        }

        for (let j = 0; j < rawWordsTypedPerSecond[i].length; j++) {
            if (rawWordsTypedPerSecond[i][j] !== ' ') {
                rawCharTillNow++
            }
        }

        typingSpeedPerSecond[i] = (correctCharTillNow / 5) * (60 / (i + 1))
        rawTypingSpeedPerSecond[i] = (rawCharTillNow / 5) * (60 / (i + 1))
    }
    emit('update:lineChartData', typingSpeedPerSecond)
    emit('update:rawLineChartData', rawTypingSpeedPerSecond)
}
</script>

<style scoped>
@font-face {
    font-family: myRobotoFont;
    src: url('../assets/fonts/RobotoMono-Regular.ttf');
}

.text-to-type {
    display: grid;
    color: rgb(0, 92, 84);
}

.text-to-type-1 {
    grid-column: 1;
    grid-row: 1;

    font-family: myRobotoFont;

    /* so that the user cannot select the text and copy paste :) */
    user-select: none;
}

textarea {
    grid-column: 1;
    grid-row: 1;

    caret-color: #00bfa5;

    font-family: 'Times New Roman', Times, serif;
    white-space: normal;
    text-align: left;

    z-index: 5;
}

textarea:focus-visible {
    outline: none;
}

.resultDisplay {
    grid-column: 1;
    grid-row: 1;

    user-select: none;
    font-family: myRobotoFont;
}
</style>

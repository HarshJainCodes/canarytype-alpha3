<template>
  <div class="h-100">
    <v-card class="h-100 d-flex flex-column pa-5">
      <v-card-title>
        <div class="pt-10">{{ time }}</div>
      </v-card-title>

      <v-card-text class="d-flex flex-column">
        <div class="text-to-type text-h5">
          <div class="text-to-type-1 text-disabled">
            {{ stringToType }}
          </div>

          <div class="resultDisplay"></div>

          <textarea
            style="font-family: myRobotoFont; resize: none"
            class="text-h5 text-transparent"
            name="typingArea"
            spellcheck="false"
            v-on:keydown="startTimer"
          ></textarea>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const typingStarted = ref(false)
const typingFinished = ref(false)
const time = ref(10)

const stringToType = ref(
  'This is the text to type that we will get from the backend This is the text to type that'
)

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

const startTimer = () => {
  if (!typingStarted.value) {
    typingStarted.value = true

    const timer = setInterval(() => {
      if (time.value > 0) {
        time.value--
      } else {
        typingFinished.value = true
        clearInterval(timer)
      }
    }, 1000)
  }
  addSpanAroundText()
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

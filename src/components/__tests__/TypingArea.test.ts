import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { vuetify } from "./TEST_CONSTANTS";

import TypingArea from "../TypingArea.vue";
import { nextTick } from "vue";
// import { useRandomWords } from "@/Queries/ArenaQueries";

const queryClient = new QueryClient()

let RandomWordsMockedData = undefined

vi.mock('@/Queries/ArenaQueries', () => ({
    useRandomWords: vi.fn(() => ({
        data: RandomWordsMockedData
    }))
}))

describe('tests for typing area', () => {

    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.clearAllTimers()
    })

    it('should render correctly', () => {
        const wrapper = mount(TypingArea, {
            props: {

            },
            global: {
                plugins: [vuetify, [VueQueryPlugin, { queryClient }]]
            }
        })

        expect(wrapper.find('[data-qa-id="typing-textarea"]').exists()).toBeTruthy()
    })

    it('should show skeleton loader if string to type is not fetched', () => {
        const wrapper = mount(TypingArea, {
            props: {

            },
            global: {
                plugins: [vuetify, [VueQueryPlugin, { queryClient }]]
            }
        })

        // shows skeleton loader if there is not words to type
        expect(wrapper.find('[data-qa-id="typingarea-skeleton-loader"]').exists()).toBeTruthy()

        // if we have words to type the skeleton loader should disappear
        RandomWordsMockedData = 'Some data to type'
        const wrapper1 = mount(TypingArea, {
            props: {

            },
            global: {
                plugins: [vuetify, [VueQueryPlugin, { queryClient }]]
            }
        })
        expect(wrapper1.find('[data-qa-id="typingarea-skeleton-loader"]').exists()).toBeFalsy()
    })

    it('should show multiplayer overlay and hide after countdown', async () => {
        const wrapper = mount(TypingArea, {
            props: {
                mode: 'multiplayer'
            },
            global: {
                plugins: [vuetify, [VueQueryPlugin, { queryClient }]]
            },
            attachTo: document.body
        })

        expect(wrapper.find('[id="overlay-before-match-start"]').exists()).toBeTruthy()

        expect(wrapper.text()).toContain('Match Starts in 5')

        await vi.advanceTimersByTime(1000);

        expect(wrapper.text()).toContain('Match Starts in 4')   
        
        // here 5 seconds become 0
        await vi.advanceTimersByTime(4000)
        
        // the timer starts after 5 sec countdown, so it should be 19 after 1 sec
        await vi.advanceTimersByTime(1000)
        expect(wrapper.vm.time).toBe(19)
    })
})
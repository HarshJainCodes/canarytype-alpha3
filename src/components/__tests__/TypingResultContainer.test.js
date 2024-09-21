import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import TypingResultContainer from '../TypingResultContainer.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useUserDetailsStore } from '@/stores/userDetails'
import { useToast } from 'vue-toastification'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives
})

vi.mock('@/stores/userDetails')
vi.mock('vue-toastification')

describe('TypingResultContainer.vue', () => {
    let userDetailsStore
    let toastMock

    beforeEach(() => {
        userDetailsStore = {
            isLoggedIn: false,
            userName: 'testUser',
            setIsLoggedIn: vi.fn()
        }
        toastMock = vi.fn()
        useUserDetailsStore.mockReturnValue(userDetailsStore)
        useToast.mockReturnValue(toastMock)
        setActivePinia(createPinia())
    })

    it('renders correctly', () => {
        const wrapper = mount(TypingResultContainer, {
            props: {
                lineChartData: [1, 2, 3],
                rawLineChartData: [1, 2, 3],
                typingSpeed: 100
            },
            global: {
                plugins: [vuetify]
            }
        })

        expect(wrapper.find('[data-qa-id="typing-result-container"]').exists()).toBe(true)
        expect(wrapper.text()).toContain('Average Typing Speed')
    })

    it('should show red login banner if user is not logged in and reverse', () => {
        userDetailsStore.isLoggedIn = false
        const wrapper = mount(TypingResultContainer, {
            props: {
                lineChartData: [1, 2, 3],
                rawLineChartData: [1, 2, 3],
                typingSpeed: 100
            },
            global: {
                plugins: [vuetify]
            }
        })

        expect(wrapper.find('[data-qa-id="not-login-banner"]').exists()).toBeTruthy()

        userDetailsStore.isLoggedIn = true
        const wrapper1 = mount(TypingResultContainer, {
            props: {
                lineChartData: [1, 2, 3],
                rawLineChartData: [1, 2, 3],
                typingSpeed: 100
            },
            global: {
                plugins: [vuetify]
            }
        })
        expect(wrapper1.find('[data-qa-id="not-login-banner"]').exists()).toBeFalsy()
    })

    it('should emit update:typingFinished when button is clicked', async () => {
        const wrapper = mount(TypingResultContainer, {
            props: {
                lineChartData: [1, 2, 3],
                rawLineChartData: [1, 2, 3],
                typingSpeed: 100
            },
            global: {
                plugins: [vuetify]
            }
        })

        await wrapper.find('[data-qa-id="type-again-button"]').trigger('click')
        expect(wrapper.emitted('update:typingFinished')).toBeTruthy()
        expect(wrapper.emitted('update:typingFinished')[0]).toEqual([false])
    })

    it('calls the api and sends data to backend when sendDataToBackend is triggered', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                status: 200
            })
        )

        const wrapper = mount(TypingResultContainer, {
            props: {
                lineChartData: [1, 2, 3],
                rawLineChartData: [1, 2, 3],
                typingSpeed: 100
            },
            global: {
                plugins: [vuetify]
            }
        })

        await wrapper.vm.sendDataToBackend()
        // await flushPromises()

        expect(global.fetch).toHaveBeenCalledWith(
            'https://canarytype-alpha3.azurewebsites.net/api/TypingArena/Submit',
            expect.objectContaining({
                method: 'POST',
                body: expect.any(String)
            })
        )

        expect(wrapper.vm.resultSentToDB).toBe(true)
        expect(toastMock).toHaveBeenCalledWith('Result Saved Successfully', { type: 'success' })

        global.fetch = vi.fn(() =>
            Promise.resolve({
                status: 401
            })
        )
        // handle the case when sendDataToBackend returns 401
        await wrapper.vm.sendDataToBackend()

        await flushPromises()

        expect(userDetailsStore.setIsLoggedIn).toHaveBeenCalledWith(false)
        expect(userDetailsStore.userName).toBe('')
    })
})

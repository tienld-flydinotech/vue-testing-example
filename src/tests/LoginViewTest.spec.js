import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth' // Adjust the path as necessary
import { createTestingPinia } from '@pinia/testing'

describe('LoginView', () => {
  let wrapper
  let authStore

  beforeEach(() => {
    global.fetch = vi.fn()
    wrapper = mount(LoginView, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn, // Use vitest's spy function
          stubActions: false // Set this to false if you want to test actual action logic
        })]
      }
    })

    authStore = useAuthStore() // Use the auth store in your tests
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Login')
  })

  it('does not render when already authenticated', async () => {
    authStore.isAuthenticated = true
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('already authenticated')
  })

  it('login success', async () => {
    authStore.isAuthenticated = false

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        accessToken: 'testAccessToken',
        refreshToken: 'testRefreshToken'
      })
    })

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const loginButton = wrapper.find('button')
    
    
    wrapper.find('button').trigger('submit');
    await emailInput.setValue('emilys')
    await passwordInput.setValue('emilyspass')

    expect(authStore.setTokens).toHaveBeenCalledWith('testAccessToken', 'testRefreshToken')
    expect(authStore.setAuthenticated).toHaveBeenCalledWith(true)
    // expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ name: 'home' })
  })

  it('login failed', async () => {
    authStore.isAuthenticated = false

    global.fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid credentials' })
    })

    const emailInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const loginButton = wrapper.find('button')

    await emailInput.setValue('wronguser')
    await passwordInput.setValue('wrongpass')
    loginButton.trigger('click')

    expect(wrapper.text()).toContain('Invalid credentials')
  })
})

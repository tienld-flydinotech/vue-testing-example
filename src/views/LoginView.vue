<template>
    <div v-if="!isAuthenticated">
        <form @submit.prevent="login">
            <input v-model="username" type="text" placeholder="Username" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
            <p v-if="errorMessage">{{ errorMessage }}</p>
        </form>
    </div>
    <div v-else>
        already authenticated
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
    data() {
        return {
            username: '',
            password: '',
            errorMessage: ''
        }
    },
    computed: {
        isAuthenticated() {
            const authStore = useAuthStore()
            return authStore.isAuthenticated
        }
    },
    methods: {
        async login() {
            try {
                const response = await fetch('https://dummyjson.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password,
                        expiresInMins: 30
                    }),
                    credentials: 'include'
                })

                const data = await response.json()
                
                if (response.ok) {
                    const authStore = useAuthStore()
                    authStore.setTokens(data.accessToken, data.refreshToken)
                    authStore.setAuthenticated(true)

                    // Redirect to home page after successful login
                    this.$router.push({ name: 'home' })
                } else {
                    throw new Error(data.message || 'Login failed')
                }
            } catch (error) {
                this.errorMessage = error.message
            }
        }
    }
}
</script>
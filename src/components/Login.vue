<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-lg w-full p-6 border rounded-lg shadow-md bg-white">
      <form @submit.prevent="handleSubmit">

        <InputText v-model="username" placeholder="Имя пользователя" required
          class="mt-1 mb-4 block w-full p-2 border rounded-md" />
        <InputText v-model="password" type="password" placeholder="Пароль" required
          class="mt-1 mb-4 block w-full p-2 border rounded-md" />

        <p v-if="error" class="red-text mb-4">{{ error }}</p>
        <Button type="submit" :disabled="loading" :loading="loading" severity="p-success" aria-label="Loading"
          class="w-full" raised>
          {{ loading ? '' : 'Войти' }}
          <ProgressSpinner v-if="loading" class="spinner" />
        </Button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';

const API_URL = import.meta.env.VITE_API_URL;

const username = ref('');
const password = ref('');
const error = ref<string | null>(null);
const loading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.post(`${API_URL}/api/login`, { username: username.value, password: password.value });
    localStorage.setItem('jwt', response.data.token);
    router.push('/search');
  } catch (err) {
    error.value = 'Неверные имя или пароль';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.spinner {
  width: 25px;
  height: 25px;
}

.red-text {
  color: red;
}
</style>
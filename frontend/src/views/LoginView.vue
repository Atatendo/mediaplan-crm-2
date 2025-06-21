<template>
  <div class="login-container">
    <Card class="login-card">
        <template #title>
          Вход в систему
        </template>

        <template #content>
          <form @submit.prevent="login" class="login-form">
            <!-- Логин -->
            <div class="p-field">
              <label for="username">Логин</label>
              <InputText id="username" v-model="credentials.username" placeholder="Введите логин" required />
            </div>

            <!-- Пароль -->
            <div class="p-field">
              <label for="password">Пароль</label>
              <Password id="password" v-model="credentials.password" :feedback="false" placeholder="Введите пароль" required />
            </div>

            <!-- Сообщения об ошибках -->
            <Message v-if="error" severity="error">{{ error }}</Message>
            <div class="p-field-checkbox">
              <div class="checkbox-wrapper">
                <div class="flex items-center gap-2">
                  <Checkbox inputId="rememberMe" value="rememberMe" />
                  <label class="font-medium" for="rememberMe">Запомнить меня</label>
                </div>
                <a href="#" class="forgot-password">Забыли пароль?</a>
              </div>
            </div>
            <!-- Кнопка -->
            <Button type="submit" label="Войти" icon="pi pi-sign-in" class="mt-3" />
          </form>
        </template>
    </Card>
  </div>
</template>

<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const credentials = ref({
  username: '',
  password: ''
})

const rememberMe = ref(false)
const error = ref(null)

const login = () => {
  // Имитация запроса к API
  if (credentials.value.username === 'admin' && credentials.value.password === '123456') {
    localStorage.setItem('token', 'example-token')
    router.push('/')
  } else {
    error.value = 'Неверный логин или пароль'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.login-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  gap: 1.5rem;
  padding: 25px;
}

.p-field {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.p-field label {
  font-weight: 500; /* или bold */
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

:deep(.p-field .p-inputtext),
:deep(.p-field .p-password-input) {
  width: 100%;
}

.checkbox-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.remember-me {
  display: flex;
  align-items: center;
  font-weight: 500;
  gap: 0.5rem;
}

.forgot-password {
  color: var(--p-primary-color); 
  font-weight: 500;
  text-decoration: none;
}
.forgot-password:hover {
  color: var(--p-primary-hover-color); 
  font-weight: 500;
  text-decoration: none;
}

</style>
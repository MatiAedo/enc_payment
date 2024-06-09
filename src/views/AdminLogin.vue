<template>
  <div class="login-container">
    <h1>Login de Administrador</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Nombre de Usuario:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p>¿No tienes una cuenta? <button @click="goToRegister">Regístrate aquí</button></p>
  </div>
</template>

<script>
export default {
  name: 'AdminLogin',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    login() {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(
        user => user.username === this.username && user.password === this.password && user.role === 'admin'
      );

      if (user) {
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('userRole', 'admin');
        this.$router.push({ name: 'AdminDashboard' });
      } else {
        alert('Credenciales inválidas o no eres administrador');
      }
    },
    goToRegister() {
      this.$router.push({ name: 'Register', query: { role: 'admin' } });
    }
  }
};
</script>

<style scoped>
/* Estilos de tu elección */
</style>

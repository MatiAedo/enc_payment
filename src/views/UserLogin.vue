<template>
    <div class="login-container">
      <h1>Login de Usuario</h1>
      <form @submit.prevent="login">
        <div>
          <label for="username">Usuario:</label>
          <input type="text" v-model="username" id="username" required />
        </div>
        <div>
          <label for="password">Contraseña:</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserLogin',
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      login() {
        // Simula autenticación exitosa
        const isAuthenticated = this.username === 'user' && this.password === 'user'; // Simular autenticación básica
        if (isAuthenticated) {
          localStorage.setItem('isAuthenticated', true);
          localStorage.setItem('userRole', 'user');
          this.$router.push({ name: 'UserDashboard' });
        } else {
          alert('Credenciales inválidas');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos de tu elección */
  </style>
  
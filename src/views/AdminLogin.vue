<template>
  <div class="login-container">
    <h1>Inicia sesión como Profesional</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="username">Nombre de Usuario:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit" class="login-button">Login</button>
    </form>
    <p>¿No tienes una cuenta? <button class="register-link" @click="goToRegister">Regístrate aquí</button></p>
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
        console.log('Admin login successful:', user);
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('currentUser', JSON.stringify(user));
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
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.login-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.login-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-button:hover {
  background-color: #45a049;
}

.register-link {
  background: none;
  border: none;
  color: #007BFF;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin: 10px 0 0;
}

.register-link:hover {
  color: #0056b3;
}
</style>
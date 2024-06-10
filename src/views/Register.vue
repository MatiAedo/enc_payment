<template>
  <div class="register-container">
    <h1>Registro como {{ roleText }}</h1>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="firstName">Nombre:</label>
        <input type="text" v-model="firstName" id="firstName" required />
      </div>
      <div class="form-group">
        <label for="lastName">Apellido:</label>
        <input type="text" v-model="lastName" id="lastName" required />
      </div>
      <div class="form-group">
        <label for="email">Correo Electrónico:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="username">Nombre de Usuario:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmar Contraseña:</label>
        <input type="password" v-model="confirmPassword" id="confirmPassword" required />
      </div>
      <button type="submit" class="register-button">Registrarse</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegisterEnc',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: this.$route.query.role // Obtener el rol desde los parámetros de la ruta
    };
  },
  computed: {
    roleText() {
      return this.role === 'admin' ? 'Profesional' : 'Paciente';
    }
  },
  methods: {
    register() {
      if (this.password !== this.confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      let users = JSON.parse(localStorage.getItem('users')) || [];
      const newUser = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        username: this.username,
        password: this.password,
        role: this.role,
        wallet: 0 // Inicializar el wallet con 0 monedas
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registro exitoso');
      this.$router.push({ name: 'HomeEnc' });
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
}

.register-form {
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

.register-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.register-button:hover {
  background-color: #45a049;
}
</style>
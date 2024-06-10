<template>
  <div class="register-container">
    <h1>Registro como {{ roleText }}</h1>
    <form @submit.prevent="register">
      <div>
        <label for="firstName">Nombre:</label>
        <input type="text" v-model="firstName" id="firstName" required />
      </div>
      <div>
        <label for="lastName">Apellido:</label>
        <input type="text" v-model="lastName" id="lastName" required />
      </div>
      <div>
        <label for="email">Correo Electrónico:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div>
        <label for="username">Nombre de Usuario:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div>
        <label for="confirmPassword">Confirmar Contraseña:</label>
        <input type="password" v-model="confirmPassword" id="confirmPassword" required />
      </div>
      <button type="submit">Registrarse</button>
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
/* Estilos de tu elección */
</style>
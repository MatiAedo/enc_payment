<template>
    <div class="register-container">
      <h1>Registro de Usuarios</h1>
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
          <label for="email">Correo:</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <div>
          <label for="birthDate">Fecha de Nacimiento:</label>
          <input type="date" v-model="birthDate" id="birthDate" required />
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
        <div>
          <label for="role">Rol:</label>
          <select v-model="role" id="role" required>
            <option value="admin">Profesional</option>
            <option value="user">Paciente</option>
          </select>
        </div>
        <button type="submit">Registrar</button>
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
        birthDate: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: this.$route.query.role || 'user' // Preseleccionar el rol basado en la query de la ruta
      };
    },
    methods: {
      register() {
        if (this.password !== this.confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
  
        const newUser = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          birthDate: this.birthDate,
          username: this.username,
          password: this.password,
          role: this.role
        };
  
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
  
        alert('Usuario registrado con éxito');
        this.$router.push({ name: 'HomeEnc' });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos de tu elección */
  </style>
  
<template>
  <div class="home-container">
    <h1>Cobros</h1>
    <p>Inicia Sesión:</p>
    <div class="login-options">
      <router-link to="/admin-login" class="login-button">Soy Profesional</router-link>
      <router-link to="/user-login" class="login-button">Soy Paciente</router-link>
      <!-- <router-link to="/register" class="login-button">Registrar</router-link> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeEnc'
};
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 50px;
}

.login-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.login-button {
  padding: 10px 20px;
  border: 1px solid #000;
  border-radius: 5px;
  text-decoration: none;
  color: #000;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.login-button:hover {
  background-color: #000;
  color: #fff;
}
</style>

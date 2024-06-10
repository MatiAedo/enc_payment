<template>
  <div class="home-container">
    <h1>Cobros</h1>
    <p>Inicia Sesión:</p>
    <div class="login-options">
      <router-link to="/admin-login" class="login-button">Soy Profesional</router-link>
      <router-link to="/user-login" class="login-button">Soy Paciente</router-link>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  margin-top: 50px;
}

h1 {
  color: #333;
  font-size: 2em;
  margin-bottom: 10px;
}

p {
  color: #555;
  font-size: 1.2em;
}

.login-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.login-button {
  padding: 10px 20px;
  border: 1px solid #007BFF;
  border-radius: 5px;
  text-decoration: none;
  color: #007BFF;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.login-button:hover {
  background-color: #007BFF;
  color: #fff;
}
</style>


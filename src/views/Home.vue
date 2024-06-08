<template>
    <div class="home-container">
      <h1>Bienvenido a la Plataforma de Citas</h1>
      <p>Elige tu tipo de login:</p>
      <div class="login-options">
        <router-link to="/admin-login" class="login-button">Login como Admin</router-link>
        <router-link to="/user-login" class="login-button">Login como Usuario</router-link>
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
  
<template>
  <div class="dashboard-container">
    <h1>Dashboard de Administrador</h1>
    <button @click="logout">Cerrar Sesión</button>
    <!-- Aquí el contenido específico del dashboard -->
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  methods: {
    logout() {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      this.$router.push({ name: 'HomeEnc' });
    }
  }
};
</script>

<style scoped>
/* Estilos de tu elección */
</style>

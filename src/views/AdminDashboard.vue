<template>
  <div class="dashboard-container">
    <h1>Dashboard de Profesional</h1>
    <button @click="logout">Cerrar Sesión</button>
    <h2>Mis Citas</h2>
    <ul>
      <li v-for="cita in misCitas" :key="cita.id">
        Cita con {{ cita.paciente.firstName }} {{ cita.paciente.lastName }} - {{ cita.paciente.email }} - Estado: {{ cita.estado }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      misCitas: [],
      currentUser: null
    };
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!this.currentUser) {
      console.error('currentUser is null. Redirecting to HomeEnc.');
      this.$router.push({ name: 'HomeEnc' });
      return;
    }
    console.log('currentUser:', this.currentUser);
    this.fetchMisCitas();
  },
  methods: {
    fetchMisCitas() {
      let citas = JSON.parse(localStorage.getItem('citas')) || [];
      if (this.currentUser) {
        this.misCitas = citas.filter(cita => cita.professional.username === this.currentUser.username);
      } else {
        this.misCitas = [];
      }
    },
    logout() {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentUser');
      this.$router.push({ name: 'HomeEnc' });
    }
  }
};
</script>

<style scoped>
/* Estilos */
</style>

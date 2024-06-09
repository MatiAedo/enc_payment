<template>
  <div class="dashboard-container">
    <h1>Dashboard de Paciente</h1>
    <button @click="logout">Cerrar Sesión</button>
    <h2>Lista de Profesionales</h2>
    <ul>
      <li v-for="professional in professionals" :key="professional.username">
        {{ professional.firstName }} {{ professional.lastName }} - {{ professional.email }}
        <button @click="agendarCita(professional)">Agendar Cita</button>
      </li>
    </ul>
    <h2>Mis Citas</h2>
    <ul>
      <li v-for="cita in misCitas" :key="cita.id">
        Cita con {{ cita.professional.firstName }} {{ cita.professional.lastName }} - {{ cita.professional.email }} - Estado: {{ cita.estado }}
        <button v-if="cita.estado === 'No pagada'" @click="pagarCita(cita)">Pagar</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UserDashboard',
  data() {
    return {
      professionals: [],
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
    this.fetchProfessionals();
    this.fetchMisCitas();
  },
  methods: {
    fetchProfessionals() {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      this.professionals = users.filter(user => user.role === 'admin');
    },
    fetchMisCitas() {
      let citas = JSON.parse(localStorage.getItem('citas')) || [];
      if (this.currentUser) {
        this.misCitas = citas.filter(cita => cita.paciente.username === this.currentUser.username);
      } else {
        this.misCitas = [];
      }
    },
    agendarCita(professional) {
      let citas = JSON.parse(localStorage.getItem('citas')) || [];
      if (!this.currentUser) {
        alert('No se encontró el usuario actual. Por favor, inicie sesión nuevamente.');
        this.$router.push({ name: 'HomeEnc' });
        return;
      }

      const nuevaCita = {
        id: Date.now(),
        paciente: this.currentUser,
        professional: professional,
        estado: 'No pagada'
      };

      citas.push(nuevaCita);
      localStorage.setItem('citas', JSON.stringify(citas));
      this.fetchMisCitas();
      alert('Cita agendada con éxito');
    },
    pagarCita(cita) {
      let citas = JSON.parse(localStorage.getItem('citas')) || [];
      const index = citas.findIndex(c => c.id === cita.id);
      if (index !== -1) {
        citas[index].estado = 'Pagada';
        localStorage.setItem('citas', JSON.stringify(citas));
        this.fetchMisCitas();
        alert('Cita pagada con éxito');
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

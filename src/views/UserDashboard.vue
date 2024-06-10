<template>
  <div class="dashboard-container">
    <h1>Dashboard de Paciente</h1>
    <button @click="logout">Cerrar Sesión</button>
    <p>Saldo de Wallet: {{ currentUser.wallet }} monedas</p>
    <router-link to="/wallet-recharge">Recargar Wallet</router-link>
    <h2>Tipos de Atención Disponibles</h2>
    <ul>
      <li v-for="atencion in tiposAtencion" :key="atencion.id">
        {{ atencion.nombre }} - {{ atencion.precio }} CLP - Profesional: {{ atencion.professional.firstName }} {{ atencion.professional.lastName }}
        <button @click="abrirModalAgendar(atencion)">Agendar Cita</button>
      </li>
    </ul>
    <h2>Mis Citas</h2>
    <ul>
      <li v-for="cita in misCitas" :key="cita.id">
        Servicio: {{ cita.servicio.nombre }} - Profesional: {{ cita.servicio.professional.firstName }} {{ cita.servicio.professional.lastName }} - Estado: {{ cita.estado }} - Valor: {{ cita.valor }} CLP - Fecha: {{ cita.fecha }}
        <router-link v-if="cita.estado !== 'Pagada'" :to="{ name: 'Payment', params: { id: cita.id } }">Pagar</router-link>
      </li>
    </ul>

    <!-- Modal para seleccionar la fecha -->
    <div v-if="mostrarModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="cerrarModal">&times;</span>
        <h2>Seleccionar Fecha para {{ atencionSeleccionada.nombre }}</h2>
        <input type="date" v-model="fechaSeleccionada" :min="fechaMinima" />
        <button @click="agendarCita">Agendar</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone';

export default {
  name: 'UserDashboard',
  data() {
    return {
      tiposAtencion: [],
      misCitas: [],
      currentUser: null,
      mostrarModal: false,
      atencionSeleccionada: null,
      fechaSeleccionada: null,
      fechaMinima: this.getFechaMinima()
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
    this.fetchTiposAtencion();
    this.fetchMisCitas();
  },
  methods: {
    getFechaMinima() {
      const hoy = moment().tz("America/Santiago");
      hoy.add(1, 'days'); // Añadir un día para que la fecha mínima sea mañana
      return hoy.format('YYYY-MM-DD'); // Formato YYYY-MM-DD
    },
    fetchTiposAtencion() {
      let tiposAtencion = JSON.parse(localStorage.getItem('tiposAtencion')) || [];
      this.tiposAtencion = tiposAtencion;
    },
    fetchMisCitas() {
      let citas = JSON.parse(localStorage.getItem('citas')) || [];
      if (this.currentUser) {
        this.misCitas = citas.filter(cita => cita.paciente.username === this.currentUser.username);
      } else {
        this.misCitas = [];
      }
    },
    abrirModalAgendar(atencion) {
      this.atencionSeleccionada = atencion;
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.atencionSeleccionada = null;
      this.fechaSeleccionada = null;
    },
    agendarCita() {
      if (!this.fechaSeleccionada) {
        alert('Por favor, selecciona una fecha.');
        return;
      }

      const fechaHoy = moment().tz("America/Santiago").format('YYYY-MM-DD');
      if (this.fechaSeleccionada <= fechaHoy) {
        alert('La fecha seleccionada debe ser mayor a la fecha actual.');
        return;
      }

      let citas = JSON.parse(localStorage.getItem('citas')) || [];
      if (!this.currentUser) {
        alert('No se encontró el usuario actual. Por favor, inicie sesión nuevamente.');
        this.$router.push({ name: 'HomeEnc' });
        return;
      }

      const nuevaCita = {
        id: Date.now(),
        paciente: this.currentUser,
        professional: this.atencionSeleccionada.professional,
        servicio: this.atencionSeleccionada,
        estado: 'No pagada',
        valor: this.atencionSeleccionada.precio,
        fecha: this.fechaSeleccionada
      };

      citas.push(nuevaCita);
      localStorage.setItem('citas', JSON.stringify(citas));
      this.fetchMisCitas();
      alert('Cita agendada con éxito');
      this.cerrarModal();
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
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
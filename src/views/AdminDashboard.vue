<template>
  <div class="dashboard-container">
    <h1>Dashboard de Profesional</h1>
    <button @click="logout">Cerrar Sesión</button>

    <h2>Crear Tipo de Atención</h2>
    <form @submit.prevent="crearTipoAtencion">
      <div>
        <label for="nombre">Nombre del Servicio:</label>
        <input type="text" v-model="nuevoTipoAtencion.nombre" id="nombre" required />
      </div>
      <div>
        <label for="precio">Precio:</label>
        <input type="number" v-model="nuevoTipoAtencion.precio" id="precio" required />
      </div>
      <button type="submit">Crear</button>
    </form>

    <h2>Mis Tipos de Atención</h2>
    <ul>
      <li v-for="atencion in misTiposAtencion" :key="atencion.id">
        {{ atencion.nombre }} - {{ atencion.precio }} CLP
      </li>
    </ul>

    <h2>Mis Citas</h2>
    <ul>
      <li v-for="cita in misCitas" :key="cita.id">
        Cita con {{ cita.paciente.firstName }} {{ cita.paciente.lastName }} - {{ cita.paciente.email }} - Estado: {{ cita.estado }} - Servicio: {{ cita.servicio.nombre }} - Fecha: {{ cita.fecha }} - Fecha de Pago: {{ cita.fechaPago || 'N/A' }}
        <button v-if="cita.estado !== 'Pagada'" @click="marcarComoPagada(cita)">Marcar como pagada</button>
        <div v-if="cita.estado !== 'Pagada'">
          <p>Link de Pago: <a :href="generarLinkPago(cita)" target="_blank">{{ generarLinkPago(cita) }}</a></p>
          <button @click="copiarLinkPago(generarLinkPago(cita))">Copiar Link de Pago</button>
        </div>
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
      misTiposAtencion: [],
      nuevoTipoAtencion: {
        nombre: '',
        precio: 0
      },
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
    this.fetchMisTiposAtencion();
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
    fetchMisTiposAtencion() {
      let tiposAtencion = JSON.parse(localStorage.getItem('tiposAtencion')) || [];
      if (this.currentUser) {
        this.misTiposAtencion = tiposAtencion.filter(atencion => atencion.professional.username === this.currentUser.username);
      } else {
        this.misTiposAtencion = [];
      }
    },
    crearTipoAtencion() {
      let tiposAtencion = JSON.parse(localStorage.getItem('tiposAtencion')) || [];
      const nuevoAtencion = {
        id: Date.now(),
        nombre: this.nuevoTipoAtencion.nombre,
        precio: this.nuevoTipoAtencion.precio,
        professional: this.currentUser
      };
      tiposAtencion.push(nuevoAtencion);
      localStorage.setItem('tiposAtencion', JSON.stringify(tiposAtencion));
      this.fetchMisTiposAtencion();
      alert('Tipo de atención creado con éxito');
    },
    marcarComoPagada(cita) {
      let citas = JSON.parse(localStorage.getItem('citas')) || [];
      const citaIndex = citas.findIndex(c => c.id === cita.id);
      if (citaIndex !== -1) {
        citas[citaIndex].estado = 'Pagada';
        citas[citaIndex].fechaPago = new Date().toISOString().slice(0, 10); // Registrar la fecha del pago
        localStorage.setItem('citas', JSON.stringify(citas));
        this.fetchMisCitas();
        alert('Cita marcada como pagada');
      }
    },
    generarLinkPago(cita) {
      return `${window.location.origin}/payment/${cita.id}`;
    },
    copiarLinkPago(link) {
      navigator.clipboard.writeText(link).then(() => {
        alert('Link de pago copiado al portapapeles');
      }
    );
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
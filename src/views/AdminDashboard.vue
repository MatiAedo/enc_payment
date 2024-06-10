<template>
  <div class="dashboard-container">
    <h1>Dashboard de Profesional</h1>
    <button @click="logout" class="logout-button">Cerrar Sesión</button>

    <div class="card">
      <h2>Crear Tipo de Atención</h2>
      <form @submit.prevent="crearTipoAtencion" class="form">
        <div class="form-group">
          <label for="nombre">Nombre del Servicio:</label>
          <input type="text" v-model="nuevoTipoAtencion.nombre" id="nombre" required />
        </div>
        <div class="form-group">
          <label for="precio">Precio:</label>
          <input type="number" v-model="nuevoTipoAtencion.precio" id="precio" required />
        </div>
        <button type="submit" class="form-button">Crear</button>
      </form>
    </div>

    <div class="card">
      <h2>Mis Tipos de Atención</h2>
      <ul>
        <li v-for="atencion in misTiposAtencion" :key="atencion.id" class="atencion-item">
          {{ atencion.nombre }} - {{ atencion.precio }} CLP
        </li>
      </ul>
    </div>

    <div class="card">
      <h2>Agendar Sesión para Paciente No Registrado</h2>
      <form @submit.prevent="agendarCitaNoRegistrada" class="form">
        <div class="form-group">
          <label for="nombrePaciente">Nombre del Paciente:</label>
          <input type="text" v-model="nuevoPaciente.nombre" id="nombrePaciente" required />
        </div>
        <div class="form-group">
          <label for="correoPaciente">Correo del Paciente:</label>
          <input type="email" v-model="nuevoPaciente.correo" id="correoPaciente" required />
        </div>
        <div class="form-group">
          <label for="fechaCita">Fecha de Agendamiento:</label>
          <input type="date" v-model="nuevoPaciente.fecha" :min="fechaMinima" required />
        </div>
        <div class="form-group">
          <label for="tipoAtencion">Tipo de Atención:</label>
          <select v-model="nuevoPaciente.tipoAtencion" id="tipoAtencion" required>
            <option v-for="atencion in misTiposAtencion" :key="atencion.id" :value="atencion">{{ atencion.nombre }} - {{ atencion.precio }} CLP</option>
          </select>
        </div>
        <button type="submit" class="form-button">Agendar</button>
      </form>
    </div>

    <div class="card">
      <h2>Mis Sesiones</h2>
      <div class="citas-container">
        <div v-for="cita in misCitas" :key="cita.id" class="cita-card">
          <p><strong>Servicio:</strong> {{ cita.servicio.nombre }}</p>
          <p><strong>Nombre:</strong> {{ cita.paciente.firstName || cita.paciente.nombre }}</p>
          <p><strong>Correo:</strong> {{ cita.paciente.email || cita.paciente.correo }}</p>
          <p><strong>Estado:</strong> {{ cita.estado }}</p>
          <p><strong>Fecha de Agendamiento:</strong> {{ cita.fecha }}</p>
          <p><strong>Fecha de Pago:</strong> {{ cita.fechaPago || 'N/A' }}</p>
          <div v-if="cita.estado !== 'Pagada'">
            <p><strong>Link de Pago:</strong> <a :href="generarLinkPago(cita)" target="_blank">{{ generarLinkPago(cita) }}</a></p>
            <div class="button-group">
              <button @click="marcarComoPagada(cita)" class="form-button">Marcar como pagada</button>
              <button @click="copiarLinkPago(generarLinkPago(cita))" class="form-button">Copiar Link de Pago</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import moment from 'moment-timezone';

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
      nuevoPaciente: {
        nombre: '',
        correo: '',
        fecha: '',
        tipoAtencion: null
      },
      currentUser: null,
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
    this.fetchMisCitas();
    this.fetchMisTiposAtencion();
  },
  methods: {
    getFechaMinima() {
      const hoy = moment().tz("America/Santiago");
      hoy.add(1, 'days'); // Añadir un día para que la fecha mínima sea mañana
      return hoy.format('YYYY-MM-DD'); // Formato YYYY-MM-DD
    },
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
    agendarCitaNoRegistrada() {
      if (!this.nuevoPaciente.nombre || !this.nuevoPaciente.correo || !this.nuevoPaciente.fecha || !this.nuevoPaciente.tipoAtencion) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      let citas = JSON.parse(localStorage.getItem('citas')) || [];

      const nuevaCita = {
        id: Date.now(),
        paciente: {
          nombre: this.nuevoPaciente.nombre,
          correo: this.nuevoPaciente.correo
        },
        professional: this.currentUser,
        servicio: this.nuevoPaciente.tipoAtencion,
        estado: 'No pagada',
        valor: this.nuevoPaciente.tipoAtencion.precio,
        fecha: this.nuevoPaciente.fecha
      };

      citas.push(nuevaCita);
      localStorage.setItem('citas', JSON.stringify(citas));
      this.fetchMisCitas();
      alert('Cita agendada con éxito');
      this.resetForm();
    },
    resetForm() {
      this.nuevoPaciente = {
        nombre: '',
        correo: '',
        fecha: '',
        tipoAtencion: null
      };
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
      });
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
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f7f7f7;
  padding: 20px;
}

.logout-button {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.logout-button:hover {
  background-color: #d32f2f;
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.form-button:hover {
  background-color: #45a049;
}

.citas-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.cita-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>

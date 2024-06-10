<template>
  <div class="payment-container">
    <h1>Pago de Cita</h1>
    
    <!-- Detalles de la Cita -->
    <div v-if="cita">
      <p><strong>Nombre del Paciente:</strong> {{ cita.paciente.firstName }} {{ cita.paciente.lastName }}</p>
      <p><strong>Nombre del Servicio:</strong> {{ cita.servicio.nombre }}</p>
      <p><strong>Fecha de Agendamiento:</strong> {{ cita.fecha }}</p>
    </div>
    
    <p v-if="isAuthenticated && currentUser">Saldo actual: {{ currentUser.wallet }} monedas</p>
    <p>Valor de la cita: {{ cita.valor }} CLP</p>

    <h2>Seleccionar método de pago</h2>
    <select v-model="selectedMethod">
      <option value="creditCard">Tarjeta de Crédito/Débito</option>
      <option value="dolares">Pagar en Dólares</option>
      <option v-if="isAuthenticated && currentUser && userRole === 'user'" value="wallet">Wallet</option>
    </select>

    <div v-if="selectedMethod === 'wallet' && isAuthenticated && currentUser && userRole === 'user'">
      <button @click="pagarCitaConWallet">Pagar con Wallet</button>
    </div>

    <div v-if="selectedMethod === 'creditCard'">
      <form @submit.prevent="pagarCitaConTarjeta">
        <div>
          <label for="cardNumber">Número de Tarjeta:</label>
          <input type="text" v-model="cardNumber" id="cardNumber" required />
        </div>
        <div>
          <label for="expiryDate">Fecha de Expiración:</label>
          <input type="text" v-model="expiryDate" id="expiryDate" required />
        </div>
        <div>
          <label for="cvv">CVV:</label>
          <input type="text" v-model="cvv" id="cvv" required />
        </div>
        <button type="submit">Pagar con Tarjeta</button>
      </form>
    </div>

    <div v-if="selectedMethod === 'dolares'">
      <p>Precio en dólares: {{ precioEnDolares.toFixed(2) }} USD (incluye 6% de comisión)</p>
      <button @click="pagarCitaEnDolares">Pagar en Dólares</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PaymentEnc',
  data() {
    return {
      currentUser: null,
      isAuthenticated: false,
      userRole: null,
      cita: null,
      selectedMethod: 'creditCard',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      tipoCambioDolar: null,
      precioEnDolares: 0
    };
  },
  created() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userRole = localStorage.getItem('userRole');

    if (isAuthenticated && currentUser) {
      this.isAuthenticated = true;
      this.currentUser = currentUser;
      this.userRole = userRole;
    }

    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    this.cita = citas.find(cita => cita.id === parseInt(this.$route.params.id));
    if (!this.cita) {
      console.error('Cita not found. Redirecting to UserDashboard.');
      this.$router.push({ name: 'UserDashboard' });
    } else {
      this.obtenerTipoCambioDolar();
    }
  },
  methods: {
    obtenerTipoCambioDolar() {
      axios.get('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => {
          const tipoCambio = response.data.rates.CLP;
          this.tipoCambioDolar = tipoCambio;
          this.precioEnDolares = (this.cita.valor / tipoCambio) * 1.06; // Incluye 6% de comisión
        })
        .catch(error => {
          console.error('Error al obtener el tipo de cambio del dólar:', error);
        });
    },
    pagarCitaConWallet() {
      if (this.currentUser.wallet >= this.cita.valor) {
        this.currentUser.wallet -= this.cita.valor;
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.username === this.currentUser.username);
        if (userIndex !== -1) {
          users[userIndex].wallet = this.currentUser.wallet;
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }

        let citas = JSON.parse(localStorage.getItem('citas')) || [];
        const citaIndex = citas.findIndex(cita => cita.id === this.cita.id);
        if (citaIndex !== -1) {
          citas[citaIndex].estado = 'Pagada';
          citas[citaIndex].fechaPago = new Date().toISOString().slice(0, 10); // Registrar la fecha del pago
          localStorage.setItem('citas', JSON.stringify(citas));
        }

        this.$router.push({ name: 'PaymentSuccess' });
      } else {
        this.$router.push({ name: 'PaymentFailure' });
      }
    },
    pagarCitaConTarjeta() {
      if (this.validarTarjeta()) {
        // Lógica de testing: rechazar si el precio termina en 8 o 9
        const lastDigit = this.cita.valor % 10;
        if (lastDigit === 8 || lastDigit === 9) {
          this.$router.push({ name: 'PaymentFailure' });
        } else {
          let citas = JSON.parse(localStorage.getItem('citas')) || [];
          const citaIndex = citas.findIndex(cita => cita.id === this.cita.id);
          if (citaIndex !== -1) {
            citas[citaIndex].estado = 'Pagada';
            citas[citaIndex].fechaPago = new Date().toISOString().slice(0, 10); // Registrar la fecha del pago
            localStorage.setItem('citas', JSON.stringify(citas));
          }
          this.$router.push({ name: 'PaymentSuccess' });
        }
      } else {
        this.$router.push({ name: 'PaymentFailure' });
      }
    },
    pagarCitaEnDolares() {
      let citas = JSON.parse(localStorage.getItem('citas')) || [];
      const citaIndex = citas.findIndex(c => c.id === this.cita.id);
      if (citaIndex !== -1) {
        citas[citaIndex].estado = 'Pagada';
        citas[citaIndex].fechaPago = new Date().toISOString().slice(0, 10); // Registrar la fecha del pago
        localStorage.setItem('citas', JSON.stringify(citas));
      }
      this.$router.push({ name: 'PaymentSuccess' });
    },
    validarTarjeta() {
      // Simulación simple de validación de tarjeta
      return this.cardNumber.length === 16 && this.expiryDate && this.cvv.length === 3;
    }
  }
};
</script>

<style scoped>
/* Estilos */
</style>
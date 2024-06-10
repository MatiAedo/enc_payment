<template>
  <div class="payment-container">
    <h1>Pago de Sesión</h1>
    
    <!-- Detalles de la Cita -->
    <div v-if="cita" class="cita-details">
      <p><strong>Nombre del Paciente:</strong> {{ cita.paciente.firstName }} {{ cita.paciente.lastName }}</p>
      <p><strong>Nombre del Servicio:</strong> {{ cita.servicio.nombre }}</p>
      <p><strong>Fecha de Agendamiento:</strong> {{ cita.fecha }}</p>
      <p><strong>Valor de la sesión:</strong> {{ cita.valor }} CLP</p>
    </div>

    <h2>Seleccionar método de pago</h2>
    <div class="payment-methods">
      <div class="payment-method" v-if="isAuthenticated && currentUser && userRole === 'user'">
        <p>Saldo actual: {{ currentUser.wallet }} monedas</p>
        <button @click="pagarCitaConWallet" class="payment-button">Pagar con Wallet</button>
      </div>

      <div class="payment-method">
        <form @submit.prevent="pagarCitaConTarjeta" class="form">
          <div class="form-group">
            <label for="cardNumber">Número de Tarjeta:</label>
            <input type="text" v-model="cardNumber" id="cardNumber" required />
          </div>
          <div class="form-group">
            <label for="expiryDate">Fecha de Expiración:</label>
            <input type="text" v-model="expiryDate" id="expiryDate" required />
          </div>
          <div class="form-group">
            <label for="cvv">CVV:</label>
            <input type="text" v-model="cvv" id="cvv" required />
          </div>
          <button type="submit" class="form-button">Pagar con Tarjeta</button>
        </form>
      </div>

      <div class="payment-method">
        <p>Precio en dólares: {{ precioEnDolares.toFixed(2) }} USD (incluye 6% de comisión)</p>
        <button @click="pagarCitaEnDolares" class="payment-button">Pagar en Dólares</button>
      </div>
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
.payment-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f7f7f7;
  padding: 20px;
}

.cita-details {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.payment-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.payment-method {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.form-group input {
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

.payment-button {
  background-color: #007BFF;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.payment-button:hover {
  background-color: #0056b3;
}
</style>


<template>
  <div class="payment-container">
    <h1>Pago de Cita</h1>
    <p>Saldo actual: {{ currentUser.wallet }} monedas</p>
    <p>Valor de la cita: {{ cita.valor }} CLP</p>

    <h2>Seleccionar método de pago</h2>
    <select v-model="selectedMethod">
      <option value="wallet">Wallet</option>
      <option value="creditCard">Tarjeta de Crédito/Débito</option>
    </select>

    <div v-if="selectedMethod === 'wallet'">
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
  </div>
</template>

<script>
export default {
  name: 'PaymentEnc',
  data() {
    return {
      currentUser: null,
      cita: null,
      selectedMethod: 'wallet',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    };
  },
  created() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!this.currentUser) {
      console.error('currentUser is null. Redirecting to HomeEnc.');
      this.$router.push({ name: 'HomeEnc' });
      return;
    }

    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    this.cita = citas.find(cita => cita.id === parseInt(this.$route.params.id));
    if (!this.cita) {
      console.error('Cita not found. Redirecting to UserDashboard.');
      this.$router.push({ name: 'UserDashboard' });
    }
  },
  methods: {
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

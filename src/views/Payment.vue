<template>
    <div class="payment-container">
      <h1>Pago de Cita</h1>
      <p>Saldo actual: {{ currentUser.wallet }} monedas</p>
      <p>Valor de la cita: {{ cita.valor }} CLP</p>
      <button @click="pagarCita">Pagar con Wallet</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PaymentEnc',
    data() {
      return {
        currentUser: null,
        cita: null
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
        console.error('Cita no encontrada. Redireccionando a Dashboard.');
        this.$router.push({ name: 'UserDashboard' });
      }
    },
    methods: {
      pagarCita() {
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
            localStorage.setItem('citas', JSON.stringify(citas));
          }
  
          this.$router.push({ name: 'PaymentSuccess' });
        } else {
          this.$router.push({ name: 'PaymentFailure' });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos */
  </style>  
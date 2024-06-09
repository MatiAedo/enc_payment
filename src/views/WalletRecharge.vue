<template>
    <div class="wallet-recharge-container">
      <h1>Recargar Wallet</h1>
      <p>Saldo actual: {{ currentUser.wallet }} monedas</p>
      <form @submit.prevent="recargar">
        <div>
          <label for="amount">Monto a Cargar:</label>
          <input type="number" v-model="amount" id="amount" required />
        </div>
        <button type="submit">Cargar</button>
      </form>
      <button @click="volverAlDashboard">Volver al Dashboard</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'WalletRecharge',
    data() {
      return {
        amount: 0,
        currentUser: null
      };
    },
    created() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!this.currentUser) {
        console.error('currentUser is null. Redirecting to HomeEnc.');
        this.$router.push({ name: 'HomeEnc' });
      }
    },
    methods: {
      recargar() {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(user => user.username === this.currentUser.username);
        if (index !== -1) {
          users[index].wallet += parseInt(this.amount, 10);
          localStorage.setItem('users', JSON.stringify(users));
          this.currentUser.wallet = users[index].wallet;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          alert('Recarga exitosa');
        }
      },
      volverAlDashboard() {
        const userRole = this.currentUser.role;
        if (userRole === 'user') {
          this.$router.push({ name: 'UserDashboard' });
        } else if (userRole === 'admin') {
          this.$router.push({ name: 'AdminDashboard' });
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos  */
  </style>
  
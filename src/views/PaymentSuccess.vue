<template>
    <div class="payment-success-container">
      <h1>Pago Exitoso</h1>
      <p>Tu pago ha sido procesado con éxito.</p>
      <button @click="volverAlDashboard">Volver al Dashboard</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PaymentSuccess',
    methods: {
      volverAlDashboard() {
        this.$router.push({ name: 'UserDashboard' });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos */
  </style>  
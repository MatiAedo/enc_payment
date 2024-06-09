<template>
    <div class="payment-failure-container">
      <h1>Pago Rechazado</h1>
      <p>No se pudo procesar tu pago. Por favor, intenta nuevamente.</p>
      <button @click="volverAlDashboard">Volver al Dashboard</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PaymentFailure',
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
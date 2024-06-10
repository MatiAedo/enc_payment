<template>
  <div class="payment-failure-container">
    <h1>Pago Rechazado</h1>
    <p>No se pudo procesar tu pago. Por favor, intenta nuevamente.</p>
    <button @click="volverAlDashboard" class="failure-button">Volver al Dashboard</button>
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
.payment-failure-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffebee;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  color: #c62828;
}

h1 {
  color: #b71c1c;
}

.failure-button {
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.failure-button:hover {
  background-color: #d32f2f;
}
</style>

<template>
  <div class="payment-success-container">
    <h1>Pago Exitoso</h1>
    <p>Tu pago ha sido procesado con éxito.</p>
    <button @click="volverAlDashboard" class="success-button">Volver al Dashboard</button>
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
.payment-success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #e0f7fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  color: #00796b;
}

h1 {
  color: #004d40;
}

.success-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.success-button:hover {
  background-color: #45a049;
}
</style>

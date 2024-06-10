<template>
    <div class="wallet-recharge-container">
        <h1>Recargar Wallet</h1>
        <p>Saldo actual: {{ currentUser.wallet }} monedas</p>
        <form @submit.prevent="recargar" class="form">
        <div class="form-group">
            <label for="amount">Monto a Cargar:</label>
            <input type="number" v-model="amount" id="amount" required />
        </div>
        <button type="submit" class="form-button">Cargar</button>
        </form>
        <button @click="volverAlDashboard" class="back-button">Volver al Dashboard</button>
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
.wallet-recharge-container {
display: flex;
flex-direction: column;
align-items: center;
background-color: #f7f7f7;
padding: 20px;
}

.form {
background: #ffffff;
padding: 20px;
border-radius: 8px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
width: 100%;
max-width: 400px;
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
padding: 10px;
border: none;
border-radius: 4px;
cursor: pointer;
font-size: 16px;
margin-top: 10px;
}

.form-button:hover {
background-color: #45a049;
}

.back-button {
background-color: #007BFF;
color: white;
padding: 10px 20px;
border: none;
border-radius: 4px;
cursor: pointer;
font-size: 16px;
margin-top: 20px;
}

.back-button:hover {
background-color: #0056b3;
}
</style>
  
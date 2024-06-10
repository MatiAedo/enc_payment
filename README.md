# Prueba Software

La prueba fue realizada con Vue 3, se integraron todos los requerimientos minimos y deseables. No se consideró el bonus.
Para el manejo de información se utilizó LocalStorage.
Dado el tamaño del proyecto y el framework, los script y styles están encapsulados en cada archivo.

En cuanto a las funcionalidades:

- Los usuarios deberán crearse, no está considerado que exista colisión entre ambos tipos ni se hacen comprobaciones en el formulario de registro dado que el foco está en la funcionalidad de cobro.
- La carga del wallet se hace asumiendo que utilizará una pasarela de pago para esto, al igual que en pago con tarjeta y moneda extranjera.
- El link de pago permitirá el pago con Wallet siempre y cuando se esté logueado como paciente, en caso contrario se podrá realizar el pago con tarjeta o en otra moneda.
- Tanto paciente como profesional pueden agendar sesiones, pero si es agendada por el profesional solo será posible el pago por link, dado que no se reflejará en la vista del paciente si tienen usuario creado

También se hosteó en Vercel: [Link](https://enc-payment-c5r30ftig-matias-projects-3e64d732.vercel.app)

Instrucciones para ejecución en local:

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Prueba Software

La prueba fue realizada con Vue 3, se integraron todos los requerimientos minimos y deseables. No se consideró el bonus.
Para el manejo de información se utilizó LocalStorage.
Dado el tamaño del proyecto y el framework, los script y styles están encapsulados en cada archivo.

En cuanto a las funcionalidades:

- Los usuarios deberán crearse, no está considerado que exista colisión entre ambos tipos ni se hacen comprobaciones en el formulario de registro dado que el foco está en la funcionalidad de cobro.
- La carga del wallet se hace asumiendo que utilizará una pasarela de pago para esto, al igual que en pago con tarjeta y moneda extranjera.
- El link de pago permitirá el pago con Wallet siempre y cuando se esté logueado como paciente, en caso contrario se podrá realizar el pago con tarjeta o en otra moneda.
- Tanto paciente como profesional pueden agendar sesiones, pero si es agendada por el profesional solo será posible el pago por link, dado que no se reflejará en la vista del paciente si tienen usuario creado

Para chequear las funcionalidades recomiendo el siguiente orden:

1. Crear un usuario Profesional
2. Loggearse como Profesional
3. Crear un tipo de servicio con costo terminado en 8-9 para rechazar y cualquier otro precio para aprobar con tarjeta debito/credito
4. Agendar desde el dashboard de profesional (Pueden marcar como pagado desde aquí si quieren probar y revisar el link)
5. Cerrar sesión
6. Crear usuario Paciente
7. Loggearse como paciente
8. Agendar los servicios creados anteriormente
9. Cargar el Wallet
10. Testear todos los pagos posibles (Wallet, tarjeta, dolares). En el caso de tarjeta, el número debe ser largo 16, fecha distinto de vacío y CVV con largo 3
11. Probar acceder a un link de pago sin estar loggeado como paciente (no se mostrará el wallet, se puede pinchar el link loggeado como profesional y no tendrá wallet asociado)

También se hosteó en Vercel: [Link](https://enc-payment.vercel.app/)

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


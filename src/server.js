// IMPORTA O APP E REALIZA START NO SERVIDOR via listen
const app = require('./app');

app.listen(3001, () => console.log('server running on port 3001')); // para a porta pode ser qualquer número não utilizado acima de 1023
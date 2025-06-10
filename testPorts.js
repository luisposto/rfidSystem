const { SerialPort } = require('serialport');

SerialPort.list().then((ports) => {
  console.log('--- Puertos detectados ---');
  ports.forEach((p, i) => {
    console.log(`Puerto ${i}:`, p);
  });
}).catch((err) => {
  console.error('Error al listar puertos:', err.message);
});

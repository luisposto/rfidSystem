const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const db = require('./db'); // Conexión a base de datos

const portName = 'COM3';
let ultimoTag = '';
let lecturas = [];

/**
 * Convierte un UID hexadecimal en varios formatos útiles.
 * @param {string} hexUid - UID en cadena hexadecimal
 * @returns {{hex:string, decimal:string, ascii:string, bytesBigEndian:number[], 
   bytesLittleEndian:number[], base64:string}}
 */
function formatUid(hexUid) {
  const buf = Buffer.from(hexUid, 'hex');

  // Decimal (BigInt para no perder precisión)
  const decimal = BigInt('0x' + hexUid).toString(10);

  // ASCII
  const ascii = buf.toString('ascii');

  // Arreglos de bytes
  const bytesBigEndian    = Array.from(buf);
  const bytesLittleEndian = Array.from(buf).reverse();

  // Base64
  const base64 = buf.toString('base64');

  return { hex: hexUid, decimal, ascii, bytesBigEndian, bytesLittleEndian, base64 };
}

const getUltimoTag = () => ultimoTag;
const getLecturas = () => lecturas.slice(-30).reverse(); // Últimos 30 tags

function guardarTagEnDB(tag) {
  const sql = 'INSERT INTO tags (tag) SELECT ? FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM tags WHERE tag = ?)';
  db.query(sql, [tag, tag], (err, result) => {
    if (err) {
      console.error('Error al guardar tag en la base de datos:', err.message);
    } else if (result.affectedRows > 0) {
      console.log(`Tag ${tag} guardado en la base de datos`);
    } else {
      console.log(`Tag ${tag} ya existe en la base de datos`);
    }
  });
}

SerialPort.list().then((ports) => {
  console.log('--- Puertos disponibles ---');
  ports.forEach((p, i) => console.log(`Puerto ${i}:`, p));

  const validPorts = ports.filter(p => typeof p.path === 'string');
  if (!validPorts.length) {
    console.error('No hay puertos válidos con atributo .path');
    return;
  }

  const selectedPort = validPorts.find(p => p.path === portName) || validPorts[0];
  console.log(`Usando puerto: ${selectedPort.path}`);

  const port = new SerialPort({
    path: selectedPort.path,
    baudRate: 38400,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    autoOpen: false,
  });

  port.open((err) => {
    if (err) {
      console.error(`Error al abrir el puerto ${selectedPort.path}:`, err.message);
      return;
    }

    console.log(`Puerto serial ${selectedPort.path} abierto correctamente`);
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    // Solicitar lectura cada segundo
    setInterval(() => {
      port.write('\nU\r', (err) => err && console.error('Error al enviar comando de lectura:', err.message));
    }, 1000);

    parser.on('data', (data) => {
      const cleaned = data.trim();

      if (cleaned.startsWith('U')) {
        const tag = cleaned.substring(1);
        if (tag.length) {
          ultimoTag = tag;
          lecturas.push(tag);

          // Formatear UID en varios formatos
          const formatted = formatUid(tag);
          console.log('Tag formateado:', formatted);

          guardarTagEnDB(tag);
        } else {
          console.log('Lectura vacía ignorada');
        }
      } else {
        console.log('Respuesta desconocida:', cleaned);
      }
    });
  });
}).catch((err) => {
  console.error('Error al listar puertos seriales:', err.message);
});

module.exports = { getUltimoTag, getLecturas, formatUid };

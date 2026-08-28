const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.log("Uso: node hash-password.js <contraseña>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nHash generado (cópialo tal cual):\n");
console.log(hash);
console.log("\nEjemplo de INSERT:\n");
console.log(`INSERT INTO usuarios (usuario, password) VALUES ('admin', '${hash}');\n`);

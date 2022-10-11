const productos = [
  { nombre: 'taza', costo: '30' },
  { nombre: 'sticker', costo: '10' },
  { nombre: 'agenda', costo: '120' },
  { nombre: 'libreta', costo: '80' },
];

let carrito = [];

const agregarACarrito = (indice) => {
  let indiceExistente = carrito.findIndex(
    (articulo) => articulo.indice === indice
  );

  // verificar si ya existe en el carrito
  if (indiceExistente >= 0) {
    // si existe ya en el carrito le sumamos 1
    carrito[indiceExistente].cantidad++;
  } else {
    // si no existe creamos un articulo del carrito con cantidad 1

    carrito.push({ indice, cantidad: 1 });
  }
};

const sumarProductos = (indice, cantidad) => productos[indice].costo * cantidad;

const sumaTotal = () => {
  let total = 0;

  carrito.forEach((articulo) => {
    total += sumarProductos(articulo.indice, articulo.cantidad);
  });

  return total;
};

const mostrarTienda = () => {
  let mensaje = '';

  mensaje += 'Escriba el número que producto quiere agregar a su carrito';
  mensaje += '\r\r';

  productos.forEach((producto, indice) => {
    let comprados = '';

    const enCarrito = carrito.find((articulo) => articulo.indice === indice);

    if (enCarrito) {
      comprados = `(${enCarrito.cantidad} en carrito)`;
    }

    mensaje += `${indice + 1}: ${producto.nombre} costo $${
      producto.costo
    } ${comprados}`;
    mensaje += '\r';
  });

  mensaje += '\r';
  mensaje += '0: Ir a total';
  mensaje += '\r';

  return window.prompt(mensaje);
};

const mostrarTotal = () => {
  let mensaje = '';

  mensaje += 'El resumen de su compra es el siguiente';
  mensaje += '\r\r';

  carrito.forEach((articulo) => {
    const suma = sumarProductos(articulo.indice, articulo.cantidad);
    mensaje += `${articulo.cantidad} x ${
      productos[articulo.indice].nombre
    }:    $${suma}`;
    mensaje += '\r';
  });

  mensaje += '\r';
  mensaje += `TOTAL: $${sumaTotal()}`;
  mensaje += '\r';

  window.alert(mensaje)
};

let seleccion = '';

do {
  seleccion = mostrarTienda();

  // si no le dieron cancel convertir a número
  if(seleccion !== null) {
    seleccion = parseInt(seleccion)
  }

  // asegurarse de que exista el producto antes de agregarlo al carrito
  if (seleccion && productos[seleccion - 1]) {
    agregarACarrito(seleccion - 1);
  }
} while (seleccion !== 0 && seleccion !== null);

// mostrar carrito en consola para mostrar su contenido
console.log(carrito)

// mostrar carrito de forma legible para humanos
mostrarTotal();

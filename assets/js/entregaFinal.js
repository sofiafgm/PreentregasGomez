let productos = [
  { nombre: 'agenda 1', costo: '85' },
  { nombre: 'agenda 2', costo: '115' },
  { nombre: 'agenda 3', costo: '120' },
  { nombre: 'agenda 4', costo: '80' },
  { nombre: 'agenda 5', costo: '90' },
  { nombre: 'agenda 6', costo: '100' },
  { nombre: 'agenda 7', costo: '110' },
  { nombre: 'agenda 8', costo: '95' },
  { nombre: 'agenda 9', costo: '105' },
];

fetch('https://dummyjson.com/products?limit=9&skip=40&select=title,price')
  .then((res) => res.json())
  .then((data) => {
    productos = data.products.map((producto) => ({
      nombre: producto.title,
      costo: producto.price,
    }));

    mostrarTienda();
  });

let carrito = [];

try {
  carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
} catch (e) {
  console.warn('no se pudo cargar carrito');
}

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
    carrito = [...carrito, { indice, cantidad: 1 }];
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));

  mostrarTotal();
};

const restarACarrito = (indice) => {
  let indiceExistente = carrito.findIndex(
    (articulo) => articulo.indice === indice
  );

  // verificar si ya existe en el carrito
  if (indiceExistente >= 0) {
    if (carrito[indiceExistente].cantidad > 1) {
      // si existe mas de 1 en el carrito le quitamos 1
      carrito[indiceExistente].cantidad--;
    } else {
      // si solo le queda 1 lo quitamos del carrito
      carrito.splice(indiceExistente, 1);
    }
  }

  mostrarTotal();
};

const sumarProductos = (indice, cantidad) => productos[indice].costo * cantidad;

const sumaTotal = () => {
  let total = 0;

  carrito.forEach((articulo) => {
    total += sumarProductos(articulo.indice, articulo.cantidad);
  });

  return total;
};

const crearOverlay = (elemento, indice) => {
  const producto = productos[indice];

  if (producto) {
    const overlay = document.createElement('div');
    const titulo = document.createElement('div');
    const precio = document.createElement('div');
    const contenedorBotones = document.createElement('div');
    const botonMenos = document.createElement('button');
    const botonMas = document.createElement('button');

    botonMas.addEventListener('click', () => agregarACarrito(indice));
    botonMenos.addEventListener('click', () => restarACarrito(indice));

    overlay.classList.add('overlay');
    titulo.classList.add('title');
    precio.classList.add('price');
    contenedorBotones.classList.add('buttons');
    botonMenos.classList.add('button');
    botonMenos.classList.add('bg-black');
    botonMas.classList.add('button');
    botonMas.classList.add('bg-black');

    titulo.appendChild(document.createTextNode(producto.nombre));
    precio.appendChild(document.createTextNode(producto.costo));
    botonMenos.appendChild(document.createTextNode('-'));
    botonMas.appendChild(document.createTextNode('+'));

    contenedorBotones.appendChild(botonMenos);
    contenedorBotones.appendChild(botonMas);

    overlay.appendChild(titulo);
    overlay.appendChild(precio);
    overlay.appendChild(contenedorBotones);

    elemento.appendChild(overlay);
  }
};

const mostrarTienda = () => {
  const productos = document.getElementsByClassName('product');

  for (let index = 0; index < productos.length; index++) {
    const element = productos[index];
    crearOverlay(element, index);
  }
};

const crearCelda = (texto) => {
  const nodoTexto = document.createTextNode(texto);
  const celda = document.createElement('td');

  celda.appendChild(nodoTexto);

  return celda;
};

const crearHeader = () => {
  const header = document.createElement('tr');

  header.appendChild(crearCelda('Articulo'));
  header.appendChild(crearCelda('Costo individual'));
  header.appendChild(crearCelda('Cantidad'));
  header.appendChild(crearCelda('Costo total'));

  return header;
};

const crearFilaArticulo = (articulo) => {
  const fila = document.createElement('tr');
  const nombre = crearCelda(productos[articulo.indice].nombre);
  const costo = crearCelda(productos[articulo.indice].costo);
  const cantidad = crearCelda(articulo.cantidad);
  const suma = crearCelda(sumarProductos(articulo.indice, articulo.cantidad));

  fila.appendChild(nombre);
  fila.appendChild(costo);
  fila.appendChild(cantidad);
  fila.appendChild(suma);

  return fila;
};

const mostrarTotal = () => {
  const tabla = document.getElementById('shopping-details');
  const boton = document.getElementById('buy-button');
  const mensajeVacio = document.getElementById('empty-cart');
  tabla.innerHTML = '';

  if (carrito.length) {
    tabla.appendChild(crearHeader());

    if (!mensajeVacio.classList.contains('d-none'))
      mensajeVacio.classList.add('d-none');

    carrito.forEach((articulo) => {
      tabla.appendChild(crearFilaArticulo(articulo));
    });

    const rowTotal = document.createElement('tr');
    const celdaTituloTotal = crearCelda('TOTAL');
    const celdaCantidadTotal = crearCelda(sumaTotal());

    celdaTituloTotal.setAttribute('colspan', 3);
    celdaTituloTotal.setAttribute('style', 'text-align: end;');

    rowTotal.appendChild(celdaTituloTotal);
    rowTotal.appendChild(celdaCantidadTotal);

    tabla.appendChild(rowTotal);
    boton.removeAttribute('disabled');
  } else {
    boton.setAttribute('disabled', true);
    mensajeVacio.classList.remove('d-none');
  }
};

const borrarCarrito = () => {
  carrito = [];

  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarTotal();
};

const boton = document.getElementById('buy-button');

boton.addEventListener('click', () => {
  Swal.fire({
    title: 'Compra Finalizada!',
    text: 'Su pedido se ha realizado con éxito',
    icon: 'success',
    color: 'white',
    background: 'black',
    confirmButtonText: 'Cool',
    confirmButtonColor: '#1c1f23',
  });
  borrarCarrito();
});

mostrarTotal();

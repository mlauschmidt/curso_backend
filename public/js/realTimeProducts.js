const socket = io();

const productsContainer = document.getElementById('productsContainer');

socket.on('nuevo_producto', (data) => {
    const product = JSON.parse(data);

    productsContainer.innerHTML += 
    `<ul id=prod-${product.id}>
        <li> Nombre: ${product.title}
            <ul> 
                <li> Id: ${product.id} </li>
                <li> Descripción: ${product.description} </li>
                <li> Precio: ${product.price} </li>
                <li> Imágenes: ${product.thumbnail} </li>
                <li> Código: ${product.code} </li>
                <li> Stock: ${product.stock} </li>
                <li> Categotría: ${product.category} </li>
            </ul>
        </li>
    </ul>`;
})

socket.on('producto_modificado', (data) => {
    const product = JSON.parse(data);

    const updatedProduct = document.getElementById(`prod-${product.id}`);

    updatedProduct.innerHTML = 
    `<li> Nombre: ${product.title}
        <ul> 
            <li> Id: ${product.id} </li>
            <li> Descripción: ${product.description} </li>
            <li> Precio: ${product.price} </li>
            <li> Imágenes: ${product.thumbnail} </li>
            <li> Código: ${product.code} </li>
            <li> Stock: ${product.stock} </li>
            <li> Categotría: ${product.category} </li>
        </ul>
    </li>`;
})

socket.on('producto_elimindo', (data) => {
    const product = JSON.parse(data);

    const prodId = document.getElementById(`prod-${product.id}`);

    productsContainer.removeChild(prodId);
})
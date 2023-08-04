const socket = io();

const productsContainer = document.getElementById('productsContainer');

socket.on('nuevo_producto', (data) => {
    const product = JSON.parse(data);

    productsContainer.innerHTML += 
    `<div id="prod-${product._id}" style="border-bottom: 1px solid black">   
        <ul>
            <li> Nombre: ${product.title}
                <ul> 
                    <li> Id: ${product._id} </li>
                    <li> Descripción: ${product.description} </li>
                    <li> Precio: ${product.price} </li>
                    <li> Imágenes: ${product.thumbnail} </li>
                    <li> Código: ${product.code} </li>
                    <li> Stock: ${product.stock} </li>
                    <li> Categotría: ${product.category} </li>
                </ul>
            </li>
        </ul>
        <button style="margin: 0px 0px 20px 20px" class="deleteButton" id="deleteButton_${product._id}" onclick="deleteProduct('${product._id}')">Eliminar</button>
    </div>`;
})

socket.on('producto_modificado', (data) => {
    const product = JSON.parse(data);

    const updatedProduct = document.getElementById(`prod-${product._id}`);

    updatedProduct.innerHTML = 
    `<ul>
        <li> Nombre: ${product.title}
            <ul> 
                <li> Id: ${product._id} </li>
                <li> Descripción: ${product.description} </li>
                <li> Precio: ${product.price} </li>
                <li> Imágenes: ${product.thumbnail} </li>
                <li> Código: ${product.code} </li>
                <li> Stock: ${product.stock} </li>
                <li> Categotría: ${product.category} </li>
            </ul>
        </li>
    </ul>
    <button style="margin: 0px 0px 20px 20px" class="deleteButton" id="deleteButton_${product._id}" onclick="deleteProduct('${product._id}')">Eliminar</button>`;
})

const deleteProduct = (id) => {
    fetch(`/api/products/${id}`, {
        method: 'DELETE',
    })
}

socket.on('producto_eliminado', (data) => {
    const product = JSON.parse(data);

    const prodId = document.getElementById(`prod-${product._id}`);

    productsContainer.removeChild(prodId);
})
const socket = io();

const productsContainer = document.getElementById('productsContainer');

socket.on('producto_agregado_inventario', (data) => {
    const product = JSON.parse(data);

    productsContainer.innerHTML += 
    `<div id="prod-${product._id || product.id}" style="border-bottom: 1px solid black">   
        <ul>
            <li> Nombre: ${product.title}
                <ul> 
                    <li> Id: ${product._id || product.id} </li>
                    <li> Descripción: ${product.description} </li>
                    <li> Precio: ${product.price} </li>
                    <li> Imágenes: ${product.thumbnail} </li>
                    <li> Código: ${product.code} </li>
                    <li> Stock: ${product.stock} </li>
                    <li> Categotría: ${product.category} </li>
                </ul>
            </li>
        </ul>
        <button style="margin: 0px 0px 20px 20px" class="addToCartButton" id="addToCartButton_${product._id || product.id}" onclick="addProductToCart('${product._id || product.id}')">Agregar al carrito</button>
    </div>`;
})

socket.on('producto_modificado_inventario', (data) => {
    const product = JSON.parse(data);

    const productContainer = document.getElementById(`prod-${product._id || product.id}`);

    productContainer.innerHTML = 
    `<ul>
        <li> Nombre: ${product.title}
            <ul> 
                <li> Id: ${product._id || product.id} </li>
                <li> Descripción: ${product.description} </li>
                <li> Precio: ${product.price} </li>
                <li> Imágenes: ${product.thumbnail} </li>
                <li> Código: ${product.code} </li>
                <li> Stock: ${product.stock} </li>
                <li> Categotría: ${product.category} </li>
            </ul>
        </li>
    </ul>
    <button style="margin: 0px 0px 20px 20px" class="addToCartButton" id="addToCartButton_${product._id || product.id}" onclick="addProductToCart('${product._id || product.id}')">Agregar al carrito</button>`;
})

socket.on('producto_eliminado_inventario', (data) => {
    const product = JSON.parse(data);

    const productContainer = document.getElementById(`prod-${product._id || product.id}`);

    productsContainer.removeChild(productContainer);
})

const authToken = localStorage.getItem('authToken');
const fetchOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    }
}

const addProductToCart = (prodId) => {
    fetch(`/api/sessions`, fetchOptions)
    .then (res => res.json())
    .then (user => {
        if (user.cartId === undefined){       
            alert('Inicie sesión para agregar productos al carrito.');

            window.location.href = '/login';
        } else {
            fetch(`/api/carts/${user.cartId}/products/${prodId}`, {
            method: 'PUT'
            })

            alert('Producto agregado al carrito.');
        }
    })
    .catch (e => console.log(e))
}

const logout = () => {
    fetch(`/api/sessions`, fetchOptions)
    .then (res => res.json())
    .then (user => {
        localStorage.removeItem('authToken')
    
        fetch(`/api/carts/${user.cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
    })
    .then (() => location.assign('/login')) 
    .catch (e => console.log(e))
}
const socket = io();

(() => {
    const authToken = localStorage.getItem('authToken');
    const titleName = document.getElementById('titleName');

    if (authToken) {
        fetch(`api/sessions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(res => res.json())
        .then(user => {
            titleName.innerHTML = 
            `<h1>Bienvenid@ ${user.name}</h1>
                
            <div style="display: flex; align-items: center">
                <button style="padding: 5px; margin: 0px 5px" class="seeCartButton" id="seeCartButton_${user.cartId}"><a href="/carts/${user.cartId}">Ver carrito de compras</a></button>
        
                <button style="padding: 5px; margin: 0px 5px" class="logoutButton" onclick="logout('${user.cartId}')"><a href="/products">Cerrar sesión</a></button>
            </div>`;
        })
        .catch (e => console.log(e))
    }
})()

socket.on('nuevo_producto', (data) => {
    const product = JSON.parse(data);

    const productsContainer = document.getElementById('productsContainer');

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
        <button style="margin: 0px 0px 20px 20px" class="addToCartButton" id="addToCartButton_${product._id || product.id}" onclick="addProduct('${product._id || product.id}')">Agregar al carrito</button>
    </div>`;
})

socket.on('producto_modificado', (data) => {
    const product = JSON.parse(data);

    const updatedProduct = document.getElementById(`prod-${product._id || product.id}`);

    updatedProduct.innerHTML = 
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
    <button style="margin: 0px 0px 20px 20px" class="addToCartButton" id="addToCartButton_${product._id || product.id}" onclick="addProduct('${product._id || product.id}')">Agregar al carrito</button>`;
})

const fetchOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
}

const addProduct = (prodId) => {
    fetch(`/api/sessions`, fetchOptions)
    .then (res => res.json())
    .then (user => {
        if (user.cartId === undefined){       
            alert('Inicie sesión para agregar productos al carrito.');

            location.assign('/login');
        } else {
            fetch(`/api/carts/${user.cartId}/products/${prodId}`, {
            method: 'PUT',
            })

            alert('Producto agregado al carrito.');
        }
    })
    .catch (e => console.log(e))
}

const logout = (cartId) => {
    fetch(`/api/sessions`, fetchOptions)
    .then (res => res.json())
    .then (() => {
        localStorage.removeItem('authToken')
    
        fetch(`/api/carts/${cartId}`, {
            method: 'DELETE',
            })
    })
    .then (() => location.assign('/login')) 
    .catch (e => console.log(e))
}
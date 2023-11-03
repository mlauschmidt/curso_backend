const socket = io();

const productsContainer = document.getElementById('productsContainer');
const idInput = document.getElementById('productId');
const titleInput = document.getElementById('productTitle');
const descriptionInput = document.getElementById('productDescription');
const priceInput = document.getElementById('productPrice');
const thumbnailInput = document.getElementById('productThumbnail');
const codeInput = document.getElementById('productCode');
const stockInput = document.getElementById('productStock');
const categoryInput = document.getElementById('productCategory');
const sendProductButton = document.getElementById('sendProductButton');

sendProductButton.addEventListener('click', (e) => {
    e.preventDefault();

    const title = titleInput.value;
    const description = descriptionInput.value;
    const price = priceInput.value;
    const thumbnail = thumbnailInput.value;
    const code = codeInput.value;
    const stock = stockInput.value;
    const category = categoryInput.value;

    fetch('api/products', {
        method: 'POST',
        body: JSON.stringify({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
    .then(res => res.json())
    .then(() => alert('Producto agregado al inventario.'))
    .catch (e => console.log(e))

})

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
        <button style="margin: 0px 0px 20px 20px" class="deleteProdList" id="deleteProdList_${product._id || product.id}" onclick="deleteProdList('${product._id || product.id}')">Eliminar</button>
        <button style="margin: 0px 0px 20px 20px" class="updateProdButton" id="updateProdButton_${product._id || product.id}" onclick="updateProdButton('${product._id || product.id}')">Editar</button>
    </div>`;
})

const updateProdButton = (prodId) => {
    fetch(`/api/products/${prodId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
    .then (res => res.json())
    .then (product => {
        const productContainer = document.getElementById(`prod-${product._id || product.id}`);

        productContainer.innerHTML =
        `<ul>
            <li>Nombre: <input id="newProductTitle" type="text" name="title" value="${product.title}">
                <ul>
                    <li>Id: <input id="newProductId" type="text" name="id" value="${product._id}" readonly></li>
                    <li>Descripción: <input id="newProductDescription" type="text" name="description" value="${product.description}"></li>
                    <li>Precio: <input id="newProductPrice" type="text" name="price" value="${product.price}"></li>
                    <li>Imágenes: <input id="newProductThumbnail" type="text" name="thumbnail" value="${product.thumbnail}"></li>
                    <li>Código: <input id="newProductCode" type="text" name="code" value="${product.code}"></li>
                    <li>Stock: <input id="newProductStock" type="text" name="stock" value="${product.stock}"></li>
                    <li>Categotría: <input id="newProductCategory" type="text" name="category" value="${product.category}"></li>
                </ul>
            </li>
        </ul>
        <button style="margin: 0px 0px 20px 20px" id="sendChangesButton" type="submit">Guardar cambios</button>`
    })
    .then (() => {
        const idInput = document.getElementById('newProductId');
        const titleInput = document.getElementById('newProductTitle');
        const descriptionInput = document.getElementById('newProductDescription');
        const priceInput = document.getElementById('newProductPrice');
        const thumbnailInput = document.getElementById('newProductThumbnail');
        const codeInput = document.getElementById('newProductCode');
        const stockInput = document.getElementById('newProductStock');
        const categoryInput = document.getElementById('newProductCategory');
        const sendChangesButton = document.getElementById('sendChangesButton');
        
        sendChangesButton.addEventListener('click', (e) => {
            e.preventDefault();

            const _id = idInput.value;
            const title = titleInput.value;
            const description = descriptionInput.value;
            const price = priceInput.value;
            const thumbnail = thumbnailInput.value;
            const code = codeInput.value;
            const stock = stockInput.value;
            const category = categoryInput.value;

            fetch(`/api/products/${_id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    category
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => res.json())
            .then(() => alert('Producto modificado.'))
            .catch (e => console.log(e))
        })
    })
}

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
    <button style="margin: 0px 0px 20px 20px" class="deleteProdList" id="deleteProdList_${product._id || product.id}" onclick="deleteProdList('${product._id || product.id}')">Eliminar</button>
    <button style="margin: 0px 0px 20px 20px" class="updateProdButton" id="updateProdButton_${product._id || product.id}" onclick="updateProdButton('${product._id || product.id}')">Editar</button>`
})

const deleteProdList = (prodId) => {
    fetch(`/api/products/${prodId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
}

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

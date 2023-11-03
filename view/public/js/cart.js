const socket = io();

const cartContainer = document.getElementById('cartContainer');

socket.on('producto_agregado_carrito', (data) => {
    const product = JSON.parse(data);

    const updatedProduct = document.getElementById(`prod-${product.product._id || product.product.id}`);

    if (updatedProduct){
        updatedProduct.innerHTML = 
        `<td>${product.product.title}</td>
        <td>${product.product.price}</td>
        <td>${product.quantity}</td>
        <td><button style="margin: 10px" class="deleteProdCart" id="deleteProdCart_${product.product._id || product.product.id}" onclick="deleteProdCart('${product.cartId}','${product.product._id || product.product.id}')">Eliminar</button></td>`;
    } else {
        cartContainer.innerHTML += 
        `<tr id="prod-${product.product._id || product.product.id}">
            <td>${product.product.title}</td>
            <td>${product.product.price}</td>
            <td>${product.quantity}</td>
            <td><button style="margin: 10px" class="deleteProdCart" id="deleteProdCart_${product.product._id || product.product.id}" onclick="deleteProdCart('${product.cartId}','${product.product._id || product.product.id}')">Eliminar</button></td>
        </tr>`;
    }
})

const deleteProdCart = (cartId, prodId) => {
    fetch(`/api/carts/${cartId}/products/${prodId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
}

socket.on('producto_eliminado_carrito', (data) => {
    const product = JSON.parse(data);

    const prodId = document.getElementById(`prod-${product._id || product.id}`);

    cartContainer.removeChild(prodId);
})


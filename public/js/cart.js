const socket = io();

const cartContainer = document.getElementById('cartContainer');

socket.on('carrito_actualizado', (data) => {
    const product = JSON.parse(data);
    console.log(product);

    const updatedProduct = document.getElementById(`prod-${product.product._id || product.product.id}`);

    if (updatedProduct){
        updatedProduct.innerHTML = 
        `<td>${product.product.title}</td>
        <td>${product.product.price}</td>
        <td>${product.quantity}</td>
        <td><button style="margin: 10px" class="deleteButton" id="deleteButton_${product.product._id || product.product.id}" onclick="deleteProduct('${product.cartId}','${product.product._id || product.product.id}')">Eliminar</button></td>`;
    } else {
        cartContainer.innerHTML += 
        `<tr id="prod-${product.product._id || product.product.id}">
            <td>${product.product.title}</td>
            <td>${product.product.price}</td>
            <td>${product.quantity}</td>
            <td><button style="margin: 10px" class="deleteButton" id="deleteButton_${product.product._id || product.product.id}" onclick="deleteProduct('${product.cartId}','${product.product._id || product.product.id}')">Eliminar</button></td>
        </tr>`;
    }
})

const deleteProduct = (cartId, prodId) => {
    fetch(`/api/carts/${cartId}/products/${prodId}`, {
        method: 'DELETE',
    })
}

socket.on('producto_eliminado', (data) => {
    const product = JSON.parse(data);

    const prodId = document.getElementById(`prod-${product._id || product.id}`);

    cartContainer.removeChild(prodId);
})


const socket = io();

const cartContainer = document.getElementById('cartContainer');
const newTotal = document.getElementById('totalCart');

socket.on('producto_agregado_carrito', (data) => {
    const newData = JSON.parse(data);
    const product = newData.product;

    const updatedProduct = document.getElementById(`prod-${product.id}`);

    if (updatedProduct){
        updatedProduct.innerHTML = 
        `<td>${product.title}</td>
        <td>$ ${product.price}</td>
        <td>${newData.quantity}</td>
        <td>$ ${newData.subtotal}</td>
        <td><button style="margin: 10px" class="deleteProdCart" id="deleteProdCart_${product.id}" onclick="deleteProdCart('${newData.cartId}','${product.id}')">Eliminar</button></td>`;
    } else {
        cartContainer.innerHTML += 
        `<tr id="prod-${product.id}">
            <td>${product.title}</td>
            <td>$ ${product.price}</td>
            <td>${newData.quantity}</td>
            <td>$ ${newData.subtotal}</td>
            <td><button style="margin: 10px" class="deleteProdCart" id="deleteProdCart_${product.id}" onclick="deleteProdCart('${newData.cartId}','${product.id}')">Eliminar</button></td>
        </tr>`;
    }

    newTotal.innerHTML = 
        `<td>TOTAL</td>
        <td></td>
        <td></td>
        <td>$ ${newData.newTotal}</td>`;
})

const deleteProdCart = (cartId, prodId) => {
    fetch(`/api/carts/${cartId}/products/${prodId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .catch (e => console.log(e))
}

socket.on('producto_eliminado_carrito', (data) => {
    const newData = JSON.parse(data);
    const product = newData.product;
    const total = newData.newTotal;

    const prodId = document.getElementById(`prod-${product.id}`);
    cartContainer.removeChild(prodId);

    newTotal.innerHTML = 
        `<td>TOTAL</td>
        <td></td>
        <td></td>
        <td>$ ${total}</td>`;
})

const purchase = () => {
    fetch('/api/sessions/current', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })  
    .then(res => res.json())
    .then(user => {
        fetch(`/api/carts/${user.cartId}/purchase`, {
            method: 'POST',
            body: JSON.stringify({
                'purchaser': `${user.email}`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })  
        .then(res => res.json())
        .then(ticket => {
            window.location.href = `/carts/${user.cartId}/purchase/${ticket.id}`
        })
        .catch (e => console.log(e))
    })
    .catch (e => console.log(e))
}

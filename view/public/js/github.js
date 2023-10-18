const params = new URLSearchParams(window.location.search);
const token = params.get('token');
const cartId = params.get('cart');

(() => {
    if (token) {
       localStorage.setItem('authToken', token);

        window.location.href = `/products?cart=${cartId}` 
    }
})()


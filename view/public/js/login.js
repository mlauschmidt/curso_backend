const usernameInput = document.getElementById('usernameLogin');
const passwordInput = document.getElementById('passwordLogin');
const sendButtonLogin = document.getElementById('sendButtonLogin');

sendButtonLogin.addEventListener('click', (e) => {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;
  
    fetch('api/sessions/login', {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('authToken', data.token)

        window.location.href = `/products?cart=${data.cartId}`
    })
    .catch (e => console.log(e))
})
 

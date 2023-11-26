const usernameInput = document.getElementById('usernameLogin');
const passwordInput = document.getElementById('passwordLogin');
const sendButtonLogin = document.getElementById('sendButtonLogin');

sendButtonLogin.addEventListener('click', (e) => {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;
  
    fetch('/api/sessions/login', {
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
    .then(() => {
        fetch('/api/sessions/current', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })  
        .then(res => res.json())
        .then(user => {
            window.location.href = `/home/${user.id}`
        })
        .catch (e => console.log(e))
    })
    .catch (e => console.log(e))
})
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

(() => {
    if (token) {
       localStorage.setItem('authToken', token);

       fetch('api/sessions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })  
        .then(res => res.json())
        .then(user => {
            window.location.href = `/products?id=${user._id}`
        })
    }
})()


const token = localStorage.getItem('authToken');

(() => {
    if (token) {
       fetch('/api/sessions/current', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })  
        .then(res => res.json())
        .then(user => {
            window.location.href = `/home/${user.id}`
        })
        .catch (e => console.log(e))
    }
})()
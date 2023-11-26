(() => {
    fetch('/api/sessions/current', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })  
    .then(res => res.json())
    .then(user => {
        window.location.href = `/home/${user.id}`
    })
    .catch (e => console.log(e))
})()


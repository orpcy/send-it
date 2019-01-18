const login = event => {
  event.preventDefault();

  fetch('/api/v1/users/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  }).then(res => res.json())
    .then(res => {
      console.log(res);
      const error = document.querySelector('#error-msg');
      error.innerHTML = ''
      if (res.token) {
        fetch('/api/v1/me', {
            headers:{
                'Authorization': res.token,
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.role === 'member'){
                localStorage.setItem('token', res.token);
                localStorage.setItem('userId', res.userId);
                localStorage.setItem('firstname', data.first_name);
                window.location.href = "./userProfile.html";
                alert("logged in successfully!");
            } else {
                document.querySelector('#error-msg').innerHTML = 'Sorry, only a MEMBER can log in to this page';
            }
        })
        .catch(err => console.log('err occured', err));
    } else if (res.msg) {
        error.innerHTML = res.msg;
    } else {
        res.errors.forEach(err => {
            const errorElement = document.createElement('div');
            errorElement.innerHTML = `${err.param} ${err.msg}`;
            error.appendChild(errorElement);
        });
    }
}).catch(err => console.log('err occured', err));
}

document.getElementById('login-form').addEventListener('submit', login);
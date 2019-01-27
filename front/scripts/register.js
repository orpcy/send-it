const register = event => {
  event.preventDefault();

  fetch('/api/v1/users', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      first_name: document.getElementById('firstname').value,
      last_name: document.getElementById('lastname').value,
      email: document.getElementById('email').value,
      phone_no: document.getElementById('phone-no').value,
      password: document.getElementById('password').value
    })
  }).then(res => res.json())
    .then(res => {
      if (res.token) {
        fetch('/api/v1/me', {
          headers: {
            'Authorization': res.token,
          }
        }).then(res => res.json())
          .then(data => {
            if (data.role === 'member') {
              localStorage.setItem('token', res.token);
              localStorage.setItem('userId', res.userId);
              localStorage.setItem('firstname', data.first_name);
              window.location.href = "./userProfile.html";
              alert("Account created successfully!")
            }
          })
          .catch(err => console.log('err occured', err));
      } else if (res.msg) {
        toastr.error(res.msg);
      } else {
        res.errors.forEach(err => {
          toastr.error(`${err.param}: ${err.msg}`);
        });
      }
    }).catch(err => console.log('err occured', err));
}

document.getElementById('registration-form').addEventListener('submit', register);

//handling menu bar
$(document).ready(() => {
  $(".burger-nav").on("click", () => {
    $("header nav ul").toggleClass("open");
  });
});
document.getElementById('registration-form').addEventListener('submit', postData);

function postData(event) {
  event.preventDefault();

  let firstname = document.getElementById('firstname').value;
  let lastname = document.getElementById('lastname').value;
  let email = document.getElementById('email').value;
  let phone_no = document.getElementById('phone-no').value;
  let password = document.getElementById('password').value;

  fetch('http://localhost:8080/api/v1/users', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      first_name: firstname,
      last_name: lastname,
      email: email,
      phone_no: phone_no,
      password: password
    })
  }).then( res => res.json())
    .then( data => console.log(data))
    .catch( err => console.log('err occured', err));
}
const firstname = localStorage.getItem("firstname");
const userId = localStorage.getItem("userId");
const token = localStorage.getItem('token');

//preventing unauthorised users from accessing the page
if(!token){
  window.location.href = './login.html';
}

document.querySelector("#nameBar").innerHTML = firstname.toUpperCase();

//handling request to cancel a specific parcel delivery order
const cancelOrder = event => {
  event.preventDefault();

  fetch("/api/v1/parcels/cancel", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      parcelId: document.getElementById("parcelId").value,
      user_id: userId
    })
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      const errorDiv = document.querySelector("#error-msg");
      errorDiv.innerHTML = "";
      if (res.details) {
        alert("Parcel Order cancelled successfully");
        window.location.href = "./userProfile.html";
      } else if (res.msg) {
        errorDiv.innerHTML = res.msg;
      } else {
        res.errors.forEach(err => {
          const errorElement = document.createElement("div");
          errorElement.innerHTML = `${err.param} ${err.msg}`;
          errorDiv.appendChild(errorElement);
        });
      }
    })
    .catch(err => console.log("error occured", err));
};

document.getElementById("edit-form").addEventListener("submit", cancelOrder);

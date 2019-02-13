//getting items stored into local storage during login and registration
const firstname = localStorage.getItem("firstname");
const token = localStorage.getItem('token');

//preventing unauthorised users from accessing the page
if(!token){
  window.location.href = './login.html';
}

//handling logout
const logout = document.getElementById('logout');

logout.addEventListener('click', function () {
  localStorage.clear();
  window.location.href = './login.html';
});


document.querySelector("#nameBar").innerHTML = firstname.toUpperCase();

//fetch request to render all user parcels into the table
const userId = localStorage.getItem("userId");
fetch(`https://send-it-backend.herokuapp.com/api/v1/users/${userId}/parcels`, {
  method: "GET",
  headers: {
    Authorization: token
  }
})
  .then(res => res.json())
  .then(data => {
    const ordersTable = document.querySelector(".parcelDetails");
    if (!data.length) {
      document.querySelector("#error-msg").innerHTML =
        "You do not have any Parcel Delivery Order yet";
    } else {
      data.sort((a, b) => a.id - b.id);
      renderTableData(data, ordersTable);

      document.getElementById("ordersLength").innerHTML = `${
        data.length
      }`;
      //Number of items in transit
      const transitOrders = data.filter(val => val.status === "in transit")
        .length;
      document.getElementById(
        "transit"
      ).innerHTML = `${transitOrders}`;
      //number of delivered items
      const delivered = data.filter(val => val.status === "delivered").length;
      document.getElementById(
        "delivered"
      ).innerHTML = `${delivered}`;
      //number of cancelled items
      const cancelled = data.filter(val => val.status === "cancelled").length;
      document.getElementById(
        "cancelled"
      ).innerHTML = `${cancelled}`;

      const dest = document.createElement('h2');
      dest.className = ('destinationh2');
      dest.innerHTML = `<a href="editDestination.html" id="changeDestination">Change Destination <i class="fas fa-edit"></i></a>`;
      document.getElementById('dashboard').append(dest);

      const cancel = document.createElement('h2');
      cancel.className = ('destinationh2');
      cancel.innerHTML = `<a href="./cancelOrder.html" id="changeDestination">Cancel Order <i class="fas fa-times"></i></a>`;
      document.getElementById('dashboard').append(cancel);
    }
  });

const renderTableData = (data, ordersTable) => {
  data.forEach(parcel => {
    let parcelRow = document.createElement("tr");
    parcelRow.innerHTML = `<th scope="row">${parcel.id}</th>
                          <td>${parcel.pickup_location}</td>
                          <td class="remove-second">${parcel.destination}</td>
                          <td>${parcel.recipient_name}</td>
                          <td>${parcel.recipient_phone_no}</td>
                          <td>${parcel.status}</td>
                           `;
    ordersTable.append(parcelRow);
  });
};

//handling menu bar
$(document).ready(() => {
  $(".burger-nav").on("click", () => {
    $("header nav ul").toggleClass("open");
  });
});
import React, { Component } from "react";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";

class Profile extends Component {
  state = {
    data: []
  };

  componentDidMount() {
    try {
      const jwt = localStorage.getItem("token");
      const user = jwtDecode(jwt);
      this.setState({ user });

      const userId = user.id;
      fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/${userId}/parcels`, {
        method: "GET",
        headers: {
          Authorization: jwt
        }
      })
        .then(res => res.json())
        .then(response => {
          if (response.msg) {
            const { msg } = response;
            this.setState({ msg });
          } else {
            response.sort((a, b) => a.id - b.id);
            this.setState({ data: response });
          }
        })
        .catch(err => console.log(err));
    } catch (ex) {
      this.props.history.push("/");
    }
  }

  handleCancel = parcel => {
    const jwt = localStorage.getItem("token");

    const userId = this.state.user.id;
    if (window.confirm("Are you sure you want to cancel parcel Order?")) {
      fetch(`${process.env.REACT_APP_API_URL}/api/v1/parcels/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: jwt,
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          parcelId: parcel,
          user_id: userId
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success === true) {
            window.location = "/profile";
            toast.success(data.msg);
          }
        })
        .catch(err => console.log(err));
    } else {
      this.props.history.push("/profile");
    }
  };

  handleEdit = parcel => {
    const jwt = localStorage.getItem("token");
    const userId = this.state.user.id;

    const destination = window.prompt("Enter new Destination address");

    fetch(`${process.env.REACT_APP_API_URL}/api/v1/parcels/destination`, {
      method: "PATCH",
      headers: {
        Authorization: jwt,
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        parcelId: parcel,
        destination: destination,
        user_id: userId
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          window.location = "/profile";
          toast.success(data.msg);
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="profile">
        <div className="card mb-4">
          <div className="card-header">Summary</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <h6>Number of orders: {this.state.data.length}</h6>
            </li>
            <li className="list-group-item">
              <h6>
                Orders in transit:{" "}
                {
                  this.state.data.filter(val => val.status === "in transit")
                    .length
                }
              </h6>
            </li>
            <li className="list-group-item">
              <h6>
                Delivered:{" "}
                {
                  this.state.data.filter(val => val.status === "delivered")
                    .length
                }
              </h6>
            </li>
            <li className="list-group-item">
              <h6>
                Cancelled Orders:{" "}
                {
                  this.state.data.filter(val => val.status === "cancelled")
                    .length
                }
              </h6>
            </li>
          </ul>
        </div>
        <table className="table table-responsive table-hover table-striped">
          <thead className="table-secondary">
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Pickup Location</th>
              <th scope="col">Destination</th>
              <th scope="col">Recipient Name</th>
              <th scope="col">Recipient Mobile Number</th>
              <th scope="col">Order Status</th>
              <th scope="col">Edit Destination</th>
              <th scope="col">Cancel Parcel Order</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.pickup_location}</td>
                <td>{item.destination}</td>
                <td>{item.recipient_name}</td>
                <td>{item.recipient_phone_no}</td>
                <td>{item.status}</td>
                <td className="text-center">
                  <button
                    onClick={() => this.handleEdit(item.id)}
                    className="btn btn-secondary p-1 pl-2"
                    disabled={item.status === "cancelled" ? true : false}
                  >
                    <i className="fas fa-edit" />
                  </button>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => this.handleCancel(item.id)}
                    className="btn btn-danger p-1"
                    disabled={item.status === "cancelled" ? true : false}
                  >
                    <i className="far fa-trash-alt" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h4 className="text-danger text-center">{this.state.msg}</h4>
      </div>
    );
  }
}

export default Profile;

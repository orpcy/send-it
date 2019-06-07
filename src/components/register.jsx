import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Register extends Component {
  state = {
    account: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      password: ""
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    const { firstname, lastname, email, mobile, password } = this.state.account;
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/users`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        first_name: firstname,
        last_name: lastname,
        email: email,
        phone_no: mobile,
        password: password
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          localStorage.setItem("token", res.token);

          window.location = "/profile";
          toast.success(res.msg);
        } else if (res.msg) {
          toast.error(res.msg);
        } else {
          res.errors.forEach(err => {
            toast.error(err.msg);
          });
        }
      })
      .catch(err => console.log(err));
  };

  handleChange = e => {
    const account = { ...this.state.account };
    account[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ account });
  };

  render() {
    const { firstname, lastname, email, mobile, password } = this.state.account;

    return (
      <form onSubmit={this.handleSubmit} className="registrationForm">
        <h1>Register</h1>
        <div className="form-group">
          <label htmlFor="firstname">Firstname</label>
          <input
            autoFocus
            value={firstname}
            onChange={this.handleChange}
            name="firstname"
            type="text"
            className="form-control"
            id="firstname"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Lastname</label>
          <input
            value={lastname}
            onChange={this.handleChange}
            name="lastname"
            type="text"
            className="form-control"
            id="lastname"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            value={email}
            onChange={this.handleChange}
            name="email"
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Mobile Number</label>
          <input
            value={mobile}
            onChange={this.handleChange}
            name="mobile"
            type="number"
            className="form-control"
            id="mobile"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={this.handleChange}
            name="password"
            type="password"
            className="form-control"
            id="password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <p className="mt-4 text-right">
          Already have an account?{" "}
          <Link className="btn btn-primary" to="/login">
            Login
          </Link>
        </p>
      </form>
    );
  }
}

export default Register;

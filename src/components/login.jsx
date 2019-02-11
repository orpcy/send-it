import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

class Login extends Component {
  state = {
    account: {
      email: "",
      password: ""
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    const { email, password } = this.state.account;
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);

          window.location = "/profile";
          toast.success(data.msg);
        } else if (data.msg) {
          toast.error(data.msg);
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
    const { email, password } = this.state.account;

    return (
      <form onSubmit={this.handleSubmit} className="loginForm">
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            autoFocus
            value={email}
            onChange={this.handleChange}
            name="email"
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
          <small id="emailHelp" className="form-text text-muted">
            Enter a valid email address
          </small>
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
            placeholder="Password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <p className="mt-4 text-right">
          Don't have an account?{" "}
          <Link className="btn btn-primary" to="/register">
            Sign Up
          </Link>
        </p>
      </form>
    );
  }
}

export default Login;

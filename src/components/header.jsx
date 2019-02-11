import React from "react";
import { Link, NavLink } from "react-router-dom";

const Header = props => {
  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark ">
      <Link className="navbar-brand" to="/">
        <img
          src="images/logo.png"
          className="img-fluid"
          width="180"
          height="60"
          alt="Header logo"
        />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          {!props.user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/">
                Home
              </NavLink>
              <NavLink className="nav-item nav-link" to="/register">
                Register
              </NavLink>
              <NavLink
                className="nav-item nav-link btn btn-outline-primary"
                to="/login"
              >
                Login
              </NavLink>
            </React.Fragment>
          )}
          {props.user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/profile">
                {props.user.first_name.toUpperCase()}
              </NavLink>
              <NavLink className="nav-item nav-link btn btn-secondary mr-1 ml-1 text-white" to="/createOrder">
                Create Order
              </NavLink>
              <NavLink
                className="nav-item nav-link btn btn-danger"
                to="/logout"
              >
                Logout
              </NavLink>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;

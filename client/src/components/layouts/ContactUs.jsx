import React, { Component } from "react";
import axios from "axios";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";
import contactUs from "../../assets/images/contactUs.png";

class ContactUs extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      message: "",
      error: "",
      success: false // Add success state
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: "",
      success: false // Reset success state on change
    });
  };

  submit = (e) => {
    e.preventDefault();
    let { name, email, message } = this.state;
    name = name.trim();
    email = email.trim();
    message = message.trim();
    if (name.length === 0 || email.length === 0 || message.length === 0) {
      this.setState({
        error: "Please enter all the fields.",
        success: false
      });
    } else {
      const contactMessage = {
        name,
        email,
        message,
      };
      axios.post("/api/email/contactUs", contactMessage)
        .then(() => {
          this.setState({
            name: "",
            email: "",
            message: "",
            success: true,
            error: ""
          });
          toast.notify("Successfully submitted your message", {
            position: "top-right",
          });
        })
        .catch((err) => {
          console.log(err);
          toast.notify("An error occurred while submitting your message", {
            position: "top-right",
          });
        });
    }
  };

  render() {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <img className="loginSVG" src={contactUs} alt="" />
          </div>
          <div className="col">
            <form className="addEmpForm" onSubmit={this.submit}>
              <h1 className="text-center">Contact Us</h1>
              {this.state.error && (
                <div className="alert alert-danger">{this.state.error}</div>
              )}
              {this.state.success && (
                <div className="alert alert-success">
                  Successfully submitted your message!
                </div>
              )}
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={this.state.name}
                  onChange={this.onChange}
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={this.state.email}
                  className="form-control"
                  id="email"
                  onChange={this.onChange}
                  name="email"
                  placeholder="example@example.com"
                />
              </div>
              <div className="form-group">
                <label>Your message/suggestion</label>
                <textarea
                  className="form-control"
                  value={this.state.message}
                  onChange={this.onChange}
                  id="message"
                  name="message"
                  rows="3"
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={this.state.success} // Disable button on success
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ContactUs;

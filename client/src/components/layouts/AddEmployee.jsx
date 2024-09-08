import React, { Component } from "react";
import { Consumer } from "../../context";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Spring } from "react-spring/renderprops";
import "../../assets/add-emp/addEmp.css";
import AdminSidePanel from "./Admin/AdminSidePanel";
import toast from "toasted-notes";
import "toasted-notes/src/styles.css";

class AddEmployee extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      name: "",
      address: "",
      phoneNo: "",
      role: "Select Role",
      team: "Select Team",
      gender: "Select Value",
      doj: "",
      disabled: false,

      // error
      error: "",

      // teams and roels
      teamList: [],
      roleList: [],
    };
  }

  componentDidMount = async () => {
    try {
      const teamAndRoleList = await axios.get("/api/admin/getTeamsAndRoles");
      if (teamAndRoleList.data && teamAndRoleList.data.length > 0) {
        this.setState({
          teamList: teamAndRoleList.data[0].teamNames || [],
          roleList: teamAndRoleList.data[0].roleNames || [],
        });
      } else {
        console.error("No team and role data found in the response.");
      }
    } catch (error) {
      console.error("Error fetching teams and roles:", error);
    }
  };

  onSelectGender = (gender) => this.setState({ gender });

  onTeamSelect = (team) => this.setState({ team });

  onRoleSelect = (role) => this.setState({ role });

  onSubmit = async (dispatch, e) => {
    e.preventDefault();

    // disable signup btn
    this.setState({
      disabled: true,
    });

    const {
      email,
      name,
      address,
      phoneNo,
      role,
      team,
      doj,
      gender,
    } = this.state;

    try {
      const newUser = await axios.post("/api/admin/addEmployee", {
        email,
        name,
        address,
        gender,
        phoneNo,
        role,
        team,
        doj,
      });

      toast.notify("Added new employee", {
        position: "top-right",
      });

      console.log("created acc successfully: ", newUser.data);
      this.props.history.push(`/editEmpProfile/${newUser.data._id}`);
    } catch (err) {
      // enable signup btn
      this.setState({
        disabled: false,
      });

      console.log("ERROR: ", err.response.data.msg);
      this.setState({ error: err.response.data.msg });
    }
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <Consumer>
        {(value) => {
          let { user, dispatch, token } = value;
          if (token === undefined) token = "";

          if (token) {
            if (user.role!== "admin") return <Redirect to="/" />;

            return (
              <Spring
                from={{
                  transform: "translate3d(1000px,0,0) ",
                }}
                to={{
                  transform: "translate3d(0px,0,0) ",
                }}
                config={{ friction: 20 }}
              >
                {(props) => (
                  <>
                    <div className="row m-0">
                      {/* left part */}
                      <div className="col-2  p-0 leftPart">
                        <AdminSidePanel />
                      </div>

                      {/* right part */}
                      <div
                        className="col"
                        style={{
                          display: "flex ",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <div style={props}>
                          {this.state.error? (
                            <div className="alert alert-danger my-3">
                              {this.state.error}
                            </div>
                          ) : null}

                          <form
                            className="addEmpForm"
                            onSubmit={this.onSubmit.bind(this, dispatch)}
                          >
                            <h3 className="">ADD EMPLOYEE</h3>
                            <hr />

                            <div className="row">
                              <div className="col">
                                {/* name */}
                                <label htmlFor="name">Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  placeholder="Joey Tribbiani"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* email */}
                                <label htmlFor="email">Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  className="form-control mb-3 "
                                  placeholder="joey@gmail.com"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                {/* address */}
                                <label htmlFor="address">Address</label>
                                <textarea
                                  name="address"
                                  id="address"
                                  // cols="30"
                                  rows="3"
                                  className="form-control"
                                  placeholder="1234 Main St"
                                  onChange={this.onChange}
                                  required
                                ></textarea>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                {/* phoneNo */}
                                <label htmlFor="phoneNo">Phone No</label>
                                <input
                                  type="text"
                                  name="phoneNo"
                                  className="form-control"
                                  placeholder="1234567890"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                              <div className="col">
                                {/* role */}
                                <label htmlFor="role">Role</label>
                                <select
                                  name="role"
                                  id="role"
                                  className="form-control"
                                  onChange={(e) =>
                                    this.onRoleSelect(e.target.value)
                                  }
                                  required
                                >
                                  <option value="Select Role">
                                    Select Role
                                  </option>
                                  {this.state.roleList.map((role, index) => (
                                    <option key={index} value={role}>
                                      {role}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                {/* team */}
                                <label htmlFor="team">Team</label>
                                <select
                                  name="team"
                                  id="team"
                                  className="form-control"
                                  onChange={(e) =>
                                    this.onTeamSelect(e.target.value)
                                  }
                                  required
                                >
                                  <option value="Select Team">
                                    Select Team
                                  </option>
                                  {this.state.teamList.map((team, index) => (
                                    <option key={index} value={team}>
                                      {team}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col">
                                {/* gender */}
                                <label htmlFor="gender">Gender</label>
                                <select
                                  name="gender"
                                  id="gender"
                                  className="form-control"
                                  onChange={(e) =>
                                    this.onSelectGender(e.target.value)
                                  }
                                  required
                                >
                                  <option value="Select Value">
                                    Select Value
                                  </option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                {/* doj */}
                                <label htmlFor="doj">Date of Joining</label>
                                <input
                                  type="date"
                                  name="doj"
                                  className="form-control"
                                  onChange={this.onChange}
                                  required
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="btn btn-primary btn-block mt-3"
                              disabled={this.state.disabled}
                            >
                              Submit
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Spring>
            );
          } else {
            return <Redirect to="/login" />;
          }
        }}
      </Consumer>
    );
  }
}

export default AddEmployee;
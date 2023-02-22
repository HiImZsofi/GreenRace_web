<<<<<<< HEAD
import React from "react";
import "./Pages.css";
import NavMenuLayout from "../components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import { UserPageDto } from "../Interfaces";
import NavMenu from "../components/NavBarLogic";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import { Console } from "console";

class UserPage extends React.Component<{}, UserPageDto> {
  constructor(props: any) {
    super(props);

    //Initalize state variables
    this.state = {
      username: "",
      picfilepath: "",
      points: 0,
      isLoggedIn: false,
    };
  }

  authenticationHandler() {
    const token = localStorage.getItem("key");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      withCredentials: true,
    };
    fetch("http://localhost:3001/userPage", requestOptions)
      .then(async (response) => {
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson && (await response.json());
        if (response.status === 200) {
          this.setState({ isLoggedIn: true });
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  componentDidMount(): void {
    this.authenticationHandler();
  }

  render(): React.ReactNode {
    if (this.state.isLoggedIn) {
      return (
        <div key={"userPage"}>
          <NavMenu username="" profilePicturePath="" />
          <div className="text-center mt-3">
            <div>
              <h1>
                10000 <span id="pont">Zöldpont</span>-od van
              </h1>
              <p>Ez 1000 szenyezésnek felel meg</p>
            </div>
            <div>
              <h6>Elért eredmények:</h6>
              <img
                alt="Achivements"
                src="achivement_placeholder.jpg"
                height="300vh="
                width="400vh="
                className="mb-3"
              />
            </div>
            <div>
              <h6>Statisztikáid:</h6>
              <img alt="Graph" src="graph-placeholder.jpg" className="mb-3" />
            </div>
          </div>
        </div>
      );
    } else {
      return <Navigate to="/login" replace={true} />;
    }
  }
=======
import React, {  } from 'react';
import './Pages.css';
import NavMenu from "../components/NavBar";
import "bootstrap/dist/css/bootstrap.css";
import { UserPageDto } from "../Interfaces";
import { Navigate } from "react-router-dom";


class UserPage extends React.Component<{}, UserPageDto> {
	constructor(props: any) {
		super(props);
		this.logoutHandler = this.logoutHandler.bind(this);
		//Initalize state variables
		this.state = {
			username: "",
			picfilepath: "",
			points: 0,
			//This can be set to true because it should only be on pages when you are logged in
			isLoggedIn: true,
		};
	}
	//Navbar Logout-Button's Onclick Function
	logoutHandler() {
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		};
		fetch("http://localhost:3001/logout", requestOptions)
			.then(async (response) => {
				const isJson = response.headers
					.get("content-type")
					?.includes("application/json");
				const data = isJson && (await response.json());
				if (response.status == 200) {
					this.setState({
						isLoggedIn: false,
					});
				}
			})

			.catch((error) => {
				console.error("There was an error!", error);
			});
	}
	//Loading In The Users Data
	loadInData(){
		fetch("http://localhost:3001/userPage")
		.then(async (response) => {
			const isJson = response.headers
				.get("content-type")
				?.includes("application/json");
			const data = isJson && (await response.json());
			console.log(data);
			this.setState({username: data.userdata.username});
			this.setState({picfilepath: data.userdata.picfilepath});
			this.setState({points: data.userdata.points});
		})
		.catch((error) => {
			console.error("There was an error!", error);
		});
	}
	componentDidMount(){
		this.loadInData()
	}
	//Rendering Page
    render(): React.ReactNode {
		if (!this.state.isLoggedIn) {
			return <Navigate to="/login" replace={true} />;
		} else {
		return (
			<div key={"userPage"}>
				<NavMenu username={this.state.username} picfilepath={this.state.picfilepath} logoutHandler={this.logoutHandler}/>
				<div className="text-center mt-3">
					<div>
						<h1>{this.state.points} <span id='pont'>Zöldpont</span>-od van</h1>
						<p>Ez 1000 szenyezésnek felel meg</p>
					</div>
					<div>
						<h6>Elért eredmények:</h6>
						<img
							alt="Achivements"
							src="achivement_placeholder.jpg"
							height="300vh="
							width="400vh="
							className="mb-3"
						/>
					</div>
					<div>
						<h6>Statisztikáid:</h6>
						<img alt="Graph" src="graph-placeholder.jpg" className="mb-3" />
					</div>
				</div>
			</div>
		);
	}}
>>>>>>> c27f71050e0adf49d2620e5936bac9b9db182ca5
}
export default UserPage;

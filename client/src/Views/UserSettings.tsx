import React from "react";
import { Navigate } from "react-router-dom";
import FormFileUpload from "../components/FormFileUpload";
import FormSubmitButton from "../components/FormSubmitButton";
import FormSwitch from "../components/FormSwitch";
import FormWrapper from "../components/FormWrapper";
import InputField from "../components/InputField";
import NavMenu from "../components/NavBarLogic";
import { UserSettingsDto } from "../Interfaces";

//TODO file input with link

class UserSettings extends React.Component<{}, UserSettingsDto> {
	constructor(props: any) {
		super(props);

		this.newUsernameOnChangeHandler =
			this.newUsernameOnChangeHandler.bind(this);
		this.newPasswordOnChangeHandler =
			this.newPasswordOnChangeHandler.bind(this);
		this.currentPasswordOnChangeHandler =
			this.currentPasswordOnChangeHandler.bind(this);
		this.onFileInputHandler = this.onFileInputHandler.bind(this);
		this.onSwitchClick = this.onSwitchClick.bind(this);
		this.saveHandler = this.saveHandler.bind(this);
		this.cancelHandler = this.cancelHandler.bind(this);

		this.state = {
			newUsername: "",
			newUsernameErr: false,
			newUsernameErrMsg: "",
			newPassword: "",
			newPasswordErr: false,
			newPasswordErrMsg: "",
			currentPassword: "",
			currentPasswordErr: false,
			currentPasswordErrMsg: "",
			profilePicturePath: "",
			darkTheme: false,
			isRedirected: false,
		};
	}

	newUsernameOnChangeHandler(e: React.SyntheticEvent<HTMLInputElement>) {
		this.setState({
			newUsername: e.currentTarget.value,
		});
	}
	newPasswordOnChangeHandler(e: React.SyntheticEvent<HTMLInputElement>) {
		this.setState({
			newPassword: e.currentTarget.value,
		});
	}
	currentPasswordOnChangeHandler(e: React.SyntheticEvent<HTMLInputElement>) {
		this.setState({
			currentPassword: e.currentTarget.value,
		});
	}

	onFileInputHandler(e: React.SyntheticEvent<HTMLInputElement>) {
		this.setState({ profilePicturePath: e.currentTarget.value });
	}

	onSwitchClick() {
		this.setState({ darkTheme: !this.state.darkTheme });
		console.log(this.state.darkTheme);
	}

	cancelHandler() {
		this.setState({ isRedirected: true });
	}

	saveHandler() {
		if (
			(this.state.currentPassword !== "" && this.state.newUsername !== "") ||
			this.state.newPassword !== ""
		) {
			this.setState({
				newUsernameErr: false,
				newUsernameErrMsg: "",
				newPasswordErr: false,
				newPasswordErrMsg: "",
				currentPasswordErr: false,
				currentPasswordErrMsg: "",
			});
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: localStorage.getItem("email"),
					newUsername: this.state.newUsername,
					newPassword: this.state.newPassword,
					currentPassword: this.state.currentPassword,
				}),
			};
			fetch("http://localhost:3001/settings", requestOptions)
				.then(async (response) => {
					const isJson = response.headers
						.get("content-type")
						?.includes("application/json");
					const data = isJson && (await response.json());

					//Check for server response
					if (response.status === 200) {
						//TODO Store dark theme option in a cookie
						this.setState({
							newUsernameErr: false,
							newUsernameErrMsg: "",
							newPasswordErr: false,
							newPasswordErrMsg: "",
							currentPasswordErr: false,
							currentPasswordErrMsg: "",
							isRedirected: true,
						});
					} else if (response.status === 500) {
						this.setState({
							currentPassword: "",
							currentPasswordErr: true,
							currentPasswordErrMsg: "Wrong password",
						});
					}
				})
				.catch((error) => {
					console.error("There was an error!", error);
				});
		} else {
			this.setState({
				currentPasswordErr: true,
				currentPasswordErrMsg: "This field is required to be filled in",
			});
			if (this.state.newUsername === "") {
				this.setState({
					newUsernameErr: true,
					newUsernameErrMsg: "This field is required to be filled in",
				});
			}
			if (this.state.newPassword === "") {
				this.setState({
					newPasswordErr: true,
					newPasswordErrMsg: "This field is required to be filled in",
				});
			}
		}
	}
	render(): React.ReactNode {
		if (this.state.isRedirected) {
			return <Navigate to={"/userPage"} replace={true} />;
		} else {
			return (
				//TODO NavBar with atributes
				<>
					<NavMenu username="" profilePicturePath="" />
					<FormWrapper vhnum="89vh">
						<InputField
							type={{
								inputType: "Username",
								placeholder: "New username",
								value: this.state.newUsername,
								onChangeHandler: this.newUsernameOnChangeHandler,
							}}
							error={this.state.newUsernameErr}
							errorMessage={this.state.newUsernameErrMsg}
						/>
						<InputField
							type={{
								inputType: "Password",
								placeholder: "New password",
								value: this.state.newPassword,
								onChangeHandler: this.newPasswordOnChangeHandler,
							}}
							error={this.state.newPasswordErr}
							errorMessage={this.state.newPasswordErrMsg}
						/>
						<InputField
							type={{
								inputType: "Password",
								placeholder: "Current password",
								value: this.state.currentPassword,
								onChangeHandler: this.currentPasswordOnChangeHandler,
							}}
							error={this.state.currentPasswordErr}
							errorMessage={this.state.currentPasswordErrMsg}
						/>
						<FormFileUpload
							path={this.state.profilePicturePath}
							onInputHandler={this.onFileInputHandler}
						/>
						<FormSwitch
							label="Dark theme"
							value={this.state.darkTheme}
							onClickHandler={this.onSwitchClick}
						/>
						<FormSubmitButton
							type={{ inputType: "Save" }}
							onClickHandler={this.saveHandler}
						/>
						<FormSubmitButton
							type={{ inputType: "Cancel" }}
							onClickHandler={this.cancelHandler}
						/>
					</FormWrapper>
				</>
			);
		}
	}
}

export default UserSettings;

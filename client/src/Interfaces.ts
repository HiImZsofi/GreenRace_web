//Interface used to handle state in the RegisterForm component
export interface UserRegisterDto {
	username: string;
	password: string;
	email: string;
	usernameErr: boolean;
	passwordErr: boolean;
	emailErr: boolean;
	usernameErrMsg: string;
	passwordErrMsg: string;
	emailErrMsg: string;
	registerSuccess: boolean;
}

//TODO Implement this interface in the Login component
export interface UserLoginDto {
	email: string;
	password: string;
	emailErr: boolean;
	passwordErr: boolean;
	emailErrMsg: string;
	passwordErrMsg: string;
	loginSuccess: boolean;
}

//Helps handle props when generating input fields
export interface InputTypeHandler {
	inputType: string;
	value?: string;
	onChangeHandler?: (e: any) => void;
}

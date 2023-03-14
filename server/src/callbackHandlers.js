//Imports
import {
	changePassword,
	changeUsername,
	getUserDataFromDB,
	getRankListFromDB,
	getPassWithIDQuery,
	getUserStatisticsFromDB,
	changeProfpic
} from "./queries.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//jwt token sign function
export function generateAccessToken(user_ID, email) {
	let secretKey = "secret"; //! move secret keys to dotenv
	return jwt.sign(
		{ user_id: user_ID, email: email },
		secretKey,
		{ algorithm: "HS256" },
		{
			expiresIn: "1h",
			issuer: "http://localhost:3001",
		}
	);
}

//User authorization
//Can be called in the callback of a route with the req and res params
export function authorizeUserGetRequest(req, res, type) {
	const header = req.headers["authorization"];

	//make sure if token header is not undefined
	if (header !== undefined) {
		const bearer = header.split(" "); //separate request token from bearer
		const token = bearer[1];
		req.token = token;
	} else {
		//if undefined return forbidden status code
		res.statusCode = 403;
	}
	//TODO use .decode to get the payload from the token
	//TODO so the id won't have to be sent to the frontend separately
	jwt.verify(
		req.token,
		"secret",
		{ algorithm: "HS256" },
		async (err, authorizedData) => {
			if (err) {
				res.sendStatus(403);
				console.log("403 Forbidden request");
			} else {
				switch (type) {
					case "user":
						authorizedData = await getUserDataFromDB(
							jwt.decode(req.token).user_id
						).catch(err => {throw err;});
						break;
					case "rank":
						authorizedData = await getRankListFromDB(
							jwt.decode(req.token).user_id
						);
						break;
					//TODO add friend case
					default:
						authorizedData = { error: "Wrong type" };
						break;
				}
				res.statusCode = 200;
				res.send(authorizedData);
				console.log("200 Successful request");
			}
		}
	);
}

//Converts the terrible typescript date format to something usable  
function formatDate(date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

//User Chart Data
export function getChartData(req, res, type) {
	const header = req.headers["authorization"];

	//make sure if token header is not undefined
	if (header !== undefined) {
		const bearer = header.split(" "); //separate request token from bearer
		const token = bearer[1];
		req.token = token;
	} else {
		//if undefined return forbidden status code
		res.statusCode = 403;
	}
	//TODO use .decode to get the payload from the token
	//TODO so the id won't have to be sent to the frontend separately
	jwt.verify(
		req.token,
		"secret",
		{ algorithm: "HS256" },
		async (err, authorizedData) => {
			if (err) {
				res.sendStatus(403);
				console.log("403 Forbidden request");
			} else {
				//Get the date of the last Monday
    			const today = new Date(); //Date of today
    			const dayOfWeek = (today.getDay() + 6) % 7; //How many day passed since last Monday
    			const MonDayDate = new Date(today.getTime() - dayOfWeek * 24 * 60 * 60 * 1000); // Date of last Monday
				//Get Data from database
				authorizedData = await getUserStatisticsFromDB(
					jwt.decode(req.token).user_id, MonDayDate,
				);// Return te Sum of points in the last week using User_Id and date of last Monday
				let datalist = [];
				if (authorizedData == null) {//Tests if Querry empty
					datalist = [0,0,0,0,0,0,0];//If empty sets every number to 0
				}else{	
				for(let i = 0; i < 7; i++) {//Loops through the days of the week
					let dayDate = formatDate(new Date(MonDayDate .getTime() + i * 24 * 60 * 60 * 1000));//Date of X day	
					datalist[i] = 0;//Sets default value to 0	
					authorizedData.forEach(data => {//Loops through the days in the database
						let dataDate = formatDate(new Date(data.date));//Date y from the database
						if(dayDate == dataDate) {datalist[i] = data.SUM;}//If date x and y the same set that day value for the value int the database
					});
				}
				}
				res.statusCode = 200;
				res.send(datalist);//Return a Number list for the Frontend
				console.log("200 Successful request");
			}
		}
	);
}

//Used when the save button is clicked on the settings page
export function saveSettings(req, res) {
	const { newUsername, newPassword, currentPassword } = req.body;
	const header = req.headers["authorization"];
	//make sure if token header is not undefined
	if (header !== undefined) {
		const bearer = header.split(" "); //separate request token from bearer
		const token = bearer[1];
		req.token = token;
	} else {
		//if undefined return forbidden status code
		res.statusCode = 403;
	}

	jwt.verify(req.token, "secret", { algorithm: "HS256" }, async (err) => {
		if (err) {
			res.sendStatus(403);
			console.log("403 Forbidden request");
		} else {
			const passwordInDB = await getPassWithIDQuery(
				jwt.decode(req.token).user_id
			).catch((error) => {
				res.statusCode = 404;
				console.log(404);
				res.send(JSON.stringify({ error: "Invalid email", response: error }));
			});
			//Only runs if both values are changed
			if (newUsername != "" && newPassword !== "") {
				bcrypt
					.compare(currentPassword, passwordInDB)
					.then(
						usernameAndPasswordChangeHandler(
							jwt.decode(req.token).user_id,
							newPassword,
							newUsername,
							res
						)
					);
			} //Change the password only
			else if (newPassword !== "") {
				bcrypt
					.compare(currentPassword, passwordInDB)
					.then(
						onlyPasswordChangeHandler(
							jwt.decode(req.token).user_id,
							newPassword,
							res
						)
					);
			} //Change username
			else if (newUsername !== "") {
				bcrypt
					.compare(currentPassword, passwordInDB)
					.then(
						onlyUsernameChangeHandler(
							jwt.decode(req.token).user_id,
							newUsername,
							res
						)
					);
			}
		}
	});
}

//Used when only the new username field is filled in
export function onlyUsernameChangeHandler(id, newUsername, res) {
	return async (compareRes, compareErr) => {
		if (compareErr) throw compareErr;
		if (compareRes) {
			try {
				await changeUsername(id, newUsername);
				res.statusCode = 200;
				res.send({ result: "Username updated" });
			} catch (error) {
				res.statusCode = 500;
				res.send({
					error: "Username",
					result: "Error updating the username",
				});
			}
		} else {
			res.statusCode = 500;
			res.send({
				error: "Password",
				result: "Wrong password",
			});
		}
	};
}


export function saveProfpic(req, res) {
	const { picfilepath } = req.body;
	const header = req.headers["authorization"];
	//make sure if token header is not undefined
	if (header !== undefined) {
		const bearer = header.split(" "); //separate request token from bearer
		const token = bearer[1];
		req.token = token;
	} else {
		//if undefined return forbidden status code
		res.statusCode = 403;
	}
	jwt.verify(req.token, "secret", { algorithm: "HS256" }, async (err) => {
		if (err) {
			res.sendStatus(403);
			console.log("403 Forbidden request");
		} else {
			const passwordInDB = await getPassWithIDQuery(
				jwt.decode(req.token).user_id
			).catch((error) => {
				res.statusCode = 404;
				console.log(404);
				res.send(JSON.stringify({ error: "Invalid email", response: error }));
			});
			if (picfilepath !== "") {
				try {
					await changeProfpic(jwt.decode(req.token).user_id, picfilepath);
					res.statusCode = 200;
					res.send({ result: "Profile picture updated" });
				} catch (error) {
					res.statusCode = 500;
					res.send({
						error: "Profile picture",
						result: "Error updating the Profile picture",
					});
				}
			}
		}
	});
}

//Used only when the new password field is filled
export function onlyPasswordChangeHandler(id, newPassword, res) {
	return async (compareRes, compareErr) => {
		if (compareErr) throw compareErr;
		if (compareRes) {
			let newEncryptedPassword = bcrypt.hashSync(newPassword, 10);
			try {
				await changePassword(id, newEncryptedPassword);
				res.statusCode = 200;
				res.send({ result: "Password updated" });
			} catch (error) {
				res.statusCode = 500;
				res.send({
					error: "NewPassword",
					result: "Error updating the password",
				});
			}
		} else {
			res.statusCode = 500;
			res.send({
				error: "Password",
				result: "Wrong password",
			});
		}
	};
}

//Used when both the new username and password fields are filled
export function usernameAndPasswordChangeHandler(
	id,
	newPassword,
	newUsername,
	res
) {
	return async (compareRes, compareErr) => {
		if (compareErr) throw compareErr;
		if (compareRes) {
			let newEncryptedPassword = bcrypt.hashSync(newPassword, 10);
			try {
				await changeUsername(id, newUsername);
				await changePassword(id, newEncryptedPassword);
				res.statusCode = 200;
				res.send({ result: "Username and password updated" });
			} catch (error) {
				res.statusCode = 500;
				res.send({
					error: "UsernamePassword",
					errorUsername: "Error updating the username",
					errorPassword: "Error updating the password",
				});
			}
		} else {
			res.statusCode = 500;
			res.send({
				error: "Password",
				result: "Wrong password",
			});
		}
	};
}

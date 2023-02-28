//checks if email already exists in database
export function checkEmailInDB(email) {
	return new Promise((resolve, reject) => {
		connection.query(
			"SELECT email FROM users WHERE email = ?",
			[email],
			function (err, result) {
				if (err || result.length === 0) {
					return reject(err); //if not then the query automatically moves on
				}
				return resolve(result[0].email); //if it exists then return the same email
			}
		);
	});
}

//own promise for sql query so async will not mess it up
export function insertNewUser(sql) {
	return new Promise((resolve, reject) => {
		connection.query(sql, function (err, result) {
			if (err) {
				return reject(err);
			}
			return resolve(200); //status code is 200 if insert was successful
		});
	});
}

//Query password from the users table in the database
export function getPassQuery(email) {
	return new Promise((resolve, rejects) => {
		connection.query(
			"SELECT password FROM users WHERE email = ?",
			[email],
			function (err, result) {
				if (err || result.length == 0) return rejects(err);
				return resolve(result[0].password);
			}
		);
	});
}

export function changePassword(email, password) {
	return new Promise((resolve, rejects) => {
		connection.query(
			"UPDATE users SET password = ? WHERE email = ?",
			[password, email],
			function (err, result) {
				if (err || result.length == 0) return rejects(err);
				return resolve(result);
			}
		);
	});
}

export function changeUsername(email, username) {
	return new Promise((resolve, rejects) => {
		connection.query(
			"UPDATE users SET username = ? WHERE email = ?",
			[username, email],
			function (err, result) {
				if (err || result.length == 0) return rejects(err);
				return resolve(result);
			}
		);
	});
}

export function getUserDataFromDB(user_ID) {
	return new Promise((resolve, rejects) => {
		connection.query(
			"SELECT username, picfilepath, points FROM users WHERE user_ID = ?",
			[user_ID],
			function (err, result) {
				if (err || result.length == 0) return rejects(err);
				return resolve(result[0]);
			}
		);
	});
}

export function getRangListFromDB() {
	return new Promise((resolve, rejects) => {
		connection.query(
			"SELECT username, points FROM users ORDER BY points DESC LIMIT 10",
			function (err, result) {
				if (err || result.length == 0) return rejects(err);
				return resolve(result);
			}
		);
	});
}

export function getIDFromDB(email) {
	return new Promise((resolve, rejects) => {
		connection.query(
			"SELECT user_ID FROM users WHERE email = ?",
			[email],
			function (err, result) {
				if (err || result.length == 0) return rejects(err);
				return resolve(result[0].user_ID);
			}
		);
	});
}

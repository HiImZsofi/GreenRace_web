//imports
import React, { useEffect, useState } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./Login";

function App() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch("http://localhost:3306/api")
			.then((response) => response.json())
			.then((data) => setData(data))
			.catch((error) => setError(error));
	}, []);

	const router = createBrowserRouter([
		{
			path: "/login",
			element: <LoginForm />,
		},
	]);

	return (
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	);
}


export default App;

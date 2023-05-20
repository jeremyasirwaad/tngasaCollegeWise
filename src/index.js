import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Navbar } from "./common/Navbar/Navbar";
import { Table } from "./pages/table/Table";
import { UserProvider } from "./context/user-context";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<div>
				<Navbar />
				<Login />
			</div>
		)
	},
	{
		path: "/table",
		element: (
			<div>
				<Navbar />
				<Table />
			</div>
		)
	}
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<UserProvider>
			<RouterProvider router={router} />
		</UserProvider>
	</React.StrictMode>
);

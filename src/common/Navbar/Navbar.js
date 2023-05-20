import React from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();

	return (
		<div className="navbar">
			<img
				style={{ cursor: "pointer" }}
				onClick={() => {
					navigate("/");
				}}
				src="https://upload.wikimedia.org/wikipedia/commons/8/81/TamilNadu_Logo.svg"
				alt=""
			/>
			<span
				style={{ cursor: "pointer" }}
				onClick={() => {
					navigate("/");
				}}
				className="datalogo"
			>
				TNGASA College Portal
			</span>
		</div>
	);
};

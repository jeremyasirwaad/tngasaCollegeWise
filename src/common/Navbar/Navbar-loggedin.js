import React, { useContext, useEffect } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import userContext from "../../context/user-context";
import { FiLogOut } from "react-icons/fi";
import clgocde_prici from "../../data/ccode_pno_map.json";

export const Navbar_loggedin = () => {
	const navigate = useNavigate();

	const { clgcode, setClgcode } = useContext(userContext);

	useEffect(() => {
		if (clgcode == 0) {
			navigate("/");
		}
	}, []);

	return (
		<div className="navbar2">
			<div className="loggedinnav-inner">
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
			<div className="loggedinnav-inner2">
				<span>
					{
						clgocde_prici.filter((data) => data.ccode.toString() === clgcode)[0]
							.cname
					}
				</span>
				<button
					className="logout-btn"
					onClick={() => {
						setClgcode(0);
						navigate("/");
					}}
				>
					Logout <FiLogOut />{" "}
				</button>
			</div>
		</div>
	);
};

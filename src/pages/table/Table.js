import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./Table.css";
import PulseLoader from "react-spinners/PulseLoader";
import { Table as Tableantd } from "antd";
import { CSVLink } from "react-csv";
import userContext from "../../context/user-context";
import ccode_branchmap from "../../data/seatmatrix.json";

export const Table = () => {
	const navigate = useNavigate();

	const { clgcode } = useContext(userContext);
	const [tabledata, setTabledata] = useState([]);
	const [bcode, setbcode] = useState("");
	const [isloading, setIsloading] = useState(false);
	const [isdatafetched, setIsdatafetched] = useState(false);

	console.log(clgcode);

	const options2 = ccode_branchmap.filter((data) => {
		return data.colCode == clgcode;
	});

	const options = [
		{ value: "ATTE1", label: "ATTE1" },
		{ value: "APAE1", label: "APAE1" },
		{ value: "SPHE1", label: "SPHE1" }
	];

	const columns = [
		{
			title: "Rank",
			dataIndex: "r1",
			key: "1"
		},
		{
			title: "RegNo",
			dataIndex: "_aid",
			key: "2"
		},
		{
			title: "Email",
			dataIndex: "e",
			key: "3"
		},
		{
			title: "Gender",
			dataIndex: "g",
			key: "4"
		},
		{
			title: "Community",
			dataIndex: "comm",
			key: "5"
		},
		{
			title: "Stream",
			dataIndex: "e",
			key: "6"
		},
		{
			title: "Aggregate Mark",
			dataIndex: "tot",
			key: "7"
		},
		{
			title: "Sub Stud",
			dataIndex: "psf",
			key: "8"
		},
		{
			title: "Mobile",
			dataIndex: "m",
			key: "9"
		},
		{
			title: "Alt Mobile",
			dataIndex: "alm",
			key: "10"
		}
	];

	const getdata = () => {
		setIsloading(true);
		fetch(`http://54.158.108.248/api/list?clgid=${clgcode}&bid=${bcode}`)
			.then((data) => data.json())
			.then((result) => {
				console.log(result.result);
				setIsloading(false);
				setIsdatafetched(true);
			});
	};

	// useEffect(() => {
	// 	if (clgcode == 0) {
	// 		navigate("/");
	// 	}
	// }, []);

	return (
		<div className="tablepage">
			<div className="tablebody">
				<div className="tableheader">
					<div className="tableheaderdata">Branch-wise Students Data</div>
					<div className="tableheaderunderliner"></div>
				</div>

				<div className="tableinput">
					<Select
						placeholder={"Select Branch Name"}
						className="tableselect"
						options={options2}
						onChange={(e) => {
							setbcode(e.value);
						}}
					/>
					<button
						style={{ marginLeft: "10px" }}
						onClick={() => {
							getdata();
						}}
					>
						Get Data
					</button>
					{isdatafetched && (
						<button
							style={{ marginLeft: "10px" }}
							onClick={() => {
								getdata();
							}}
						>
							<CSVLink
								style={{ textDecoration: "none", color: "white" }}
								data={tabledata}
							>
								Download as Excel
							</CSVLink>
						</button>
					)}
				</div>
			</div>

			{isloading ? (
				<div
					style={{
						width: "100%",
						marginTop: "70px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<PulseLoader color={"indigo"} size={25} />
				</div>
			) : (
				isdatafetched && <Tableantd dataSource={tabledata} columns={columns} />
			)}
		</div>
	);
};

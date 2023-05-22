import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./Table.css";
import PulseLoader from "react-spinners/PulseLoader";
import { Table as Tableantd } from "antd";
import { CSVLink } from "react-csv";
import userContext from "../../context/user-context";
import ccode_branchmap from "../../data/seatmatrix.json";
import sub_keymap from "../../data/subkey_map.json";
import { unparse as PapaUnparse } from "papaparse";

export const Table = () => {
	const navigate = useNavigate();

	const { clgcode } = useContext(userContext);
	const [tabledata, setTabledata] = useState([]);
	const [exceldownloaddata, setExceldownloaddata] = useState([]);
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

	const r1list = [
		"LTLT1",
		"LTLT2",
		"LTAT1",
		"LTAT2",
		"LMAE1",
		"LTET1",
		"LTET2",
		"LURE1",
		"LHDE1",
		"LSAE1"
	];

	const r2list = ["LENE1", "LENE1M", "LENE2"];

	const isr1 = (value) => {
		if (r1list.includes(value)) {
			return true;
		} else {
			return false;
		}
	};

	const isr2 = (value) => {
		if (r2list.includes(value)) {
			return true;
		} else {
			return false;
		}
	};

	const isr3 = (value) => {
		if (!r1list.includes(value) && !r2list.includes(value)) {
			return true;
		} else {
			return false;
		}
	};

	const sub_to_name = (sub_code) => {
		// console.log()

		var subname = sub_keymap.find(
			(data) => data.s_no.toString() == sub_code
		).sub_name;

		return subname;
	};

	const sub_to_name2 = (sub_code) => {
		// console.log()

		var subname = sub_keymap.find((data) => data.s_no.toString() == sub_code);

		if (subname === null || subname === undefined) {
			console.log(sub_code);
			return "No data";
		}

		return subname.sub_name;
	};

	const hg_to_data = (hg) => {
		if (hg == null || hg == 1) {
			return "Academic";
		} else {
			return "Vocational";
		}
	};

	const subs_to_data = (record) => {
		var subsstudied = "";
		if (record.s1 !== undefined && record.s1 !== null) {
			subsstudied = subsstudied + "1." + sub_to_name2(record.s1) + "\t";
		}
		if (record.s2 !== undefined && record.s2 !== null) {
			subsstudied = subsstudied + "2." + sub_to_name2(record.s2) + "\t";
		}
		if (record.s3 !== undefined && record.s3 !== null) {
			subsstudied = subsstudied + "3." + sub_to_name(record.s3) + "\t";
		}
		if (record.s4 !== undefined && record.s4 !== null) {
			subsstudied = subsstudied + "4." + sub_to_name2(record.s4) + "\t";
		}
		if (record.s5 !== undefined && record.s5 !== null) {
			subsstudied = subsstudied + "5." + sub_to_name2(record.s5) + "\t";
		}
		if (record.s6 !== undefined && record.s6 !== null) {
			subsstudied = subsstudied + "6." + sub_to_name2(record.s6) + "\t";
		}

		return subsstudied;
	};

	function removeDuplicates(array, key) {
		const seen = new Set();
		return array.filter((obj) => {
			const keyValue = obj[key];
			if (seen.has(keyValue)) {
				return false;
			}
			seen.add(keyValue);
			return true;
		});
	}

	const exdownload = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://54.158.108.248/api/ex?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				// Convert the fetched data to CSV format
				const csvData = data.result.map((item) => ({
					// Map the item properties to match your CSV columns

					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					Choice_Number: item.cno,
					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e
				}));

				const Delremcsvdata = removeDuplicates(csvData, "Admission_No");

				// Trigger the CSV download
				const csvDataString = PapaUnparse(Delremcsvdata);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_Ex_service.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const nccdownload = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://54.158.108.248/api/ncc?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				// Convert the fetched data to CSV format
				const csvData = data.result.map((item) => ({
					// Map the item properties to match your CSV columns

					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					Choice_Number: item.cno,
					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e
				}));
				const Delremcsvdata = removeDuplicates(csvData, "Admission_No");

				// Trigger the CSV download
				const csvDataString = PapaUnparse(Delremcsvdata);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_ncc.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const antsdownload = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://54.158.108.248/api/ants?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				// Convert the fetched data to CSV format
				const csvData = data.result.map((item) => ({
					// Map the item properties to match your CSV columns

					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					Choice_Number: item.cno,
					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e
				}));

				const Delremcsvdata = removeDuplicates(csvData, "Admission_No");

				// Trigger the CSV download
				const csvDataString = PapaUnparse(Delremcsvdata);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_andaman&nicobar.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const sportsdownload = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://54.158.108.248/api/sports?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				// Convert the fetched data to CSV format
				const csvData = data.result.map((item) => ({
					// Map the item properties to match your CSV columns

					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					Choice_Number: item.cno,
					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e
				}));

				const Delremcsvdata = removeDuplicates(csvData, "Admission_No");

				// Trigger the CSV download
				const csvDataString = PapaUnparse(Delremcsvdata);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_sports.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const dapdownload = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://54.158.108.248/api/ants?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				// Convert the fetched data to CSV format
				const csvData = data.result.map((item) => ({
					// Map the item properties to match your CSV columns

					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					Choice_Number: item.cno,
					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e
				}));

				const Delremcsvdata = removeDuplicates(csvData, "Admission_No");

				// Trigger the CSV download
				const csvDataString = PapaUnparse(Delremcsvdata);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_disabled.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const columns = [
		{
			title: "Rank",
			dataIndex: "rank",
			key: "12"
		},
		// {
		// 	title: "OgRank",
		// 	dataIndex: "ogrank",
		// 	key: "1"
		// },
		{
			title: "RegNo",
			dataIndex: "_aid",
			key: "2"
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "25"
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
			render: (id, record, index) => {
				if (record.hg == null || record.hg == 1) {
					return "Academic";
				} else {
					return "Vocational";
				}
			},
			key: "6"
		},
		{
			title: "Aggregate Mark",
			dataIndex: "agg",
			key: "7"
		},
		{
			title: "Sub Stud",
			render: (id, record, index) => {
				var subsstudied = "";
				if (record.s1 !== undefined || record.s1 !== null) {
					subsstudied = subsstudied + "1." + sub_to_name(record.s1) + "\t";
				}
				if (record.s2 !== undefined || record.s2 !== null) {
					subsstudied = subsstudied + "2." + sub_to_name(record.s2) + "\t";
				}
				if (record.s3 !== undefined || record.s3 !== null) {
					subsstudied = subsstudied + "3." + sub_to_name(record.s3) + "\t";
				}
				if (record.s4 !== undefined || record.s4 !== null) {
					subsstudied = subsstudied + "4." + sub_to_name(record.s4) + "\t";
				}
				if (record.s5 !== undefined || record.s5 !== null) {
					subsstudied = subsstudied + "5." + sub_to_name(record.s5) + "\t";
				}
				if (record.s6 !== undefined || record.s6 !== null) {
					subsstudied = subsstudied + "6." + sub_to_name(record.s6) + "\t";
				}

				return subsstudied;
			},
			key: "8"
		},
		{
			title: "Choice No",
			dataIndex: "cno",
			key: "26"
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
				// console.log(result.result);
				var tablepredata = result.result;
				var newArrayOfObj = [];
				if (isr1(bcode)) {
					newArrayOfObj = tablepredata.map(
						({ r1: ogrank, rks1: agg, ...rest }) => ({
							agg,
							ogrank,
							...rest
						})
					);
				}
				if (isr2(bcode)) {
					newArrayOfObj = tablepredata.map(
						({ r2: ogrank, rks2: agg, ...rest }) => ({
							agg,
							ogrank,
							...rest
						})
					);
				}
				if (isr3(bcode)) {
					newArrayOfObj = tablepredata.map(
						({ r3: ogrank, tot: agg, ...rest }) => ({
							agg,
							ogrank,
							...rest
						})
					);
				}

				// console.log(newArrayOfObj);

				var sorteddata = newArrayOfObj.sort((a, b) => {
					return parseInt(a.ogrank) - parseInt(b.ogrank);
				});

				console.log(sorteddata);

				sorteddata.map((value, index) => {
					value["rank"] = index + 1;
					delete value["ants"];
					delete value["dap"];
					delete value["ex"];
					delete value["ncc"];
					delete value["ogrank"];
					delete value["psf"];
					delete value["r1"];
					delete value["r2"];
					delete value["rno"];
					delete value["vsc"];
					delete value["_id"];
					return value;
				});

				var exceldata = [];

				sorteddata.map((data) => {
					var temp = {
						rank: data.rank,
						"Admission No": data._aid,
						Name: data.name,
						Gender: data.g,
						Community: data.comm,
						Stream: hg_to_data(data.hg),
						Agg_Mark: data.agg,
						Subjects_Studied: subs_to_data(data),
						Choice_Number: data.cno,
						Mobile: data.m,
						Alt_Mobile: data.alm,
						Email: data.e
					};

					exceldata.push(temp);
				});
				setExceldownloaddata(exceldata);
				setTabledata(sorteddata);
				setIsloading(false);
				setIsdatafetched(true);
			});
	};

	useEffect(() => {
		if (clgcode == 0) {
			navigate("/");
		}
	}, []);

	return (
		<div className="tablepage">
			<div className="tablebody">
				<div className="tableheader">
					<div className="tableheaderdata">Students Data</div>
					<div className="tableheaderunderliner"></div>
				</div>
				<div className="otherdownloadscont">
					<p>
						*Click on the buttons to download the student data list as Excel
					</p>
					<div className="otherdownloads">
						{/* hello */}

						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							data={exceldownloaddata}
						>
							Part 1 - Rank
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							data={exceldownloaddata}
						>
							Part 2 - Rank
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							data={exceldownloaddata}
						>
							Part 3 - Rank
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							onClick={() => {
								dapdownload();
							}}
						>
							differently abled
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							onClick={() => {
								sportsdownload();
							}}
						>
							Sports
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							// data={exdownload}
							onClick={() => {
								exdownload();
							}}
						>
							Ex-service
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							onClick={() => {
								nccdownload();
							}}
						>
							NCC
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							onClick={() => {
								antsdownload();
							}}
						>
							Andaman & Nicobar
						</button>
					</div>
				</div>
				<div className="tableinput">
					<Select
						placeholder={"Select Branch Name"}
						className="tableselect"
						options={options2}
						onChange={(e) => {
							setIsdatafetched(false);
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
								data={exceldownloaddata}
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

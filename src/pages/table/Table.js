import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./Table.css";
import PulseLoader from "react-spinners/PulseLoader";
import SyncLoader from "react-spinners/SyncLoader";
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
	const [downloadinflag, setDownloadinflag] = useState(false);
	const [isdatafetched, setIsdatafetched] = useState(false);

	console.log(clgcode);

	const options2 = ccode_branchmap.filter((data) => {
		return data.colCode == clgcode;
	});

	const DIFF_ABLED_TYPES = [
		{ key: "1", label: "Visually Impaired" },
		{ key: "2", label: "Hearing Impaired" },
		{ key: "3", label: "Locomotor disability" },
		{
			key: "4",
			label:
				"Autism / Intellectual disability / Specific learning disability / Mental illness"
		},
		{ key: "5", label: "Multiple Disability" }
	];

	const SPORTS_LEVEL_OF_PARTICIPATION = [
		{ key: "1", label: "District" },
		{ key: "2", label: "Divisional" },
		{ key: "3", label: "State" },
		{ key: "4", label: "National" },
		{ key: "5", label: "International" },
		{ key: "6", label: "None of the above" }
	];

	const SECURITY_FORCES_OPTS = [
		{ key: "1", label: "Widows/wards of Defense personnel killed in action" },
		{
			key: "2",
			label: "Wards of serving personnel and ex-servicemen disabled in action"
		},
		{
			key: "3",
			label:
				"Widows/Wards of Defense personnel who died in peace time with death attributable to Military service."
		},
		{
			key: "4",
			label:
				"Wards of Defense personnel disabled in peace time with disability attributable to military service"
		},
		{
			key: "5",
			label:
				"Wards of Ex-servicemen personnel and serving police forces who are in receipt of Gallantry Awards (Gallaniry Awards include : Paramvir Chakra, Ashok Chakra, SarvottamYudhSeva Medal, MahaVir Chakra, Kirti Chakra, UitamYudhseva Medal, Vir Chakra, Shaurya Chakra, Yudhseva Medal Sena,  Nausena-Vayusena Medal.)"
		},
		{
			key: "6",
			label: "President Police Medal for Gallantry' Police medal for Gallantry"
		},
		{ key: "7", label: "None of the Above" }
	];

	const dimention_changer = (list) => {
		console.log(list);
		const temp = removeDuplicates(list, "_aid");
		console.log(temp);
		temp.map((data) => {
			var choices = "";
			list.map((data2) => {
				if (data._aid === data2._aid) {
					choices = choices + " " + data2.bcode;
					console.log(data._aid);
				}
			});
			data["choice_list"] = choices;
			return data;
		});

		console.log(temp);

		return temp;
	};

	const diffid_to_name = (id) => {
		// console.log(id);
		const type = DIFF_ABLED_TYPES.find((data) => data.key === id);
		return type.label;
	};

	const sportid_to_name = (id) => {
		const type = SPORTS_LEVEL_OF_PARTICIPATION.find((data) => data.key === id);
		return type.label;
	};

	const security_forces_to_name = (id) => {
		const type = SECURITY_FORCES_OPTS.find((data) => data.key === id);
		return type.label;
	};

	const options = [
		{ value: "ATTE1", label: "ATTE1" },
		{ value: "APAE1", label: "APAE1" },
		{ value: "SPHE1", label: "SPHE1" }
	];

	const isadvanced = (data) => {
		var flag = false;
		if (
			data.s1 == "2" ||
			data.s2 == "2" ||
			data.s3 == "2" ||
			data.s4 == "2" ||
			data.s5 == "2" ||
			data.s6 == "2"
		) {
			flag = true;
		}

		if (data.s6 !== undefined || data.s6 !== null) {
			if (data.s6 == "2") {
				flag = true;
			}
		}

		return flag;
	};

	const istamilstudied = (data) => {
		var flag = false;
		if (
			data.s1 == "73" ||
			data.s2 == "73" ||
			data.s3 == "73" ||
			data.s4 == "73" ||
			data.s5 == "73" ||
			data.s6 == "73"
		) {
			flag = true;
		}

		if (data.s6 !== undefined || data.s6 !== null) {
			if (data.s6 == "74") {
				flag = true;
			}
		}

		return flag;
	};

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

	const tamil_list = ["LTLT1", "LTLT2", "LTAT1", "LTAT2"];

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

	const istamilbranch = (value) => {
		if (tamil_list.includes(value)) {
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
		fetch(`http://13.232.128.11/api/ex?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);

				const temp = dimention_changer(data.result);

				// Convert the fetched data to CSV format
				const csvData = temp.map((item) => ({
					// Map the item properties to match your CSV columns

					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e,
					Branch_choice: item.choice_list,
					DPI_Matched:
						item.df === null || item.df === undefined
							? "To Be Verified"
							: item.df
				}));

				// const Delremcsvdata = removeDuplicates(csvData, "Admission_No");

				// Trigger the CSV download
				const csvDataString = PapaUnparse(csvData);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_Ex_service.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
				setDownloadinflag(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const nccdownload = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://13.232.128.11/api/ncc?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);

				const temp = dimention_changer(data.result);

				// Convert the fetched data to CSV format
				const csvData = temp.map((item) => ({
					// Map the item properties to match your CSV columns

					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),

					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e,
					Branch_choice: item.choice_list,
					DPI_Matched:
						item.df === null || item.df === undefined
							? "To Be Verified"
							: item.df
				}));
				// const Delremcsvdata = removeDuplicates(csvData, "Admission_No");

				// Trigger the CSV download
				const csvDataString = PapaUnparse(csvData);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_ncc.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
				setDownloadinflag(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const antsdownload = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://13.232.128.11/api/ants?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				const dimention = dimention_changer(data.result);
				// Convert the fetched data to CSV format
				const csvData = dimention.map((item) => ({
					// Map the item properties to match your CSV columns

					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e,
					Branch_choice: item.choice_list,
					DPI_Matched:
						item.df === null || item.df === undefined
							? "To Be Verified"
							: item.df
				}));

				// const Delremcsvdata = removeDuplicates(csvData, "Admission_No");

				// Trigger the CSV download
				const csvDataString = PapaUnparse(csvData);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_andaman&nicobar.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
				setDownloadinflag(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const sportsdownload = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://13.232.128.11/api/sports?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);

				const temp1 = dimention_changer(data.result);

				// Convert the fetched data to CSV format
				const temp = temp1.filter((obj) => obj.slp !== "6");

				const csvData = temp.map((item) => ({
					// Map the item properties to match your CSV columns
					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					category: sportid_to_name(item.slp),

					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e,
					Branch_choice: item.choice_list,
					DPI_Matched:
						item.df === null || item.df === undefined
							? "To Be Verified"
							: item.df
				}));

				// const removekey6 = csvData.filter((obj) => obj.slp !== "6");

				// const Delremcsvdata = removeDuplicates(csvData, "Admission_No");

				// Trigger the CSV download
				const csvDataString = PapaUnparse(csvData);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_sports.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
				setDownloadinflag(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const dapdownload = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://13.232.128.11/api/dap?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				const temp = dimention_changer(data.result);

				// Convert the fetched data to CSV format
				const csvData = temp.map((item) => ({
					// Map the item properties to match your CSV columns

					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					category: diffid_to_name(item.adt),

					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e,
					Branch_choice: item.choice_list,
					DPI_Matched:
						item.df === null || item.df === undefined
							? "To Be Verified"
							: item.df
				}));

				// const Delremcsvdata = removeDuplicates(csvData, "Admission_No");

				// Trigger the CSV download
				const csvDataString = PapaUnparse(csvData);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_disabled.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
				setDownloadinflag(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const securityforcesdownload = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://13.232.128.11/api/secforce?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				const temp1 = dimention_changer(data.result);

				const temp = temp1.filter((obj) => obj.psf !== "7");

				// Convert the fetched data to CSV format
				const csvData = temp.map((item) => ({
					// Map the item properties to match your CSV columns

					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					category: security_forces_to_name(item.psf),
					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e,
					Branch_choice: item.choice_list,
					DPI_Matched:
						item.df === null || item.df === undefined
							? "To Be Verified"
							: item.df
				}));

				// const Delremcsvdata = removeDuplicates(csvData, "Admission_No");

				// Trigger the CSV download
				const csvDataString = PapaUnparse(csvData);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_securityforces.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
				setDownloadinflag(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const part1download = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://13.232.128.11/api/part?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);

				const newdata = removeDuplicates(data.result, "_aid");

				var sorteddata = newdata.sort((a, b) => {
					return parseInt(a.r1) - parseInt(b.r1);
				});

				sorteddata.map((value, index) => {
					value["rank"] = index + 1;
				});
				// Convert the fetched data to CSV format
				const csvData = sorteddata.map((item) => ({
					// Map the item properties to match your CSV columns

					rank: item.rank,
					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e,
					Aggregate_marks: item.rks1,
					DPI_Matched:
						item.df === null || item.df === undefined
							? "To Be Verified"
							: item.df
				}));

				// Trigger the CSV download
				const csvDataString = PapaUnparse(csvData);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_part1.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
				setDownloadinflag(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const part2download = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://13.232.128.11/api/part?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);

				const newdata = removeDuplicates(data.result, "_aid");

				var sorteddata = newdata.sort((a, b) => {
					return parseInt(a.r2) - parseInt(b.r2);
				});

				sorteddata.map((value, index) => {
					value["rank"] = index + 1;
				});
				// Convert the fetched data to CSV format
				const csvData = sorteddata.map((item) => ({
					// Map the item properties to match your CSV columns

					rank: item.rank,
					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e,
					Aggregate_marks: item.rks2
				}));

				// Trigger the CSV download
				const csvDataString = PapaUnparse(csvData);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_part2.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
				setDownloadinflag(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	const part3download = async () => {
		// Perform the fetch call to get the array of objects
		fetch(`http://13.232.128.11/api/part?clgid=${clgcode}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);

				const newdata = removeDuplicates(data.result, "_aid");

				var sorteddata = newdata.sort((a, b) => {
					return parseInt(a.r3) - parseInt(b.r3);
				});

				sorteddata.map((value, index) => {
					value["rank"] = index + 1;
				});
				// Convert the fetched data to CSV format
				const csvData = sorteddata.map((item) => ({
					// Map the item properties to match your CSV columns

					rank: item.rank,
					Admission_No: item._aid,
					Name: item.name,
					Gender: item.g,
					Community: item.comm,
					Stream: hg_to_data(item.hg),
					Subjects_Studied: subs_to_data(item),
					Mobile: item.m,
					Alt_Mobile: item.alm,
					Email: item.e,
					Aggregate_marks: item.rks3
				}));

				// Trigger the CSV download
				const csvDataString = PapaUnparse(csvData);
				const csvBlob = new Blob([csvDataString], { type: "text/csv" });
				const csvUrl = URL.createObjectURL(csvBlob);
				const link = document.createElement("a");
				link.href = csvUrl;
				link.download = `${clgcode}_part3.csv`;
				link.click();
				URL.revokeObjectURL(csvUrl);
				setDownloadinflag(false);
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
				if (record.s1 !== undefined && record.s1 !== null) {
					subsstudied = subsstudied + "1." + sub_to_name(record.s1) + "\t";
				}
				if (record.s2 !== undefined && record.s2 !== null) {
					subsstudied = subsstudied + "2." + sub_to_name(record.s2) + "\t";
				}
				if (record.s3 !== undefined && record.s3 !== null) {
					subsstudied = subsstudied + "3." + sub_to_name(record.s3) + "\t";
				}
				if (record.s4 !== undefined && record.s4 !== null) {
					subsstudied = subsstudied + "4." + sub_to_name(record.s4) + "\t";
				}
				if (record.s5 !== undefined && record.s5 !== null) {
					subsstudied = subsstudied + "5." + sub_to_name(record.s5) + "\t";
				}
				if (record.s6 !== undefined && record.s6 !== null) {
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
		fetch(`http://13.232.128.11/api/list?clgid=${clgcode}&bid=${bcode}`)
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

				var sorteddata = [];

				if (istamilbranch(bcode)) {
					console.log(newArrayOfObj);
					var advtamilstudents = newArrayOfObj.filter((data) =>
						isadvanced(data)
					);
					var nontamilsadvtudets = newArrayOfObj.filter((data) => {
						if (isadvanced(data)) {
							return false;
						} else {
							return true;
						}
					});

					var onlytamil = nontamilsadvtudets.filter((data) =>
						istamilstudied(data)
					);
					var notamilatall = nontamilsadvtudets.filter((data) => {
						if (istamilstudied(data)) {
							return false;
						} else {
							return true;
						}
					});

					var wholetamillist = [];

					var advtamilstudentssorted = advtamilstudents.sort((a, b) => {
						return parseInt(a.ogrank) - parseInt(b.ogrank);
					});

					var onlytamilsorted = onlytamil.sort((a, b) => {
						return parseInt(a.ogrank) - parseInt(b.ogrank);
					});

					var notamilatallsorted = notamilatall.sort((a, b) => {
						return parseInt(a.ogrank) - parseInt(b.ogrank);
					});

					var temp = wholetamillist.concat(advtamilstudentssorted);
					var temp1 = temp.concat(onlytamilsorted);
					var temp2 = temp1.concat(notamilatallsorted);

					sorteddata = temp2;
				} else {
					sorteddata = newArrayOfObj.sort((a, b) => {
						return parseInt(a.ogrank) - parseInt(b.ogrank);
					});
				}

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
			{downloadinflag && (
				<div className="loaderbody">
					<span className="downllading">Downloading Document</span>
					<SyncLoader color="indigo" size={20} />
				</div>
			)}

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
							onClick={() => {
								setDownloadinflag(true);
								part1download();
							}}
						>
							Part 1 - Rank
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							onClick={() => {
								setDownloadinflag(true);
								part2download();
							}}
						>
							Part 2 - Rank
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							onClick={() => {
								setDownloadinflag(true);
								part3download();
							}}
						>
							Part 3 - Rank
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							onClick={() => {
								setDownloadinflag(true);
								dapdownload();
							}}
						>
							differently abled
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							onClick={() => {
								setDownloadinflag(true);
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
								setDownloadinflag(true);
								exdownload();
							}}
						>
							Ex-service
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							onClick={() => {
								setDownloadinflag(true);
								nccdownload();
							}}
						>
							NCC
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							onClick={() => {
								setDownloadinflag(true);
								securityforcesdownload();
							}}
						>
							Security Forces
						</button>
						<button
							className="otherdownloadbtnlink"
							style={{ textDecoration: "none" }}
							onClick={() => {
								setDownloadinflag(true);
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
						<CSVLink
							filename={`${clgcode}_${bcode}`}
							data={exceldownloaddata}
							className="otherdownloadbtnlink2"
						>
							Download as Excel
						</CSVLink>
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

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
const collegedata = require("./model/collegedata-model");
const MongoClient = require("mongodb").MongoClient;

const url =
	"mongodb+srv://jeremy:jeremy4755@cluster1.cxfkdzp.mongodb.net/?retryWrites=true&w=majority";
const databasename = "tngasa";

app.get("/api", (req, res) => {
	res.send("TNGASA");
});

app.get("/api/list", async (req, res) => {
	const clgid = req.query.clgid;
	const branchid = req.query.bid;
	console.log(clgid, branchid);
	MongoClient.connect(url)
		.then((client) => {
			const connect = client.db(databasename);
			const collection = connect.collection("tngasa-college");

			collection
				.find({ bcode: branchid, ccode: parseInt(clgid) })
				.toArray()
				.then((ans) => {
					console.log(ans);
					res.json({ result: ans });
				});
		})
		.catch((err) => {
			// Printing the error message
			console.log(err.Message);
		});
});

app.listen(8080, () => {
	console.log("Port listening in 8080");
});

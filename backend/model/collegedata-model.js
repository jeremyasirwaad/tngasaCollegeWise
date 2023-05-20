const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const collegedataSchema = new Schema({
	_aid: {
		type: "Number"
	},
	m: {
		type: "String"
	},
	e: {
		type: "String"
	},
	alm: {
		type: "String"
	},
	g: {
		type: "String"
	},
	comm: {
		type: "String"
	},
	r1: {
		type: "Date"
	},
	r2: {
		type: "Date"
	},
	r3: {
		type: "Date"
	},
	tot: {
		type: "Date"
	},
	rno: {
		type: "String"
	},
	hg: {
		type: "Date"
	},
	psf: {
		type: "Date"
	},
	dap: {
		type: "String"
	},
	vsc: {
		type: "String"
	},
	ex: {
		type: "String"
	},
	ncc: {
		type: "String"
	},
	ants: {
		type: "String"
	},
	chid: {
		type: "ObjectId"
	},
	cname: {
		type: "String"
	},
	bname: {
		type: "String"
	},
	ccode: {
		type: "Number"
	},
	bcode: {
		type: "String"
	}
});

const collegedata = mongoose.model("tngasa-college", collegedataSchema);

module.exports = collegedata;

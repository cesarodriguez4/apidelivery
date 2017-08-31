var sqlCrud = require("../../");
var mysql = require("mysql");
var chai = require("chai");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'users'
});

describe("Mysql clauses", () => {
	describe("Select Clause", () => {
		var selectClause = require("../../mysql/clauses/select");
		it("should return => select a,c,b ", () => {
			chai.expect(selectClause('a,b,c')).to.equal(" SELECT a,b,c ");
		});
	});
	describe("Where Clause", () => {
		var whereClause = require("../../mysql/clauses/where");
		it("Should return =>  where `a`='foo', `b`='bar' ", () => {
			chai.expect(whereClause({a: 'foo', b: 'bar'}))
			.to.equal(" WHERE `a` = 'foo' AND `b` = 'bar' ");
		});
	});
	describe("from Clause", () => {
		var fromClause = require("../../mysql/clauses/from");
		it("Should return => from `mytable` ", () => {
			chai.expect(fromClause("mytable"))
			.to.equal(" FROM `mytable` ");
		});
	});
	describe("innerJoin Clause", () => {
		var innerjoinClause = require("../../mysql/clauses/innerJoin");
		it("Should return => INNER JOIN table2 ON table1.column_name = table2.column_name", () => {
			chai.expect(innerjoinClause({table: ['table1', 'table2'], on: ['table1.column_name','table2.column_name']}))
			.to.equal(" INNER JOIN table2 ON table1.column_name = table2.column_name ");
		});
	});
	describe("valuesInsert Clause", () => {
		var valuesInsertClause = require("../../mysql/clauses/valuesToInsert");
		it("Should return => => (`a`, `b`, `c`)", () => {
			chai.expect(valuesInsertClause({a:1,b:2,c:3}))
			.to.equal(" (`a`,`b`,`c`) ");
		});
	});
	describe("values Clause", () => {
		var valuesInsertClause = require("../../mysql/clauses/values");
		it("Should return => =>  VALUES ('1','2','3')  ", () => {
			chai.expect(valuesInsertClause({a:1,b:2,c:3}))
			.to.equal(" VALUES ('1','2','3') ");
		});
	});
	describe("insertInto Clause", () => {
		var insertIntoClause = require("../../mysql/clauses/insertInto");
		it("Should return => => INSERT INTO `users` ", () => {
			chai.expect(insertIntoClause("users"))
			.to.equal(" INSERT INTO `users` ");
		});
	});
	describe("set Clause", () => {
		var setClause = require('../../mysql/clauses/set');
		it("Should return -> SET `a` = 'b',`c` = 'd'", () => {
			chai.expect(setClause({a:'b', c:'d'}))
			.to.equal(" SET `a` = 'b',`c` = 'd' ");
		});
	});



});
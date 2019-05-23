const express = require('express');
const app = express();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:'QR'
  });

con.connect(function(err) {

    if (err) throw err;
    console.log("Connected!");

});

app.get('/api/code/:cod', (req, res)=>{
    console.log(req.param('cod'));
    var sql = `UPDATE codes SET status = 1 WHERE code = '${req.param("cod")}'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Number of records updated: " + result.affectedRows);
    });
});

app.listen(3000, (err)=>{
    if(err)throw err;
    else console.log('Server is running just fine');
})
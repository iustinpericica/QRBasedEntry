const express = require('express');
const app = express();
var mysql = require('mysql');
const cors = require('cors');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:'QR'
  });

  const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100'
  ];
  
  // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

con.connect(function(err) {

    if (err) throw err;
    console.log("Connected!");

});

app.get('/code/:cod', (req, res)=>{
    console.log(req.param('cod'));
    
    var sql = `SELECT * FROM codes WHERE code = '${req.param("cod")}'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        if(result){
            if(result[0].status == 0){
                console.log('Okei..');
                res.end("ok");
                var sql = `UPDATE codes SET status = 1 WHERE code = '${req.param("cod")}'`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records updated: " + result.affectedRows);
                });
        }
        else {
            res.end("used");
        }
                }
        else {
            res.end("wrong");
        }
    });
    

});

app.listen(3000, (err)=>{
    if(err)throw err;
    else console.log('Server is running just fine');
})
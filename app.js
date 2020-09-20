const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { type } = require('os');
const { json } = require('body-parser');
const { ENETDOWN } = require('constants');

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) { return val; }
  if (port >= 0) { return port; }
  return false;
}

const app = express();

app.use(cors({ credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(logger('dev'));
app.use('/public', express.static('public'));



var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

// Create connection to database
var config = {
  server: 'uenha-dfsql0004.database.windows.net',
  authentication: {
      type: 'default',
      options: {
          userName: 'capd_admin', // update me
          password: 'Password!@' // update me
      }
  },
  options: {
      database: 'CAPDMartQAGen2'
  }
}
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');
  }
});


app.use('/api/matches',(req,res)=>{
  var result = "";
  d = new Date(Date.now())

  var query = 'SELECT team1,team2 FROM dbo.matches where Mdate = \''+ d.toISOString().substring(0, 10)+'\';';
  console.log(query);
  request = new Request(
    query,
    function(err, rowCount, rows) {
    if (err) {
        console.log(err)
    } else {
        console.log(rowCount + ' row(s) returned');
        teams = result.split(" ");
        res.send({team1 : teams[0],team2 : teams[1]})
    }
    });
    
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        // result = "";
    });

    // Execute SQL statement
    connection.execSql(request);
    // res.send(result)
})



var  entries = []
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.get('/api/entries',(req,res) =>{
  res.send(entries);
})

app.post('/api/entries',(req,res) =>{
  var e = req.body;
  console.log(e,type(e));
  
  if (entries.some(item=>item.name == e.name)){
    console.log("Duplicate");
    const idx = entries.findIndex(item => item.name == e.name)
    console.log("Duplicate id ",idx);
    entries[idx] = e
  }else {
     entries.push(e); 
  }
  res.send(entries)
  
  // res.send(entries);
})

const port = normalizePort(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API listening on port: ${port}`);
});
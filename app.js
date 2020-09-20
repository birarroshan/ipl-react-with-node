const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { type } = require('os');
const { json } = require('body-parser');
const { ENETDOWN } = require('constants');
const { request } = require('express');
const { resolve } = require('path');

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
  server:    process.env.server_name,//'uenha-dfsql0004.database.windows.net',
  authentication: {
      type: 'default',
      options: {
          userName:  process.env.user_name,//'capd_admin', // update me
          password: process.env.password,//'Password!@' // update me
      }
  },
  options: {
      database: process.env.db_name
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

app.get('/api/players',(req,res)=>{

  var result = "";
  var queryPlayer = 'SELECT player FROM dbo.iplTest ;';
  console.log(queryPlayer);
  requestGetPlayer = new Request(
    queryPlayer,
    function(err, rowCount, rows) {
    if (err) {
        console.log(err)
         res.sendStatus(400)
        // reject()
    } 
    else {
        console.log(rowCount + ' row(s) returned');
        players = result.split(" ");
        players.forEach((player)=>{
          if(player!=""){
          if (entries.some(item=>item.name == player)){
            console.log("Duplicate");
            const idx = entries.findIndex(item => item.name == player)
            console.log("Duplicate id ",idx);
            entries[idx] = {name:player,team: entries[idx].team,score:0}
          }else {
             entries.push({name:player,team:"",score:0}); 
          }
        }
        })
        // resolve();

        res.send(entries);
     }
    }
  );
    
    requestGetPlayer.on('row', function(columns) {
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
    
    connection.execSql(requestGetPlayer);

})

var matchID = 3
app.get('/api/matches',(req,res)=>{
  var result = "";
  d = new Date(Date.now())
  
  var query = 'SELECT matchID,team1,team2 FROM dbo.matches where MatchID = \''+ matchID+'\';';
  console.log(query);
  requestGet = new Request(
    query,
    function(err, rowCount, rows) {
    if (err) {
        console.log(err)
        res.sendStatus(400)
    } else {
        console.log(rowCount + ' row(s) returned');
        teams = result.split(" ");
        // matchID = teams[0];

        res.send({team1 : teams[1],team2 : teams[2]});
    }
    });
    
    requestGet.on('row', function(columns) {
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
   
      connection.execSql(requestGet);
   
    
})



var  entries = []
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.get('/api/submit/:winner',(req,res)=>{
  // var query = 'INSER into matchscore values('+matchID+','','')'
  var win = req.params.winner
  var q2  = ""
  var tscore = 10*entries.length
  winners = 0;
  entries.forEach((item)=>{
   
     console.log("Item - ", item);
     if (item.team == win) {
      item.score = 10;
      winners = winners+1;
      q2 = q2 + 'INSERT INTO dbo.matchscore  VALUES (\''+matchID+'\', \''+item.name+'\',\'replace_this\');'
     }  else {
      q2 = q2 + 'INSERT INTO dbo.matchscore  VALUES (\''+matchID+'\', \''+item.name+'\',\'0\');'
     }
        
      })
      tscore =   tscore/(entries.length-winners);
      q2 = q2.replace(/replace_this/g, tscore.toString())

        console.log("INsert q ",q2)
        requestInsert = new Request(
          q2,
          function(err, rowCount, rows) {
          if (err) {
              console.log("Error");
              res.sendStatus(400)
          } else {
              console.log("Query executed");
              matchID = matchID+1
              res.send({result : "Query Executed"})
          }
          });
         connection.execSql(requestInsert);
    
  
})

app.get('/api/entries',(req,res) =>{
  res.send(entries);
})

app.post('/api/entries',(req,res) =>{
  var e = req.body;
  var query_requestInsertPlayer = ""
  console.log(e,type(e));
  
  if (entries.some(item=>item.name == e.name)){
    console.log("Duplicate");
    const idx = entries.findIndex(item => item.name == e.name)
    console.log("Duplicate id ",idx);
    entries[idx] = {name:e.name,team:e.team,score:0}
    res.send(entries)
    // query_requestInsertPlayer = 'UPDATE TABLE ma'
  }else {
     entries.push({name:e.name,team:e.team,score:0}); 
  

      requestInsertPlayer = new Request(
      'INSERT INTO iplTest values(\''+e.name +'\',0)',
      function(err, rowCount, rows) {
           if (err) {
                  console.log("Error");
                  res.sendStatus(400)
           } else {
                  console.log("Query executed");
                  res.send(entries)
        // res.send({result : "Query Executed"})
           }
      });
      connection.execSql(requestInsertPlayer);
  }
  
  
  // res.send(entries);
})

const port = normalizePort(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API listening on port: ${port}`);
});




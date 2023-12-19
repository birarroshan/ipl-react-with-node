/* eslint-disable no-undef */
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

// Create connection to database
var config = {
  server:    'iplserver.database.windows.net', // process.env.server_name,//
  authentication: {
      type: 'default',
      options: {
          userName:  'myadmin',//process.env.user_name,//'capd_admin', // update me
          password: 'A@12345678' //process.env.password,//'Password!@' // update me
      }
  },
  options: {
      database: 'backenddb_Copy' //process.env.db_name

  }
}

// const configms = {
//   user: 'myadmin',
//   password: 'A@12345678',
//   server: 'iplserver.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
//   database: 'backenddb_Copy',
// }


// sql.on('error', err => {
//   // ... error handler
//   console.log("This is error",err)
// })

// sql.connect(configms).then(pool => {
//   // Query
//   return pool.request()
//       //.input('input_parameter', sql.Int, 1)
//       .query('SELECT player,vote,score FROM dbo.iplTest order by score desc;')
// }).then(result => {
//   console.dir(result)
// }).catch(err => {
// // ... error checks
// });

var connection = new Connection(config);
connection.connect(function(err){
  if(err){
    console.log(err)
  } 
  console.log("Checking")
})

//Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log("Error while connecting to DB",err);
  } else {
    console.log("Successful connection");

  }
});

app.get('/api/players',(req,res)=>{

if(entries.length == 0){
  var result = "";
  var queryPlayer = 'SELECT player,vote,score FROM dbo.iplTest order by score desc;';
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
        // players.forEach((player,i,arr)=>{
        //   if(player!=""){
        //   if (entries.some(item=>item.name == player)){
        //     console.log("Duplicate");
        //     const idx = entries.findIndex(item => item.name == player)
        //     console.log("Duplicate id ",idx);
        //     entries[idx] = {name:player,team: arr[i+1],score:0}
        //   }else {
        //      entries.push({name:player,team:arr[i+1],score:0}); 
        //   }
        // }i++;
        // })
        entries = []
        for(let i = 0; i < players.length; i++){ 
          
          player = players[i]
          if(player !=""){
          console.log("Player and team",player,players[i+1],i)
          // if (entries.some(item=>item.name == player)){
          //   console.log("Duplicate");
          //   const idx = entries.findIndex(item => item.name == player)
          //   console.log("Duplicate id ",idx);
          //   entries[idx] = {name:player,team: players[i+1],score:0}
          // }else {
             entries.push({name:player,team:players[i+1],score:players[i+2]}); 
          // }
          i=i+2;
          }
        }
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
  }
  else res.send(entries)
})
// Dummy change

var matchID = parseInt("1")
var matchTeam1 = ""
var matchTeam2 = ""
app.get('/api/matches',(req,res)=>{
  if (matchTeam1 == "" ){
    var result = "";
    d = new Date(Date.now())
      
    var query = 'SELECT matchID,team1,team2 FROM dbo.matches where MatchID = \''+ matchID+'\';';
    console.log(query);
    // sql.connect(configms).then(pool => {
    //   // Query
    //   return sql.query(query)
    // }).then(result => {
    //   console.log(result)
    //   console.log("Match ID fetched",result.recordset[0].matchID)
    //   matchTeam1 = result.recordset[0].team1
    //   matchTeam2 = result.recordset[0].team2
    //   res.send({ matchID : matchID,team1 : matchTeam1,team2 :matchTeam2});
    // }).catch(err => {
    //  console.log("Error occuerred", err)
    // });
    requestGetM = new Request(
      query,
      function(err, rowCount, rows) {
      if (err) {
          console.log(err)
          res.sendStatus(400)
      } else {
          console.log(rowCount + ' row(s) returned');
          teams = result.split(" ");
          // matchID = teams[0];
           matchTeam1 = teams[1]
           matchTeam2 = teams[2]
          res.send({ matchID : matchID,team1 : matchTeam1,team2 :matchTeam2});
      }
      });
      
      requestGetM.on('row', function(columns) {
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
     
        connection.execSql(requestGetM);
 
  }else{
    res.send({ matchID : matchID,team1 : matchTeam1,team2 :matchTeam2});
  }
    
})



var  entries = []
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.get('/api/submit/:winner',(req,res)=>{
  // var query = 'INSER into matchscore values('+matchID+','','')'
  var scoreTotalProc = 'with sc as ( '+
    'select m.player as play,round(sum(m.score),2) as total from matchscore m ' +
    'inner join iplTest  p on p.player = m.player ' +
    'group by m.player)'+
    'MERGE iplTest t USING sc s '+
    'on t.player = s.play '+
    'WHEN MATCHED THEN Update set t.score = s.total;'
  var win = req.params.winner
  var q2  = ""
  var tscore = 10*entries.length
  winners = 0;
  entries.forEach((item)=>{
   
     console.log("Item - ", item);
     if (item.team == win) {
      item.score = 10;
      winners = winners+1;
      q2 = q2 + 'INSERT INTO dbo.matchscore  VALUES (\''+matchID+'\', \''+item.name+'\',\'replace_this\',\''+ item.team +'\');'
     }  else {
      q2 = q2 + 'INSERT INTO dbo.matchscore  VALUES (\''+matchID+'\', \''+item.name+'\',\'0\',\''+ item.team +'\');'
     }
        
      })
      tscore =   tscore/winners;
      q2 = q2.replace(/replace_this/g, tscore.toString())
      q2 = q2 + 'Update iplTest set vote = \'\' where matchID = \''+matchID+'\';'
      q2 = q2 + scoreTotalProc;
        console.log("INsert q ",q2)
        requestInsert = new Request(
          q2,
          function(err, rowCount, rows) {
          if (err) {
              console.log("Error");
              res.status(400).send({result : "Query Failed", score:tscore,query:q2})
          } else {
              console.log("Query executed");
              matchID = matchID+1
              entries = []
              res.send({result : "Query Executed", score:tscore,query:q2})
          }
          });
         connection.execSql(requestInsert);
  
})

app.get('/api/matchid/:match_id',(req,res)=>{
     matchID = req.params.match_id
     console.log("Match ID ",matchID);
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
            matchTeam1 = teams[1]
            matchTeam2 = teams[2]
           res.send({ matchID : matchID,team1 : teams[1],team2 : teams[2]});
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
      
      //  res.send({"matchID" : matchID})
})

app.get('/api/entries',(req,res) =>{
  res.send(entries);
})

app.post('/api/entries',(req,res) =>{
  let date= new Date();
  let options = { timeZone: 'Asia/Kolkata' };
  let currentHourIST = date.toLocaleString('en-US', { hour: 'numeric', hour12: false, ...options });
  if (currentHourIST>=19 ){
   // res.send(entries)
   res.sendStatus(400);
  }else{

      
      var e = req.body;
      var up_name = e.name.toString()
      up_name = up_name.charAt(0).toUpperCase() + up_name.slice(1).trim();
      e.name = up_name;
      var query_requestInsertPlayer = ""
      console.log(e,type(e));
      
      if (entries.some(item=>item.name == e.name)){
        console.log("Duplicate");
        const idx = entries.findIndex(item => item.name == e.name)
        console.log("Duplicate id ",idx);
        entries[idx] = {name:e.name,team:e.team,score:entries[idx].score}
        query_requestInsertPlayer = 'UPDATE iplTest set vote =\''+e.team+'\',matchID = \''+matchID+'\' where player = \''+e.name+'\' ';
        // res.send(entries)
        
      }else {
        
        //  up_name = e.name.toString()
        //  up_name = up_name.charAt(0).toUpperCase() + up_name.slice(1).trim();
        entries.push({name:e.name,team:e.team,score:e.score}); 
        query_requestInsertPlayer = 'INSERT INTO iplTest(player,score,vote,matchID) values(\''+e.name +'\',0,\''+e.team+'\',\''+matchID+'\')';

      }
      console.log(query_requestInsertPlayer)
          requestInsertPlayer = new Request(
          query_requestInsertPlayer,
          function(err, rowCount, rows) {
              if (err) {
                      console.log(err);
                      res.sendStatus(400)
              } else {
                      console.log("Query executed");
                      res.send(entries)
            // res.send({result : "Query Executed"})
              }
          });
          connection.execSql(requestInsertPlayer);
      
        }    
  
   //res.send(entries);
})

const port = normalizePort(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API listening on port: ${port}`);
});




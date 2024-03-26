/* eslint-disable no-undef */
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { type } = require('os');
const { json } = require('body-parser');
const webPush = require('web-push');


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

const {expressCspHeader,SELF} = require('express-csp-header');


//const app = express();

app.use(expressCspHeader({
  directives: {
    'default-src': [SELF],
    'connect-src': [SELF, "https://login.microsoftonline.com","https://myopenaieus.openai.azure.com/openai/deployments/mychatbot/chat/completions"],
    // Add other directives as needed
    'img-src': ['data:', SELF] 
  },
}));

// Other routes and middleware


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
      database: 'backenddb_Copy', //process.env.db_name
      connectionTimeout: 0
  }
}

var connection = new Connection(config);
connection.connect(function(err){
  if(err){
    console.log(err)
  } 
  console.log("Checking")
})
subs = []
var matchID = 0
var matchTeam1=""
var matchTeam2=""

async function initializeMatch(){
  
  let d = new Date(Date.now());
  let formattedDate = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  matchreq = new Request("select * from [dbo].[matches] where Mdate like '"+formattedDate+"' order by matchId DESC offset 0 rows fetch next 1 row only",
   function(err, rowCount, rows) {
    if (err) {
        console.log(err)
    } else {
        console.log(rowCount + ' row(s) returned');
    }
   })
   
   matchreq.on('row', function(columns) {
    columns.forEach(function(column) {
        //console.log(column.metadata.colName);
        if (column.metadata.colName === 'matchID') {
            console.log('Match ID found '+column.value);
            matchID = column.value;
        } if (column.metadata.colName === 'team1') {
          console.log('Team 1 found '+column.value);
          matchTeam1 = column.value;
        } if (column.metadata.colName === 'team2') {
          console.log('Team 2 found '+column.value);
          matchTeam2 = column.value;
        }
    });
    //console.log(result);
    // result = "";
   });

   connection.execSql(matchreq)
}


//Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log("Error while connecting to DB",err);
  } else {
    console.log("Successful connection ");
    initializeMatch()
    //setTimeout(subscriptionRequest, 5000);
  }
});

async function subscriptionRequest(){
  console.log("Subscription request")
  subreq = new Request("select * from [dbo].[subscriptions]",
     function(err, rowCount, rows) {
      if (err) {
          console.log(err)
      } else {
          console.log(rowCount + ' row(s) returned');
      }
     })
     
     subreq.on('row', function(columns) {
      var subObject = {}
      subObject.expirationTime= null
      subObject.keys = {}
      columns.forEach(function(column) {
        console.log(column.metadata.colName + " : " + column.value);
          if (column.metadata.colName === 'endpoint') {
              subObject.endpoint = column.value;
          } 
          if(column.metadata.colName === 'auth'){
            subObject.keys.auth = column.value;
          }
          if(column.metadata.colName === 'p256dh'){
            subObject.keys.p256dh = column.value;
          }
      });
      
      subs.push(subObject);
      // result = "";
     });
     connection.execSql(subreq);

}

function reconnectDb(timeout) {
  connection = new Connection(config);

setTimeout(function() {
  if(connection.connected) {
    console.log("Connection is already established");
    return};
  connection.connect(function(err){
    if(err){
      console.log(err)
    } 
    console.log("Re connected")
  });
}, timeout); // Wait for 10 seconds
}

connection.on('end', function(err){
  console.log("Connection ended, reinitializing connection");
  reconnectDb(100);
})

connection.on('error', function(err){
  console.log("Connection Error occured, reinitializing connection");
  reconnectDb(10000);
})

app.get('/api/end',(req,res)=>{
  connection.close();
  res.send("Connection closed");
})

app.get('/api/db',(req,res)=>{
  reconnectDb(1);
  res.send("Connection restarted");
})

// Configure VAPID keys
webPush.setVapidDetails(
  'mailto:roshan.birar@microsoft.com',
  'BGQnf5Xe5PXvLwVLjoQpeO6WKdTB9oYs2E-DQEstSaXXTD0RExIrP1YUA3W2fGf9Un0Re3Rx_SIhUdJ3uJudxS4',
  'Nim6fzW67Og-2wGMC0EQ3gbyGAkf8HDpUh-5EtloXOo'
);

// app.get('/',
//   (req, res, next) => {
//     res.redirect('/home');
//   },
//   (req, res) => {
//     res.redirect('/home');
//   }
// );


// Route for saving subscription details
app.post('/api/save-subscription', (req, res) => {
  const subscription = req.body;
  // Save subscription to your database
  // ...
  console.log("Subscription received ",subscription);
  var subreq = 'INSERT INTO dbo.subscriptions values(\''+subscription.endpoint+'\',\''+subscription.keys.auth+'\',\''+subscription.keys.p256dh+'\')';
  if(subs.some(item=>item.endpoint == subscription.endpoint)){
    console.log("Duplicate subscription");
    subreq = 'UPDATE dbo.subscriptions set auth = \''+subscription.keys.auth+'\', p256dh = \''+subscription.keys.p256dh+'\' where endpoint = \''+subscription.endpoint+'\'';
  }
  
  connection.execSql(new Request(subreq, function(err, rowCount, rows) {
    if(err){
      console.log(err)
      res.sendStatus(400)
    }else{
      console.log("Subscription saved successfully in DB")
      subs.push(subscription);
      res.status(200).json({ message: 'Subscription saved successfully' });
    }
  }))
  console.log(subs.length);
});

async function sendNotification( dataToSend) {
  let count = subs.length;
  for (let i = 0; i < subs.length; i++) {
    console.log("Sending notification to ",subs[i].endpoint,subs[i].keys.auth,subs[i].keys.p256dh);
    webPush.sendNotification(subs[i], JSON.stringify(dataToSend))
      .catch((err) => {
        count = count - 1
        console.error('Error sending notification, reason: ', err);
      });
  }
  return count
  }



app.get('/api/subs',(req,res)=>{
  res.send(subs.length);
})

// Route for sending notifications
app.get('/send-notification/:msg', (req, res) => {
  var msg = req.params.msg;
  if(msg === 'send'){
    msg ="Vote for your favorite IPL team for today's match."
  }
  const notificationPayload = {
    title: matchTeam1 + ' vs ' + matchTeam2,
    body: msg
  };
  
  sendNotification(notificationPayload).then((count) => {
 
  res.status(200).json({ message: 'Notification sent successfully '+ count});
  })
});

app.get('/api/end',(req,res)=>{
  connection.close();
  res.send("Connection closed");
})

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
        console.log("Check this result -----------");
        console.log(result)
        players = result.split(" ");

        console.log("Check this result splitteed aray -----------");
        console.log(players)
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
          console.log("Iteration - ",i)
          if(player !=""){
          console.log("Player and team",player,players[i+1])
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

//var matchID = parseInt("1")

app.get('/api/matches',async (req,res)=>{
  if (matchTeam1 == "" ){
    await initializeMatch()
    setTimeout(()=>{res.send({ matchID : matchID,team1 : matchTeam1,team2 :matchTeam2})},2000)
    
  }else{
    res.send({ matchID : matchID,team1 : matchTeam1,team2 :matchTeam2});
  }
    
})



var  entries = []
app.use(express.static(path.join(__dirname, 'build')));
//app.use(express.static(path.join(__dirname, 'src')));
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
  console.log("Entries before winner",entries)
  var newEnt = entries.filter(x=> x.team != "");
  console.log("Filtereed ->",newEnt)
  var tscore = 10*newEnt.length
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

app.get('/api/match',(req,res)=>{
  initializeMatch()
  res.send({ matchID : matchID,team1 : matchTeam1,team2 :matchTeam2});
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

// app.get("/service-worker.js", (req, res) => {
//   res.header( {
//     'Content-Type': 'application/javascript'
//   }).sendFile(path.resolve(__dirname,"src", "serviceWorker.js"));
// });

const port = normalizePort(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`API listening on port: ${port}`);
});




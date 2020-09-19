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
import React, {useState} from 'react';
//import logo from './ipl2020.jfif';
import gif1 from './gifs/ipl1.gif';
import gif2 from './gifs/ipl2.gif';
import gif3 from './gifs/ipl3.gif';
import gif4 from './gifs/ipl5.gif';
import gif5 from './gifs/ipl6.gif';
import gif6 from './gifs/ipl7.gif';
import gif7 from './gifs/ipl4.gif';
import gif8 from './gifs/ipl8.gif';

import './App.css';
import EntryForm from './components/EntryForm';

//import React, { useState } from 'react';

import { PageLayout } from './components/PageLayout';
import { loginRequest } from './auth';
import { callMsGraph } from './graph';

import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';

  //mport './App.css';

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("api-key", "a3ed0daf3c77447eb260722990c87f08");
  
  var team1g = ""
  var team2g = ""
  

var helpM = "none"
const gifs = [gif1, gif2, gif3, gif4, gif5, gif6, gif7, gif8];
const getRandomIndex = () => {
  console.log("Calling random func")
  //ProfileContent();
  return Math.floor(Math.random() * gifs.length);
};

const UserIcon = () => (
  <svg height="25px" width="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="6" r="4" stroke="#1C274C" stroke-width="1.5"/>
  <path d="M19.9975 18C20 17.8358 20 17.669 20 17.5C20 15.0147 16.4183 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 4 22 12 22C14.231 22 15.8398 21.8433 17 21.5634" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
);


function chatGpt() {
  console.log("== Get completions Sample ==");
  var raw = JSON.stringify({
    "model": "mychatbot",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant having information about. Consider team short form as follows- GT as Gujrat Titans, DC as Delhi Capital, LSG as Lucknow Super Giants."
      },
       {
          "role" : "user",
          "content" : " What is head to head record of GT vs DC ?"
      },
      {
          "role": "assistant",
          "content": "The head-to-head record between the teams Gujarat Lions (GT) and Delhi Capitals (DC) in the Indian Premier League (IPL) is as follows:\nTotal Matches Played: 6\nMatches won by Gujarat Lions: 2\nMatches won by Delhi Capitals: 4"
      },
      {
          "role" : "user",
          "content" : " " + team1g +" vs " + team2g+ " head to head result?"
      }
    ],
    "temperature": 0.7,
    "top_p": 0.95,
    "frequency_penalty": 0,
    "presence_penalty": 0,
    "max_tokens": 800,
    "stop": null
  });
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
 
  fetch("https://myopenaieus.openai.azure.com/openai/deployments/mychatbot/chat/completions?api-version=2024-02-15-preview", requestOptions)
    .then((response) => response.json())
    .then((result) => { document.getElementById("chatgptres").innerText =  result.choices[0].message.content; console.log("Result ", result) })
    .catch((error) => console.error(error));
  
}


var userName = "";

// this is on component load hook


const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  userName = accounts[0].name;
  console.log(accounts[0]);
  // function RequestProfileData() {
  //     // Silently acquires an access token which is then attached to a request for MS Graph data
  //     instance
  //         .acquireTokenSilent({
  //             ...loginRequest,
  //             account: accounts[0],
  //         })
  //         .then((response) => {
  //             callMsGraph(response.accessToken).then((response) => setGraphData(response));
  //            // userName = response.account.username;
  //            console.log("Check ",response)
  //         });
  // }

  return (
      <>
     <h5> <UserIcon /> {userName}</h5>
      </>
  );
};
function App() {
 
  return (
    <PageLayout class="App">
    <div className="App">
        <AuthenticatedTemplate>
        <ProfileContent className="App-table"/>
      <div className="App-body" id="maintable" /*style={{display: "none" }}*/>
        <div id='help' className="App-model" style={{display: "none" }}>
            <p>1. This is new version of app</p>
            <p>2. You can see Teams competing at the top. Submit button will be enabled once you enter Name and select team</p>
            <p>3. If content on the page does not load, please refresh. (Glitch in the Matrix)</p>
            <p>4. Voting line closes at <b>7 pm</b>. Relax,your votes will be hidden till 7</p>
            <p>5. Points are calulated on the basis of Number of participants. Winner Points = 10 x (No. of players) / No. of Winners</p>
            <p>6. Scores will be calculated at the end of the match. Score field in table shows your total score across the tournament</p>
            <p>PS - Contant your manager for the prizes</p>
            <p> <button margin="40%" onClick={showHelp}>Close</button></p>
        </div>
        <img alt='Logo' src={gifs[getRandomIndex()]} height={250} width={250}   /> 
        <button onClick={showHelp}>Help</button>
        <p id='user'></p>
        <MainTable />
    
      </div> 
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
                    <center>
                    <h4>Please login using MS account to continue</h4>
                    </center>
            </UnauthenticatedTemplate>
    </div>
    </PageLayout>
    
  )
}

function showHelp()  {
  if(helpM === "block"){
    helpM = "none"
    document.getElementById("help").style.display = helpM
  }
  else if(helpM === "none"){
    helpM = "block"
    document.getElementById("help").style.display = helpM
  }
 // alert(helpM)
}

class MainTable extends React.Component {
  constructor(props){
    super(props)
    this.state = { ent : [ ] ,
                  nameInput : "",
                  teamInput : "",
                  team1 : "",
                  team2 : "",
                  showVotes : false
              }

  }

  
  handleNameChange = (e)  => {
    this.setState({
      ...this.state.ent,
      ...this.state.teamInput,
      ...this.state.team1,
      ...this.state.team2,
      ...this.showVotes,
      nameInput : e.target.value
    })
  }
  handleTeamChange = (e)  => {
    this.setState({
      ...this.state.ent,
      ...this.state.nameInput,
      ...this.state.team1,
      ...this.state.team2,
      ...this.showVotes,
      teamInput : e.target.value
    })
    // console.log(this.state.teamInput)
  }
  
  componentDidMount(){
    const apiUrlPlayer = '/api/players';
    const apiUrl = '/api/entries';
    const apiUrlMatch = '/api/matches';
      fetch(apiUrlPlayer)
        .then((response) => response.json())
        .then((data) => {
          // console.log('This is player data', data);
          this.setState((state)=>{
            return{
              ...this.state.ent,
              ...this.state.nameInput,
              ...this.state.teamInput,
              ...this.showVotes,
              team1 : data.team1,
              team2 : data.team2 
            }
          })
    
          // First request done - 
            if ( new Date().getHours()>=19 ){
              this.setState((state)=>{
                return{
                  ...this.state.ent,
                  ...this.state.nameInput,
                  ...this.state.teamInput,
                  ...this.state.team1,
                  ...this.state.team2,
                  showVotes : true 
                }
              })
            }
           
            return fetch(apiUrl)
           .then((response) => response.json())
             .then((data) => {
            //  console.log('This is entries data', data);
                this.setState((state)=>{
                  return{
                       ...this.state.team1,
                       ...this.state.team2,
                       ...this.showVotes,
                       ent : data,
                       nameInput : '',
                       teamInput : ''
                   }
                   })

                   setTimeout(function(){  }, 1000);
                   // Second Call done 
                   return   fetch(apiUrlMatch)
                   .then((response) => response.json())
                   .then((data) => {
                      // console.log('This is Match Data', data);
                      team1g = data.team1
                      team2g = data.team2
                     this.setState((state)=>{
                       return{
                         ...this.state.ent,
                         ...this.state.nameInput,
                         ...this.state.teamInput,
                         ...this.showVotes,
                         team1 : data.team1,
                         team2 : data.team2 
                       }
                     })
                   })
            })
          })
  }


  TableRow(props) {  
    //  console.log("Tbale row",props)
    const entries = props.entries.ent;

    //const vote = "Voted"
    // console.log("Entries",entries)
     const tableEntries = entries.map((entry,i)=>
      {
        console.log(entry);
      return <tr key={i}><td>{entry.name.replace('_', ' ')}</td><td>{ (entry.team === "" ) ? "" : ( props.entries.showVotes ? entry.team :"Voted")} </td><td>{entry.score}</td> </tr>
      }
     )
    
    return (
         <tbody >{tableEntries}</tbody>
      )
  } 

  formSubmit = (name,team) =>{
    name = userName.replace(' ','_')
    team = team.trim()
    console.log("Before",this.state);
    //  const entries = this.state.ent;
    var date = new Date();
    if (date.getHours()<19 ){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name : name, team : team })
    };
  fetch('/api/entries', requestOptions)
      .then(response => response.json())
      .then(data => 
        
        this.setState((state)=> {
         return {
           ent : data,
           nameInput : '',
           teamInput : '',
           team1 : state.team1,
           team2 : state.team2
         }
        })
         
        
        );
      }else{
        alert("Submission Time is over");
      }
  }
  
  render(){
    return (
      <div>
        <div><h3 class='blink'>{this.state.team1} vs {this.state.team2}</h3></div>
        <br/>
        <div id='chatgptres'></div> 
        <button onClick={chatGpt}>GPT help?</button>
       <EntryForm formSubmit={this.formSubmit} nameInput={userName} teamInput={this.state.teamInput}  handleNameChange={this.handleNameChange} handleTeamChange={this.handleTeamChange} 
       team1={this.state.team1}   team2={this.state.team2}></EntryForm>
        <br />
        <br />
        <table >
          <thead >
          <tr><th >Name</th><th >Team</th><th>Score</th></tr>
          </thead>
          <this.TableRow entries={this.state}></this.TableRow>
          
        </table>
      </div>

    )
  }
}


export default App;

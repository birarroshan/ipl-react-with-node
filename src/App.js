import React from 'react';
import logo from './ipl2020.jfif';
import './App.css';
import EntryForm from './components/EntryForm';

var helpM = "none"

function App() {
  return (
    <div className="App">
      <div id="test" className="App-body">
      <model id='help' className="App-model" style={{display: "none" }}>
          

          <p>1. Click Help button to Hide Help </p>
          <p>2. You can see Teams competing at the top. Submit button will be enabled once you enter Name and select team</p>
          <p>3. If content on the page does not load, please refresh. (Glitch in the Matrix)</p>
          <p>4. Voting line closes at <b>7 pm</b>. Relax,your votes will be hidden till 7</p>
          <p>5. Points are calulated on the basis of Number of participants. Winner Points = 10 x (No. of players) / No. of Winners</p>
          <p>6. Use same <b>Name</b> everyday for voting, otherwise your old score won't addup. Name is case insensetive.</p>
          <p>   So, "Roshan","roshan", "ROSHAN","roShan" is valid. "Ro shan" is not valid. </p>
          <p>7. Scores will be calculated at the end of the match. Score field in table shows your total score across the tournament</p>
          <p>NOTE - This tool may have bugs, don't exploit those &#128519;. Let me know, if you find any</p>
          <p>PS - Contant your manager for the prizes</p>

      </model>
          <img src={logo}  /> 
            <button onClick={showHelp}>Help</button>
          <div id="form1">
          </div>
          <MainTable />
          
      </div>
    </div>
    
  )
}

function showHelp()  {
  if(helpM == "block"){
    helpM = "none"
    document.getElementById("help").style.display = helpM
  }
  else if(helpM == "none"){
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
    // console.log(this.state.nameInput)
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

    const vote = "Voted"
    // console.log("Entries",entries)
     const tableEntries = entries.map((entry,i)=>
       <tr key={i}><td>{entry.name}</td><td>{ (entry.team === "" ) ? "" : ( props.entries.showVotes ? entry.team :"Voted")} </td><td>{entry.score}</td> </tr>
     )
    
    return (
         <tbody >{tableEntries}</tbody>
      )
  } 

  formSubmit = (name,team) =>{
    name = name.trim()
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
          // let list = data
          // if( list.some(item=> item.name.toLowerCase()===name.toLowerCase())){
          //   var idx = list.findIndex(item=>item.name.toLowerCase() === name.toLowerCase())
          //    list[idx] = { name: list[idx].name,team: team}
          //  //  item.teamInput = state.teamInput
          // }
          // else{
          //   list = [...state.ent,{"name":state.nameInput,"team":state.teamInput}];
          // }
         return {
           ent : data,
           nameInput : '',
           teamInput : '',
           team1 : state.team1,
           team2 : state.team2
         }
        })
         
        
        );
    
    //  entries.push({name:team});

    

    //  console.log("After",this.state)
      }else{
        alert("Submission Time is over");
      }
  }

  render(){
    return (
      <div>
       <EntryForm formSubmit={this.formSubmit} nameInput={this.state.nameInput} teamInput={this.state.teamInput}  handleNameChange={this.handleNameChange} handleTeamChange={this.handleTeamChange} 
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

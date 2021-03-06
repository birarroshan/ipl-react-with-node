import React from 'react';
import logo from './ipl2020.jfif';
import './App.css';
import EntryForm from './components/EntryForm';


function App() {
  return (
    <div className="App">
      
      <div id="test" className="App-body">
          <img src={logo}  />
          <div id="form1">
          </div>
          <MainTable />
          
      </div>
    </div>
    
  )
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

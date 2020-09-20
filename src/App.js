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
                  team2 : ""
              }

  }

  handleNameChange = (e)  => {
    this.setState({
      ...this.state.ent,
      ...this.state.teamInput,
      ...this.state.team1,
      ...this.state.team2,
      nameInput : e.target.value
    })
    console.log(this.state.nameInput)
  }
  handleTeamChange = (e)  => {
    this.setState({
      ...this.state.ent,
      ...this.state.nameInput,
      ...this.state.team1,
      ...this.state.team2,
      teamInput : e.target.value
    })
    console.log(this.state.teamInput)
  }
  
  componentDidMount(){
    const apiUrl = '/api/entries';
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('This is your data', data);
        this.setState((state)=>{
          return{
            ...this.state.team1,
           ...this.state.team2,
            ent : data,
            nameInput : '',
            teamInput : ''

          }
        })
      } )

    apiUrl = '/api/matches';
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log('This is your data', data);
        this.setState((state)=>{
          return{
            ...this.state.ent,
            ...this.state.nameInput,
            ...this.state.teamInput,
            team1 : data.team1,
            team2 : data.team2 
          }
        })
      } )
  }


  TableRow(props) {  
    // console.log("Tbale row",props)
    const entries = props.entries
    console.log("Entries",entries)
     const tableEntries = entries.map((entry,i)=>
       <tr key={i}><td>{entry.name}</td><td>{entry.team}</td><td>0</td> </tr>
     )
    
    return (
         <tbody >{tableEntries}</tbody>
      )
  } 

  formSubmit = (name,team) =>{
    console.log("Before",this.state);
    //  const entries = this.state.ent;
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, team : team })
  };
  fetch('/api/entries', requestOptions)
      .then(response => response.json())
      .then(data => 
        
        this.setState((state)=> {
          let list = state.ent
          if( list.some(item=> item.name.toLowerCase()===name.toLowerCase())){
            var idx = list.findIndex(item=>item.name.toLowerCase() === name.toLowerCase())
             list[idx] = { name: list[idx].name,team: team}
           //  item.teamInput = state.teamInput
          }
          else{
            list = [...state.ent,{"name":state.nameInput,"team":state.teamInput}];
          }
         return {
           ent : list,
           nameInput : '',
           teamInput : '',
           team1 : state.team1,
           team2 : state.team2
         }
        })
         
        
        );
    
    //  entries.push({name:team});

    

     console.log("After",this.state)
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
          <this.TableRow entries={this.state.ent}></this.TableRow>
          
        </table>
      </div>

    )
  }
}


export default App;

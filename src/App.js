import React from 'react';
import logo from './ipl2020.jfif';
import './App.css';
import EntryForm from './components/EntryForm';
import { request } from 'express';
import XMLHttpRequest from XMLHttpRequest
var request = new XMLHttpRequest()

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
    
  );
}
``


function WelcomeHeader(props){
 return <p>Hello, {props.name}</p>;
}

class MainTable extends React.Component {
  constructor(props){
    super(props)
    this.state = { ent : [ ] ,
                  nameInput : "",
                  teamInput : ""
              }

  }
  handleNameChange = (e)  => {
    this.setState({
      ...this.state.ent,
      ...this.state.teamInput,
      nameInput : e.target.value
    })
    console.log(this.state.nameInput)
  }
  handleTeamChange = (e)  => {
    this.setState({
      ...this.state.ent,
      ...this.state.nameInput,
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
        this.setState({
          return{
            ent : data,
            nameInput : '',
            teamInput : ''

          }
        })
      } );



    
  }


  TableRow(props) {  
    // console.log("Tbale row",props)
    const entries = props.entries
    console.log("Entries",entries)
     const tableEntries = entries.map((entry,i)=>
       <tr key={i}><td>{entry.name}</td><td>{entry.team}</td></tr>
     )
    
    return (
         <tbody >{tableEntries}</tbody>
      )
  } 

  formSubmit = (name,team) =>{
     console.log("How this is clicking",name,team)
    //  const entries = this.state.ent;
    //  entries.push({name:team});
    console.log("Before",this.state)
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
        teamInput : ''
      }
     })
       
     console.log("After",this.state)
  }

  render(){
    return (
      <div>
       <EntryForm formSubmit={this.formSubmit} nameInput={this.state.nameInput} teamInput={this.state.teamInput}  handleNameChange={this.handleNameChange} handleTeamChange={this.handleTeamChange}></EntryForm>
        <br />
        <br />
        <table >
          <thead >
          <tr><th >Name</th><th >Team</th></tr>
          </thead>
          <this.TableRow entries={this.state.ent}></this.TableRow>
          
        </table>
      </div>

    )
  }
}


export default App;

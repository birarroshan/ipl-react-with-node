import React from 'react';
import styles from './EntryForm.module.css';


const EntryForm = ({formSubmit,nameInput, teamInput,handleNameChange,handleTeamChange,team1,team2}) => (
  
  <div className={styles.EntryForm}>
    <h3>{team1} vs {team2}</h3>
    <h6>Winner Points = 10 x (No. of players) / No. of Winners </h6>
    <p>Enter your prediction</p>
    
    <input placeholder="Name" value={nameInput} name="Name" onChange={handleNameChange}></input>
    <select name="Team" value={teamInput} onChange={handleTeamChange} >
        <option value ="select" >--Select--</option>
        <option value={team1}>{team1}</option>
        <option value={team2}>{team2}</option>
    </select>
    <div><button  type="submit" disabled={ teamInput==='--select--' || teamInput==='' || nameInput===''  } onClick={(e)=>{formSubmit(nameInput,teamInput)}}>Submit</button></div>
    
  </div>

);

EntryForm.propTypes = {};

EntryForm.defaultProps = {};

export default EntryForm;

import React from 'react';
import styles from './EntryForm.module.css';


const EntryForm = ({formSubmit,nameInput, teamInput,handleNameChange,handleTeamChange}) => (
  <div className={styles.EntryForm}>
    <h3>MI vs CSK</h3>
    <p>Enter your prediction</p>
    
    <input placeholder="Name" value={nameInput} name="Name" onChange={handleNameChange}></input>
    <select name="Team" defaultValue="select" onChange={handleTeamChange} >
        <option value ="select" >--Select--</option>
        <option value="MI">MI</option>
        <option value="CSK">CSK</option>
    </select>
    <div><button type="submit" onClick={(e)=>{formSubmit(nameInput,teamInput)}}>Submit</button></div>
    
  </div>
);

EntryForm.propTypes = {};

EntryForm.defaultProps = {};

export default EntryForm;

import React from 'react';
import styles from './EntryForm.module.css';

const T = ['MI','CSK'];
const EntryForm = ({formSubmit,nameInput, teamInput,handleNameChange,handleTeamChange}) => (
  <div className={styles.EntryForm}>
    <h3>{this.T[1]} vs {this.T[2]}</h3>
    <p>Enter your prediction</p>
    
    <input placeholder="Name" value={nameInput} name="Name" onChange={handleNameChange}></input>
    <input placeholder="Team" value={teamInput} name="Team" onChange={handleTeamChange}></input>
    <select options={this.T}></select>
    <div><button type="submit" onClick={(e)=>{formSubmit(nameInput,teamInput)}}>Submit</button></div>
    
  </div>
);

EntryForm.propTypes = {};

EntryForm.defaultProps = {};

export default EntryForm;

import {React, useState} from "react";
import { Component } from "react";
import { useParams } from 'react-router-dom';
import { Dropdown, Form, Input } from "semantic-ui-react";
import api from "../services/api";
import axios from 'axios';
import { getValue } from "@testing-library/user-event/dist/utils";

const API_KEY = process.env.REACT_APP_API_KEY;
var drugId2=0;
var doseId2=0;

var drugIdState=0 ;
var dosageIdState=0;

// Adds a new drug to the table of a given animal
class AddDrug extends Component {
  
    state = {
        name: "",
        method: "",
        concentration: "",
        concentrationUnit: "",
        doseLow: "",
        doseHigh: "",
        dosageUnit: "",
        notes: "",
        drugIdState: 0,
        doseUnitId:0,
        unitId: 0,
        options:0, 
        methodUnitId: 0,       
        
    };

    setState=this.setState.bind(this);
    
    handleDropdownChangeConc = (e, { value }) => {

        this.setState({ concentrationUnit: value });
      // alert(this.state.unitOptions.find(o => o.value ==value)?.key);
      this.setState({unitId: value });
      this.setState({options: value})
      //  alert(value);
      };

      handleDropdownChangeDose = (e, { value }) => {
        // this.setState({ dosageUnit: value });
        this.setState({optionDose: value})
        //  alert("dosage unity :"+value)
      };

      handleDropdownChangeMethod = (e, { value }) => {
        this.setState({ methodUnit: value });
        //alert(value)  

        this.setState({methodUnitId: value });
        // this.setState({optionMethod: value})
        // alert(value)
      };
      

      
      
    add = (e) => {

      var concentrationValue= this.state.concentration;
      var unitIdValue = this.state.unitId;
      var methodUnitId = this.state.methodUnitId
      
        e.preventDefault();
        // alert(this.state.name)
        api.post('/drugs', {
            Authentication: API_KEY,
            //drug_id: 161,
            name: this.state.name
            
          })
          .then(
            api.get('/drugs')
            .then(response => {
              const myPromise = new Promise((resolve, reject) => {
                try {
                  const drugId = Object.values(response.data);
              
                  // drugId2 = drugId.pop().drug_id;
                  //this.setState({drugIdState: drugId.pop().drug_id });  
                  drugIdState = drugId.pop().drug_id ;
                  console.log("the drug list:");    
                  console.log(drugId.pop()) ;
                  // const result = myClassInstance.myMethod(); // Execute the method
              
                  resolve("ok"); // Resolve the Promise with the result
                } catch (error) {
                  reject(error); // Reject the Promise if an error occurs
                }

              }); 

            myPromise.then(response => {
                    api.post('/dosages', {
                      Authentication: API_KEY,
                      animal_id: localStorage.getItem("animalId"),       // Needs to come from dropdown list of /animals!
                      drug_id: drugIdState,         // Needs to come from get methods of /drugs!
                      dose_low: this.state.doseLow,
                      dose_high: this.state.doseHigh,
                      dose_unit_id: this.state.optionDose,  // Needs to come from /units!
                      notes: this.state.notes,
                    })
                    .then(function (response) {
                      
                      api.get('/dosages')
                      .then(response => {
                        const promiseC = new Promise((resolve, reject) => {
                          try {
                            const drugId = Object.values(response.data);                       
                            
                            const dosageId = Object.values(response.data);
                            dosageIdState = dosageId.pop().dosage_id; 
                           // doseId2 = dosageId.pop().dosage_id;                            
                        
                            resolve("ok"); // Resolve the Promise with the result
                          } 
                          
                          catch (error) {
                            reject(error); // Reject the Promise if an error occurs
                          }
          
                        }); 
                        
                      alert("the id of the dosage is:"+concentrationValue);
                        promiseC.then(response => {

                          
                          // console.log("the id of the dosage is:"+dosageIdState);
                          // console.log("the id of the dosage is:"+dosageIdState);
                            api.post('/concentrations', {
            
                              Authentication: API_KEY,
                              value: concentrationValue,
                              unit_id: unitIdValue,
                              dosage_id: dosageIdState,             // Needs to come from get from /dosage!
                            })

                              
        
                          api.post('/delivery', {
                            Authentication: API_KEY,
                            //drug_id: 161,
                            dosage_id: dosageIdState,
                            method_id: methodUnitId,
                            
                          })
                          .then(
                          )
                  
                            .catch(error => {
                              // console.error("Error: cannot receive drug data from DB")
                              console.error(error)
                            });
                                            
                   
                      } )                      
                      .catch(function (error) {
                        console.log("the error PROM. is:"+error);
                      });
                    })
          
              
              })
              .catch(function (error) {
                console.log("the error is:"+error.response.data.message);
              });
   
            });

            
             })
  
            .catch(error => {
              // console.error("Error: cannot receive drug data from DB")
              // console.error(error)
            })

          );
       
   
          
        // // //return; 
        // // if (this.state.name === "") {
        // //     alert("Drug field is mandatory!");
        // //     return;
        // // }
        
        this.props.addDrugHandler(this.state);
        this.setState({ id: "", name: "", method: "", concentration: "", concentrationUnit: "", doseLow: "", doseHigh: "", dosageUnit: "", notes: "" });
    };

    // Retrieve data from DB using Axios
    componentDidMount() {
        // Get unit information
        api.get('/units')
          .then(response => {
            const unitOptions = response.data.map(unit => ({
                key: unit.unit_id,
                text: unit.name,
                value: unit.unit_id
            }
            ))
            this.setState({unitOptions});
          })
          .catch(error => {
            console.error("Error: cannot receive drug data from DB")
          });
          

        // Get method information
        api.get('/methods')
          .then(response => {
            const methodOptions = response.data.map(method => ({
                key: method.method_id,
                text: method.name,
                value: method.method_id
            }
            ))
            this.setState({methodOptions});
          })
          .catch(error => {
            console.error("Error: cannot receive drug data from DB")
          });
          
      }

    render() {
        return (

            <div className="ui main">
                <h2> Add Drug</h2>
                <form className="ui form" onSubmit={this.add}>
                <Form.Group width="equal">
                    <Form.Field
                    control={Input}
                    name="name"
                    label="Drug Name"
                    style= {{width: "925px"}}
                    placeholder="Drug Name"
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
                    />
                    
                    <Form.Field
                      control={Dropdown}
                      name="methodUnit"
                      label="Method Unit"
                      placeholder="IV"
                      selection
                      options={this.state.methodOptions || []}
                      value={this.state.methodUnitId}
                      onChange={this.handleDropdownChangeMethod}
                />
                    {/* //     control={Input}
                    //     name="method"
                    //     label="Method"
                    //     placeholder="Method"
                    //     className="right aligned"
                    //     value={this.state.method}
                    //     onChange={(e) => this.setState({ method: e.target.value })}
                    //  */}
                    </Form.Group>

                    <Form.Group>
                    <Form.Field
                        
                        control={Input}
                        name="concentration"
                        label="Concentration"
                        style={{width: 125}}
                        placeholder="Concentration"
                        value={this.state.concentration}
                        onChange={(e) => this.setState({ concentration: e.target.value })}
                    />   
                    <Form.Field
                        control={Dropdown}
                        name="concentrationUnit"
                        label="Concentration Unit"
                        placeholder="mg/kg"
                        selection
                        options={this.state.unitOptions || []}
                        value={this.state.options}
                        onChange={this.handleDropdownChangeConc}
                    />
                    </Form.Group>

                    <Form.Group>
                    <Form.Field
                        control={Input}
                        style={{width: 125}}
                        name="doseLow"
                        label="Dosage Range"
                        placeholder="Dosage Low"
                        value={this.state.doseLow}
                        onChange={(e) => this.setState({ doseLow: e.target.value })}
                    />
                    <Form.Field>to</Form.Field>
                    <Form.Field
                        control={Input} 
                        style={{width: 125}} 
                        name="doseHigh" 
                        label="&nbsp;"
                        placeholder="Dosage High"
                        value={this.state.doseHigh}
                        onChange={(e) => this.setState({ doseHigh: e.target.value })}/>     
                    <Form.Field
                        control={Dropdown} 
                        name="dosageUnit" 
                        label="Dosage Unit"
                        placeholder="Dosage Unit"
                        selection
                        options={this.state.unitOptions || []}
                        value={this.state.optionDose}
                        onChange={this.handleDropdownChangeDose}/>
                    </Form.Group>
                    
                    <Form.Field
                        control={Input}
                        name="notes"
                        label="Notes"
                        placeholder="Notes"
                        value={this.state.notes}
                        onChange={(e) => this.setState({ notes: e.target.value })}
                    />
                   
                    <button className="ui button blue">Add</button>
                </form>
            </div>
        );
    }
}

export default AddDrug;
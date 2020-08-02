/*
 * Copyright (C) 2020 Kevin Zatloukal.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Spring Quarter 2020 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */

import React, {Component} from 'react';
import DropMenu from "./DropMenu";
import Map from "./Map";

interface AppState {
    startPoint: string;     //Stores short name for start
    startBuilding: string;  //Stores long name for start
    endPoint: string;       //Stores short name for end
    endBuilding: string;    //Stores long name for end
    building: any;          //List of buildings names
    paths: any;             //Path from start to end
}

class App extends Component<{}, AppState> {

    //Setting all states to their empty or default states
    constructor(props: any) {
        super(props);
        this.state = {
            startPoint : "",
            endPoint: "",
            startBuilding: "",
            endBuilding: "",
            building: [],
            paths: null
        };
    }

    /*
    Updates start point when the user changes the dropdown menu
     */
    updateStart = (event: {target: {value: any;};}) => {
        let s = event.target.value;
        let q = s.split("-");
        this.setState({
            startPoint: q[0],
            startBuilding: s
        });
    }

    /*
    Updates end point when the user changes the dropdown menu
     */
    updateEnd = (event: {target: {value: any;};}) => {
        let s = event.target.value;
        let q = s.split("-");
        this.setState({
            endPoint: q[0],
            endBuilding: s
        });
    }

    componentDidMount(): void{
        this.buildingName();
    }

    /*
    Fetches all the building names from the server and stores them in buildings state
     */
    async buildingName() {
        try{
            let responsePromise = fetch("http://localhost:4567/buildingNames");
            let response = await responsePromise;
            let parsingPromise = response.json();
            let parsedObject =  await parsingPromise;
            this.setState({
                building: parsedObject
            });
        } catch(e){
            alert("No buildings found!");
        }
    }

    /*
    Implements the clear button by resetting all the features on the landing page
     */
    updateClearButtom = () => {
        this.setState({
            startPoint:"",
            endPoint:"",
            paths:null,
            startBuilding:"",
            endBuilding:""
        })
    }

    /*
    Fetches the shortest path between between the buildings from the server
     */
    getPath = async (start:string, end:string) => {
        // Handling exceptions
        let e = "";
        if(start === undefined || end === undefined) {
            e = "undefined";
        } else if(start === "" && end === ""){
            e = "You need to choose a start and end building! None are chosen so far :(";
        } else if(start === ""){
            e = "We know where your journey ends, but where does it start? Please choose a start building!";
        } else if(end === ""){
            e = "We know where your journey starts, but where does it end? Please choose an end building!";
        }else if(start === end){
            e = "Oops, your start and ending destination cannot be the same :)";
        }
        if(e !== "") {
            alert(e);
        } else {
            // If no exceptions, then actually fetches data from server
            try{
                let response = await fetch("http://localhost:4567/findPath?start="+start+"&end="+end);
                if(!response.ok) {
                    alert("There is an error with the path. Please check the server");
                    return "";
                }
                let json = await response.json();
                this.setState({
                    paths: json
                });
            } catch(e){
                alert("There's an error with the server. Please check if it is running.");
            }
        }
    };

    render() {
        return (
            <div>
                <div style = {{ float:"left", fontFamily:"monospace"}}>
                    <p>Don't know how to get to class?</p>
                    <p>We're just glad you know how to get to this page for help!</p>
                </div>
                <div style = {{margin:"0 auto", width:"55%", float:"right"}}>
                    <DropMenu value={this.state.startBuilding} onChange={this.updateStart} building={this.state.building}/>
                    <DropMenu value={this.state.endBuilding} onChange={this.updateEnd} building={this.state.building}/>
                    <button onClick={()=>this.getPath(this.state.startPoint, this.state.endPoint)}>Get Path</button>
                    <button onClick={this.updateClearButtom}>Clear</button>
                </div>
                <Map path = {this.state.paths}/>
            </div>

        );
    }
}

export default App;

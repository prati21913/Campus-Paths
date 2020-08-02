// this file represents the dropdown button for choosing the start and end points on the map

import React, {Component} from 'react';

interface buttonProps {
    building: any;      //List of buildings to show, passed from App
    value: any;         //Current selected item in the dropdown menu
    onChange(text: any): void;
}

class DropMenu extends Component<buttonProps>{

    render(){
        // Making an array to store all the options of buildings in the dropdown menu
        let b = [];
        if(this.props.building.length > 0){
            for(let i = 0; i < this.props.building.length; i++){
                b.push(<option>{this.props.building[i]}</option>)
            }
        }

        return (
            <div>
                <select value={this.props.value} onChange={this.props.onChange}>
                        {b}
                </select>
            </div>
        )
    }
}

export default DropMenu;
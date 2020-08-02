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
import "./Map.css";

interface MapState {
     backgroundImage: HTMLImageElement | null;
}

interface props {
    path:any;       //To store the path, passed form App
}

class Map extends Component<props, MapState>{

    // NOTE:
    // This component is a suggestion for you to use, if you would like to.
    // It has some skeleton code that helps set up some of the more difficult parts
    // of getting <canvas> elements to display nicely with large images.
    //
    // If you don't want to use this component, you're free to delete it.

    canvas: React.RefObject<HTMLCanvasElement>;

    constructor(props: props) {
        super(props);
        this.state = {
            backgroundImage: null,
        };
        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.fetchAndSaveImage();
        this.drawBackgroundImage();
    }

    componentDidUpdate() {
        this.drawBackgroundImage();
    }

    fetchAndSaveImage() {
        // Creates an Image object, and sets a callback function
        // for when the image is done loading (it might take a while).
        let background: HTMLImageElement = new Image();
        background.onload = () => {
            this.setState({
                backgroundImage: background
            });
        };
        // Once our callback is set up, we tell the image what file it should
        // load from. This also triggers the loading process.
        background.src = "./campus_map.jpg";
    }

    /*
    Draws the background image, in this case the map
     */
    drawBackgroundImage() {
        let canvas = this.canvas.current;
        if (canvas === null) throw Error("Unable to draw, no canvas ref.");
        let ctx = canvas.getContext("2d");
        if (ctx === null) throw Error("Unable to draw, no valid graphics context.");
        if (this.state.backgroundImage !== null) { // This means the image has been loaded.
            // Sets the internal "drawing space" of the canvas to have the correct size.
            // This helps the canvas not be blurry.
            canvas.width = this.state.backgroundImage.width;
            canvas.height = this.state.backgroundImage.height;
            ctx.drawImage(this.state.backgroundImage, 0, 0);
        }
        this.drawShortestPath(ctx, this.props.path);
    }

    /*
    Draws the shortest path on the map between the start and end buildings. It is blue in color.
     */
    drawShortestPath = (ctx: any, path: any) => {
        if(path === null){ // To handle landing page, when no buildings are selected
            return;
        }
        let startPoint = [];
        startPoint.push(this.props.path.start.x, this.props.path.start.y);

        let pathCoordinates = [];
        pathCoordinates = this.props.path.path;

        let endCoordinate = pathCoordinates[pathCoordinates.length-1];
        let endPoint = [];

        endPoint.push(endCoordinate.end.x, endCoordinate.end.y);


        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.lineWidth = 6;

        // Draws the path segment by segment
        for(let i = 0; i < pathCoordinates.length; i++){
            ctx.moveTo(pathCoordinates[i].start.x, pathCoordinates[i].start.y);
            ctx.lineTo(pathCoordinates[i].end.x, pathCoordinates[i].end.y);
            ctx.stroke();
        }

        // Drawing the circles after the lines on the buildings
        this.drawCircle(ctx, startPoint, "red");    // Red for initial destination
        this.drawCircle(ctx, endPoint, "green");    // Green for final destination
    };

    /*
    Draws the red circles at the start and end point (buildings) of the path requested by the user
     */
    drawCircle = (ctx: any , coordinate: any[], color: string) => {
        ctx.fillStyle = color;
        const radius = 15;
        ctx.beginPath();
        ctx.arc(coordinate[0], coordinate[1], radius, 0, 2 * Math.PI);
        ctx.fill();
    };

    render() {
        return (
            <canvas ref={this.canvas}/>
        )
    }
}

export default Map;
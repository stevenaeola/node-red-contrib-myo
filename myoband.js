module.exports = function(RED) {
    "use strict";
    
    function MyoBandNode(config) {

	console.log("A");
	var Myo = require('myo');

	console.log("B");

        RED.nodes.createNode(this,config);
        var node = this;

	console.log("C");
	reset();
	console.log("D");
	
        this.on('input', function(msg) {
	    console.log("Got myo message");
	    switch(msg.payload){
		
	    case "reset":
		reset();
		node.send(msg);
		break;
		
	    default:
		node.send(msg);
	    }
	}
	       );


	function reset(){
	    console.log("D1");
	    node.appID = "uk.ac.dur.dcs0spb";
//	    Myo.disconnect();
	    console.log("D1b");

	    Myo.connect(node.appID, require("ws"));

	    Myo.on('connected', function(){
		console.log("D2");
		Myo.setLockingPolicy("none");
		console.log("D3");
		node.myo = Myo.myos[0];
		console.log("D3a");
	    });
		
	    Myo.on("battery_level", function(data){
		var colour;
		if(data>10){
		    colour = "green";
		}
		else{
		    colour = "red";
		}
		node.status({fill: colour, shape: "ring", text: data});
	    });
		
	    Myo.on("pose", function(name){
		var msg = {payload: name};
		msg.imu = this.lastIMU;
		node.send(msg);
		node.myo.requestBatteryLevel();
		console.log("DX");
	    });
	    
	    Myo.on("orientation", function(data){
		var msg = {payload: "imu"};
		msg.orientation = data;
		node.send(msg);
	    });
	    
	}

    }

	
    RED.nodes.registerType("myoband", MyoBandNode);
}


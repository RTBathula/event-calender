var express = require('express');
var app = express();

module.exports = function() {

    //routes
    app.post('/event', function(req,res,next) {	

    	var eventObject = req.body.data || {};

        global.eventsService.createEvent(eventObject).then(function(result){
        	return res.status(200).json(result);
        },function(error){
        	return res.status(400).send(error);
        });  
    });

    app.get('/event', function(req,res,next) {	    	

        global.eventsService.getAllEvents().then(function(result){
        	return res.status(200).json(result);
        },function(error){
        	return res.status(400).send(error);
        });  
    });

    app.put('/event/:eventId', function(req,res,next) {	    	

    	var eventId=req.params.eventId; 
    	var eventObject = req.body.data || {};

        global.eventsService.updateEvent(eventId,eventObject).then(function(result){
        	return res.status(200).json(result);
        },function(error){
        	return res.status(400).send(error);
        });  
    });

    app.delete('/event/:eventId', function(req,res,next) {	    	

    	var eventId=req.params.eventId;     	

        global.eventsService.deleteEvent(eventId).then(function(result){
        	return res.status(200).json(result);
        },function(error){
        	return res.status(400).send(error);
        });  
    });

    app.put('/event/:eventId/rsvp', function(req,res,next) {         

        var eventId=req.params.eventId; 
        var userId = req.body.userId;        

        global.eventsService.rsvpEvent(eventId,userId).then(function(result){
            return res.status(200).json(result);
        },function(error){
            return res.status(400).send(error);
        });  
    });
   
    return app;
}

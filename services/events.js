'use strict';

var ObjectId=require('mongodb').ObjectId;

module.exports = function(){

  return {
  
    /*Desc   : Create new Event
      Params : Event object containing all fields
      Returns: Promise
               Resolve->saved Event Object
               Reject->Error on save()
    */
    createEvent: function (eventObject) {      

        var _self = this;
        var deferred = global.q.defer();

        try{
            
          eventObject.timestamp= new Date().getTime();
          
          var collection=global.mongoDB.collection("event");
          collection.save(eventObject, function(err, doc) {
              if (err) {                
                deferred.reject(err.errmsg);
              } else { 
                deferred.resolve(eventObject);
              }
          });

        }catch(err){        
          deferred.reject(err);
        }

        return deferred.promise;
    }, 

    /*Desc   : Get All Events
      Params : 
      Returns: Promise
               Resolve->list of events
               Reject->Error on find()
    */
    getAllEvents: function () {      

        var _self = this;
        var deferred = global.q.defer();

        try{
            
          var collection=global.mongoDB.collection("event");
          collection.find({}).toArray(function(err, list) {
              if (err) {                
                deferred.reject(err.errmsg);
              } else { 
                deferred.resolve(list);
              }
          });

        }catch(err){        
          deferred.reject(err);
        }

        return deferred.promise;
    },

    /*Desc   : Update Event by id
      Params : EventId,New event object
      Returns: Promise
               Resolve->Success message
               Reject->Error on findOneAndUpdate()
    */
    updateEvent: function (eventId,eventObject) {      

        var _self = this;
        var deferred = global.q.defer();

        try{
            
          var collection=global.mongoDB.collection("event");
          collection.findOneAndUpdate({_id:new ObjectId(eventId)},{$set:eventObject},{returnOriginal: false},function(err,response){
              if (err) {                
                deferred.reject(err.errmsg);
              } else {                
                deferred.resolve("Successfully updated.");
              }
          });

        }catch(err){        
          deferred.reject(err);
        }

        return deferred.promise;
    },
    /*Desc   : Delete Event by id
      Params : EventId
      Returns: Promise
               Resolve->Response on deletion
               Reject->Error on findOneAndDelete()
    */
    deleteEvent: function (eventId) {      

        var _self = this;
        var deferred = global.q.defer();

        try{
            
          var collection=global.mongoDB.collection("event");
          collection.findOneAndDelete({_id: new ObjectId(eventId)},function(err,response){
              if (err) {                
                deferred.reject(err.errmsg);
              } else { 
                deferred.resolve(response);
              }
          });

        }catch(err){        
          deferred.reject(err);
        }

        return deferred.promise;
    },
    /*Desc   : RSVP Event by id
      Params : EventId, UserId
      Returns: Promise
               Resolve->Success message on update
               Reject->Error on find() or already user RSVP'd or findOneAndUpdate()
    */
    rsvpEvent: function (eventId,userId) {      

        var _self = this;
        var deferred = global.q.defer();

        try{
           
          var query={
            _id: new ObjectId(eventId),
            rsvp:{ 
              $in:[userId]
            }
          };
            
          var collection=global.mongoDB.collection("event");
          collection.find(query).limit(1).next(function(err, respDoc) {
              if(err) {                
                deferred.reject(err.errmsg);
              }
              if(respDoc){ 
                deferred.reject("You have already RSVP'd for this event");
              }
              if(!respDoc){

                var newSet={ $push: { rsvp: userId } };

                collection.findOneAndUpdate({_id:new ObjectId(eventId)},newSet,{returnOriginal: false},function(err,response){
                  if (err) {                
                    deferred.reject(err.errmsg);
                  } else {                
                    deferred.resolve("You have successfully RSVP'd");
                  }
                });
              }
          });
         

        }catch(err){        
          deferred.reject(err);
        }

        return deferred.promise;
    },  
  

  }

};

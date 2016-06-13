
module.exports = function () {
    
    var obj = {
      
        connect: function() {
            
            var _self = obj;
            var deferred = global.q.defer();
            try{
                var mongoClient = require('mongodb').MongoClient;
                mongoClient.connect(global.keys.mongoConnectionString,function (err, db) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(db.db("calender"));
                    }
                });

            }catch(e){                
                deferred.reject(e);             
            }
            return deferred.promise;
        }
    };

    return obj;
};

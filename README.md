# Event Calender
Find and RSVP the events around the world

#Demo
http://calender-event.herokuapp.com

#Getting Started

Fork and clone the repository. Install dependencies with:

``npm install``

and

``bower install``

#Database connection
Run MongoDB locally or run through service and add MongoDB connection string config/keys.js file

Example: under config/keys.js
```
{
  //Local connection
  mongoConnectionString: "mongodb://localhost:27017"
}
```


#Run Server
After completing all above steps run your node.js server

``node server``

#Admin
To add events,Log in as admin with

**username**: admin </br>
**password**:secretpassword

URL: &lt;domain&gt;/#/login

Hosted URL: http://calender-event.herokuapp.com/#/login

#LICENSE

Copyright 2016

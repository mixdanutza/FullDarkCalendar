var events=require("./../controllers/events");
var path = require("path");



module.exports=function(app){
        //DISPLAY DASHBOARD
        app.get("/get_events", events.get_events)
        //LOGIN
        app.post("/create_event", events.create_event)

        //to make angular routes work properly
        app.get("*", function(req, res){
            res.sendFile(path.resolve("client/dist/index.html"))
        })




}

var mongoose=require("mongoose");
var MyEvent=mongoose.model("MyEvent");



module.exports={
  //GET ALL EVENTS
  get_events: (req, res)=>{
    MyEvent.find({}).sort({createdAt:-1})
        .then (events=>{res.json(events)})
        .catch(err=>{
          console.log("Events get error", err);
          res.status(500).json(err)
        })
  },


//CREATE POLL
create_event:(req,res)=>{
  console.log("EVENT AT BACKEND: ", req.body);
  var new_event=new MyEvent(req.body)
  new_event.save()
  .catch(err=>{
    console.log("Cannot save event to db:", err);
    res.status(500).json(err)
  })
  .then(()=>{
    console.log("SUCCSESSFULLY ADDED EVENT TO DB");
    res.json(true)
  })
},



// //DELETE POLL
// delete_poll: (req,res)=>{
//   Poll.remove({_id:req.params.id})
//         .then(()=>{res.json(true)})
//         .catch(err=>{
//           console.log("Error when deleting:", err);
//           res.status(500).json(err);
//         })
// },


  }

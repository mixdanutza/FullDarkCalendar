var mongoose=require('mongoose');
mongoose.Promise = global.Promise


const EventSchema=new mongoose.Schema({
      title: {type: String, required: [true, "Please add a title! "] },
      start:{type: String},
      end:{type:String},
      type: {type:String},
      color:{type: String},
      description:{type: String},
      location:{type:String}
  },{timestamps: true});



mongoose.model("MyEvent", EventSchema);



var MyEvent=mongoose.model("MyEvent");

import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from "./calendar-event";
import { Calendar } from "./calendar";
import * as moment from 'moment';
import { EventsService } from "../events.service";



declare global {
  interface Window { Calendar: any; }
}



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
    new_event: CalendarEvent=new CalendarEvent();
    all_events:any[];
    calendar: Calendar;
    csvObjects:CalendarEvent[];

  constructor(
    private events_service: EventsService,
  ) { }

  ngOnInit() {
    this.getAllEvents();
  }

  //Call service to get all events from db 
  getAllEvents(){
      this.events_service.getAllEvents()
          .then((data)=>{
            this.all_events=data; 
            if(!this.calendar){
              console.log("There was no calendar")
              this.generateCalendar();
            }
            // this.getAllEvents;
          })
          .catch((err)=>{console.log("Error getting events from db.")})
  }

  generateCalendar(){
      this.calendar = new Calendar('#calendar', this.all_events);    
  }

  //Create new event (call create event function from services)
  createEvent(csvEvent?: CalendarEvent){
    if(csvEvent){
      this.new_event=csvEvent;
    }
    console.log(this.new_event.type)
    this.new_event.color="blue";
    this.new_event.start=this.new_event.start.slice(0,10)
    this.new_event.end=this.new_event.end.slice(0,10)
    if(!this.new_event.type){
      this.new_event.type="other";
    }
    if(this.new_event.type==="practice"){
      this.new_event.color="yellow"
    }else if(this.new_event.type==="game"){
      this.new_event.color="blue"
    }else if(this.new_event.type==="other"){
      this.new_event.color="orange"
    }else{
      this.new_event.color="green"
    }
    this.events_service.createEvent(this.new_event)
        .then(()=>{
          this.new_event=new CalendarEvent();
          //Still need to find a solution to reload calendar after you add an event        
          // this.calendar=undefined;
          // this.getAllEvents();
          window.location.reload();
        })
        .catch(err=>{console.log("Error adding event to database."+err)})
  }

  //Check CSV file
    onFileChange(files: FileList){
      let myFile: string;
       if(files && files.length > 0) {
              let file : File = files.item(0);
              let reader: FileReader = new FileReader();

              reader.onload = (e) => {
                myFile = reader.result;
                this.csvObjects=this.csvJSON(myFile);
                this.addScedulerToDatabase();
              }
              
              reader.readAsText(file);
        }
    }

    //Parce the text read from CSV and create objects
    csvJSON(csvText) {
       var lines = csvText.split("\n");
       var result = [];
       var headers = lines[0].split(",");

       for (var i = 1; i < lines.length-1; i++) {
           var obj = {};
           var currentline = lines[i].split(",",-1);

           for (var j = 0; j < headers.length; j++) {
               obj[headers[j]] = currentline[j];
           }  
          if(obj['title'] !== ''){
            //Format date read from CSV
              let startDate=new Date(obj["start"]); 
              let momentStart=moment(startDate).format("YYYY-MM-DD")
              obj['start']=momentStart

              let endDate=new Date(obj["end"]); 
              let momentEnd=moment(endDate).format("YYYY-MM-DD")
              obj['start']=momentEnd

              result.push(obj);
          }
       }
       return result;
    }

    //After reading from CSV file parse the array of objects and save each objject to database
    addScedulerToDatabase(){
      let scheduleArr=this.csvObjects;
      if(scheduleArr){
        for(let i=0; i < scheduleArr.length; i++ ){
          this.createEvent(scheduleArr[i]);
        }
      }
    }


  
  

}

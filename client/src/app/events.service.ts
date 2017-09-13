import { Injectable } from '@angular/core';
import { CalendarEvent } from "./calendar/calendar-event";
import { Http, RequestOptions, Headers } from "@angular/http";
import "rxjs"
import 'rxjs/add/operator/map'

const HEADERS = new Headers({ "Content-Type": "application/json"})
const OPTIONS = new RequestOptions({ headers: HEADERS })

@Injectable()
export class EventsService {

  constructor(private http: Http) { }
  
  //Add event to db
  createEvent(ev:CalendarEvent){
    return this.http.post("/create_event", ev, OPTIONS )
            .toPromise()
  }

  //get all events from db
  getAllEvents(){
    return this.http.get("/get_events")
            .map(data=>data.json())
            .toPromise()
  }

}

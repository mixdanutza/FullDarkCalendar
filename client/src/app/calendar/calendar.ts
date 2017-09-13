import * as moment from 'moment';

export class Calendar {
    current: moment.Moment;
    events: any;
    el: Element;
    today = moment();

   constructor(selector: string, events) {
    this.el = document.querySelector(selector);
    this.events = events;
    this.current = moment().date(1);
    this.draw();
    var current = document.querySelector('.today');
    
    if(current) {
      var self = this;
      window.setTimeout(function() {
        self.openDay(current);
      }, 500);
    }
    this.formPopover()
  }

  draw = function() {
    // Create Header
    this.drawHeader();

    // Draw Month
    this.drawMonth();

    this.drawLegend();
  };

  drawHeader = function() {
    var self = this;
    if(!this.header) {
      // Create the header elements
      this.header = this.createElement('div', 'header');
      this.header.className = 'header';

      this.title = this.createElement('h1');

      var right = this.createElement('div', 'right');
      right.addEventListener('click', function() { self.nextMonth(); });

      var left = this.createElement('div', 'left');
      left.addEventListener('click', function() { self.prevMonth(); });

      //Create today button 
      var todayButton=this.createElement('button', 'todayButton', 'Today');
      todayButton.className += " darkButton"
      todayButton.addEventListener('click', ()=>{
          this.current = moment().date(1);
          this.draw();
          var current = document.querySelector('.today');
          
          if(current) {
          console.log(current +"^^^^")
            var self = this;
            window.setTimeout(function() {
              self.openDay(current);
            }, 500);
          }
      })

      // Append the Elements
      this.header.appendChild(todayButton)
      this.header.appendChild(this.title); 
      this.header.appendChild(right);
      this.header.appendChild(left);
      this.el.appendChild(this.header);
    }

    this.title.innerHTML = this.current.format('MMMM YYYY');
  }

  drawMonth = function() {
    var self = this;
    
    // this.events.forEach((ev) =>{
    //  console.log(ev.date)
    // //  ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
    //  console.log(ev.date)
    // });
    
    
    if(this.month) {
      this.oldMonth = this.month;
      this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
      this.oldMonth.addEventListener('webkitAnimationEnd', function() {
        self.oldMonth.parentNode.removeChild(self.oldMonth);

        self.month = self.createElement('div', 'month');
        self.backFill();
        self.currentMonth();
        self.fowardFill();
        self.el.appendChild(self.month);
        window.setTimeout(function() {
          self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
        }, 16);
      });
    } else {
        this.month = this.createElement('div', 'month');
        this.el.appendChild(this.month);
        this.backFill();
        this.currentMonth();
        this.fowardFill();
        this.month.className = 'month new';
    }
  }

  backFill = function() {
    var clone = this.current.clone();
    var dayOfWeek = clone.day();

    if(!dayOfWeek) { return; }

    clone.subtract('days', dayOfWeek+1);

    for(var i = dayOfWeek; i > 0 ; i--) {
      this.drawDay(clone.add('days', 1));
    }
  }

  fowardFill = function() {
    var clone = this.current.clone().add('months', 1).subtract('days', 1);
    var dayOfWeek = clone.day();

    if(dayOfWeek === 6) { return; }

    for(var i = dayOfWeek; i < 6 ; i++) {
      this.drawDay(clone.add('days', 1));
    }
  }

  currentMonth = function() {
    var clone = this.current.clone();

    while(clone.month() === this.current.month()) {
      this.drawDay(clone);
      clone.add('days', 1);
    }
  }

  getWeek = function(day) {
    if(!this.week || day.day() === 0) {
      this.week = this.createElement('div', 'week');
      this.month.appendChild(this.week);
    }
  }

  drawDay = function(day) {
      
    var self = this;
    this.getWeek(day);

    // Outer Day
    var outer = this.createElement('div', this.getDayClass(day));
    outer.addEventListener('click', function() {
      self.openDay(this);
    });

    // Day Name
    var name = this.createElement('div', 'day-name', day.format('ddd'));

    // Day Number
    var number = this.createElement('div', 'day-number', day.format('DD'));


    // Events
    var events = this.createElement('div', 'day-events');
    this.drawEvents(day, events);

    outer.appendChild(name);
    outer.appendChild(number);
    outer.appendChild(events);
    this.week.appendChild(outer);
  }

  drawEvents = function(day, element) {
    if(day.month() === this.current.month()) {
      let todaysEvents = this.events.reduce(function(memo, ev) {
        if(ev.start===day.format("YYYY-MM-DD")) {
          memo.push(ev);
        }
        return memo;
      }, []);

      todaysEvents.forEach((ev) =>{
        var evSpan = this.createElement('span', ev.color);

        element.appendChild(evSpan);
      });
    }
  }
  

  getDayClass = function(day) {
    var classes = ['day'];
    if(day.month() !== this.current.month()) {
      classes.push('other');
    } else if (this.today.isSame(day, 'day')) {
      classes.push('today');
    }
    return classes.join(' ');
  }

  openDay = function(el) {
    var details, arrow;
    var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
    var day = this.current.clone().date(dayNumber);

    var currentOpened = document.querySelector('.details');

    // Check to see if there is an open detais box on the current row
    if(currentOpened && currentOpened.parentNode === el.parentNode) {
      details = currentOpened;
      arrow = document.querySelector('.arrow');
    } else {
      // Close the open events on differnt week row
      // currentOpened && currentOpened.parentNode.removeChild(currentOpened);
      if(currentOpened) {
        currentOpened.addEventListener('webkitAnimationEnd', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('oanimationend', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('msAnimationEnd', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('animationend', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.className = 'details out';
      }

      // Create the Details Container
      details = this.createElement('div', 'details in');

      // Create the arrow
      var arrow = this.createElement('div', 'arrow');

      // Create the event wrapper

      details.appendChild(arrow);
      el.parentNode.appendChild(details);
    }

    var todaysEvents = this.events.reduce(function(memo, ev) {
      if(ev.start===day.format("YYYY-MM-DD")) {
        memo.push(ev);
      }
      return memo;
    }, []);

    this.renderEvents(todaysEvents, details);

    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + 'px';
  }

  renderEvents = function(events, ele) {
    var self=this;

    // Remove any events in the current details element
    var currentWrapper = ele.querySelector('.events');
    var wrapper = this.createElement('div', 'events in' + (currentWrapper ? ' new' : ''));



    //Create new event button
    var addEventButton = this.createElement('button','addEventButton', "Add")
    addEventButton.className += " darkButton";
    addEventButton.addEventListener('click', function() { 
        self.displayForm();
    });

    wrapper.appendChild(addEventButton);



    events.forEach((ev) => {



      var div = this.createElement('div', 'event');
    // *********************************************************************************************
  
      var infoBox=self.createElement('div', 'infoBox', ev.title);
      var square = this.createElement('div', 'event-category ' + ev.color);
      var span = this.createElement('span', '', ev.title);

      
      div.addEventListener('click', function(){
          var info=document.querySelector(".infoBox");
          if(info){
            info.remove();  
          }else{
            div.appendChild(infoBox);
            var info=document.querySelector(".infoBox");
            info.innerHTML = "<p class='infoText'><strong>Title: </strong>"+ev.title+"</p> <p class='infoText'><strong>Type: </strong>"+ev.type+"</p> <p class='infoText'><strong>Start: </strong>"+ev.start+"</p> <p class='infoText'><strong>Description: </strong>"+ev.description+"</p>"
          } 
      })
      div.appendChild(square);
      div.appendChild(span);
      wrapper.appendChild(div);
    });

    if(!events.length) {
      var div = this.createElement('div', 'event empty');
      var span = this.createElement('span', '', 'No Events');

      div.appendChild(span);
      wrapper.appendChild(div);
    }

    if(currentWrapper) {
      currentWrapper.className = 'events out';
      currentWrapper.addEventListener('webkitAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('oanimationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('msAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('animationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
    } else {
      ele.appendChild(wrapper);
    }
  }

  drawLegend = function() {
    var legend = this.createElement('div', 'legend');
    var calendars = this.events.map(function(e) {
      return e.type + '|' + e.color;
    }).reduce(function(memo, e) {
      if(memo.indexOf(e) === -1) {
        memo.push(e);
      }
      return memo;
    }, []).forEach((e)=>{
      var parts = e.split('|');
      var entry = this.createElement('span', 'entry ' +  parts[1], parts[0]);
      legend.appendChild(entry);
    });
    this.el.appendChild(legend);
  };

  nextMonth = function() {
    this.current.add('months', 1);
    this.next = true;
    this.draw();
  };

  prevMonth = function() {
    this.current.subtract('months', 1);
    this.next = false;
    this.draw();
  };

  // window.Calendar = Calendar;




  addDate(ev) {

  }

  createElement = function(tagName, className, innerText) {
    let ele = document.createElement(tagName);
    if(className) {
      ele.className = className;
    }
    if(innerText) {
      ele.innderText = ele.textContent = innerText;
    }
    return ele;
  }
  displayForm=function(){      
    var form=document.getElementById("eventForm");
    if(form!=null){
        form.style.display="block"
    }
  }

  
  formPopover=function(){
    var form = document.getElementById('eventForm');
    var span = document.getElementsByClassName("closeForm")[0];
    var submit= document.getElementById("submitEvent");

    //Close the modal after submiting the form
    submit.addEventListener("click", function(){
      form.style.display="none";
    })
    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click",function() {
      form.style.display = "none";
    })
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == form) {
            form.style.display = "none";
        }
    }
  }


}

import {EventsRecord} from './model/events-record';

export class LocationHistory {

  location: Location;
  events: EventsRecord;

  constructor(location: Location, element: any) {
    this.location = location;
    this.events = new EventsRecord(element);
  }

  get label(): string {
    return this.location.pathname;
  }
}



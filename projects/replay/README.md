# Gideon Replay

![alt text](https://github.com/tmdt-buw/gideon-replay/blob/master/img/overview.png)

Gideon replay is a publicly freely available library that can be integrated into any web application with just a few lines of code to record and replay user interactions such as mouse clicks and keystrokes. Replay can be controlled via a web player interface. This interface shows activity types and idle times as well as an attention heat map. In addition, we enable the export of all interactions for a later analysis. In summary, Gideon provides free, easy tracking of user interactions and significantly reduces the effort required for specified and customized tracking solutions.

## Example

Explore our example app [here](https://tmdt-buw.github.io/gideon-replay/).

Our demo application is implemented with Angular and contains two views. First, a basic view with two linked charts, where you can hover and click to select the data of the chart. Second, a more advanced view of an interactive chart where the data points can be dragged and axes can be zoomed.
By using a frontend framework, a developer can implement an abstract _TrackedComponent_ that registers its element on Gideon Replay. This way, other components that are to be tracked by Gideon Replay simply have to inherit from this abstract component.

### Example using Angular
To make tracking components more abstract using a frontend library like Angular, the tracking can be implemented via a reusable abstract component:
```
import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import { Gideon } from '@tmdt-buw/gideon-replay';

@Component({
template: ''
})
export abstract class TrackedComponent implements AfterViewInit, OnDestroy {

@ViewChild('container') container: any;

protected constructor(private gideon: Gideon) {
}

abstract reset(): void;

  ngAfterViewInit(): void {
    this.gideon.registerElement(this.container.nativeElement);
  }
  
  ngOnDestroy(): void {
    this.gideon.stopReplay();
  }
}
```
Usage in actual component:
```
import { AfterViewInit, Component } from '@angular/core';
import { Gideon } from '@tmdt-buw/gideon-replay';
import { TrackedComponent } from "./tracked.component";

@Component({
  selector: 'app-...',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends TrackedComponent implements AfterViewInit {
  
  constructor() {
    super(Gideon.getInstance());
  }

  override reset(): void {
      // reset app to inital state to init replay
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

}
```

## Install

Install the Gideon Replay library via

```npm install @tmdt-buw/gideon-replay```

Include css styles into your own styles.css file

```@import "../node_modules/@tmdt-buw/gideon-replay/style/gideon.scss";```

## Track HTML-elements

Tracking an element also tracks all interactions performed on child elements inside the element,
i.e. if you want to track a chart element containing several svg elements you only register the chart container.
Register only the body element if your want to track the whole application.

Tracking user interactions on a component is just one line of code:

```Gideon.getInstance().registerElement(element);```

## Get complete history

Retrieve the complete history of interactions on all elements:

```const history = Gideon.getInstance().getHistoryRecords();```

## Replay user interactions

Replay a history record on an HTML-element:

```Gideon.getInstance().getHistoryRecords(htmlElement, historyRecord);```

Replay a history record on a stateful HTML-element with reset function to reset view:

```Gideon.getInstance().getHistoryRecords(htmlElement, historyRecord, () => reset());```

Stop current replay:

```Gideon.getInstance().stopReplay();```

## Export / Import

Export complete history:

```Gideon.getInstance().export();```

Export specific element history:

```Gideon.getInstance().export(history);```

### Data Format

The export contains a list of histories (one per tracked element) in JSON-format. The histories, in turn, include a list of tracked mouse, wheel and keyboard events which are a reduced version of the common browser events.
Element always contains the css selector to the triggering element.

Mouse event format. Type is one of the [browser mouse event types](https://www.w3schools.com/jsref/obj_mouseevent.asp).
```
{
  time: number;
  x: number;
  y: number;
  type: string;
  element: string;
}
```

Wheel event format. Type is one of the [browser wheel event types](https://www.w3schools.com/jsref/obj_wheelevent.asp).
```
{
  time: number;
  type: string;
  event: {
    deltaX: number;
    deltaY: number;
    deltaZ: number;
    deltaMode: number;
  };
  element: string;
}
```

Mouse event format. Type is one of the [browser keyboard event types](https://www.w3schools.com/jsref/obj_keyboardevent.asp).
```
{
  time: number;
  x: number;
  y: number;
  type: string;
  element: string;
}
```

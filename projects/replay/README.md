# Gideon Replay

![alt text](https://github.com/tmdt-buw/gideon-replay/blob/master/img/overview.png)

Gideon replay is a publicly freely available library that can be integrated into any web application with just a few lines of code to record and replay user interactions such as mouse clicks and keystrokes. Replay can be controlled via a web player interface. This interface shows activity types and idle times as well as an attention heat map. In addition, we enable the export of all interactions for a later analysis. In summary, Gideon provides free, easy tracking of user interactions and significantly reduces the effort required for specified and customized tracking solutions.

## Example

Explore our example app [here](https://tmdt-buw.github.io/gideon-replay/).

Our demo application is implemented with Angular and contains two views. First, a basic view with two linked charts, where you can hover and click to select the data of the chart. Second, a more advanced view of an interactive chart where the data points can be dragged and axes can be zoomed.
By using a frontend framework, a developer can implement an abstract _TrackedComponent_ that registers its element on Gideon Replay. This way, other components that are to be tracked by Gideon Replay simply have to inherit from this abstract component.

## Install

Install the Gideon Replay library via

```npm install @tmdt-buw/gd-replay```

Include css styles into your own styles.css file

```@import "@tmdt-buw/gd-replay/lib/style/gideon.scss";```

## Track HTML-elements

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

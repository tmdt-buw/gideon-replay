# Gideon Replay

Gideon replay is a publicly freely available library that can be integrated into any web application with just a few lines of code to record and replay user interactions such as mouse clicks and keystrokes. Replay can be controlled via a web player interface. This interface shows activity types and idle times as well as an attention heat map. In addition, we enable the export of all interactions for a later analysis. In summary, Gideon provides free, easy tracking of user interactions and significantly reduces the effort required for specified and customized tracking solutions.

## Example

Explore our example app here.

## Install

Install the Gideon Replay library via

```npm install @gideon/replay```

Include css styles into your own styles.css file

```@import "@gideon/replay/src/lib/style/gideon.scss";```

## Track HTML-elements

Tracking user interactions on a component is just one line of code:

```Gideon.getInstance().registerElement(element);```

## Get complete history

Retrieve the complete history of interactions on all elements:

```const history = Gideon.getInstance().getHistoryRecords();```

## Replay user interactions

Replay a history record on an HTML-element:

```Gideon.getInstance().getHistoryRecords(htmlElement, historyRecord);```

Stop current replay:

```Gideon.getInstance().stopReplay();```

## Export / Import

Export complete history:

```Gideon.getInstance().export();```

Export specific element history:

```Gideon.getInstance().export(history);```

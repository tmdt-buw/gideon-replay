import {Platform} from '@angular/cdk/platform';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Gideon} from '../../projects/replay/src/lib/gideon';
import {LocationHistory} from '../../projects/replay/src/lib/record/location-history';
import {appRoutingNames} from './app-routing.names';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  readonly routes = appRoutingNames;

  isCollapsed = true;
  gideon = Gideon.getInstance();
  tested = true;

  trackedComponent;

  constructor(private router: Router, private platform: Platform) {
    this.tested = platform.BLINK || platform.FIREFOX;
  }

  onActivate(componentRef: any) {
    this.trackedComponent = componentRef;
  }

  replay(history: LocationHistory) {
    this.router.navigate([history.location.pathname]).then(() => {
      setTimeout(() => {
        this.trackedComponent.reset();
        this.gideon.replay(this.trackedComponent.container.nativeElement, history);
      });
    });
  }
}

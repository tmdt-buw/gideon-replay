import {Platform} from '@angular/cdk/platform';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Gideon, LocationHistory} from '@tmdt-buw/gideon-replay';
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

  onActivate(componentRef: any): void  {
    this.trackedComponent = componentRef;
  }

  getLabel(history: LocationHistory): string {
    const url = location.pathname.split('/');
    return url[url.length - 1];
  }

  replay(history: LocationHistory): void  {
    const url = history.location.pathname.split('/');
    const segment = url[url.length - 1];
    this.router.navigate([segment]).then(() => {
      setTimeout(() => {
        this.isCollapsed = true;
        this.trackedComponent.reset();
        this.gideon.replay(this.trackedComponent.container.nativeElement, history, () => this.trackedComponent.reset());
      });
    });
  }
}

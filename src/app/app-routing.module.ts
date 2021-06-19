import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdvancedComponent} from './advanced/advanced/advanced.component';
import {appRoutingNames} from './app-routing.names';
import {BasicComponent} from './basic/basic/basic.component';

const routes: Routes = [
  {path: '', redirectTo: appRoutingNames.BASIC, pathMatch: 'full'},
  {path: appRoutingNames.BASIC, component: BasicComponent},
  {path: appRoutingNames.ADVANCED, component: AdvancedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

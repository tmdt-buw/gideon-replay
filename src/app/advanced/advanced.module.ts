import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxEchartsModule} from 'ngx-echarts';
import {SharedModule} from '../shared.module';
import {AdvancedComponent} from './advanced/advanced.component';


@NgModule({
  declarations: [AdvancedComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxEchartsModule
  ]
})
export class AdvancedModule {
}

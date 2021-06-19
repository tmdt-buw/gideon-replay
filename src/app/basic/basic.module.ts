import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgxEchartsModule} from 'ngx-echarts';
import {SharedModule} from '../shared.module';
import {BasicComponent} from './basic/basic.component';


@NgModule({
  declarations: [BasicComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxEchartsModule
  ]
})
export class BasicModule {
}

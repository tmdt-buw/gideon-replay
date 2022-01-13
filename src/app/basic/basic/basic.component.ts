import {AfterViewInit, Component} from '@angular/core';
import {connect, getInstanceByDom} from 'echarts';
import {TrackedComponent} from '../../../../projects/replay/src/examples/angular/tracked.component';
import {Gideon} from '../../../../projects/replay/src/lib/gideon';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.less']
})
export class BasicComponent extends TrackedComponent implements AfterViewInit {

  constructor() {
    super(Gideon.getInstance());
  }

  initOptions = {renderer: 'svg'};

  options1 = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Counters',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220]
      }
    ]
  };

  options2 = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Counters',
        type: 'bar',
        barWidth: '60%',
        data: [23, 34, 175, 275, 355, 300, 215]
      }
    ],
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    }
  };

  /**
   * Executed after view construction, connects charts and registers click event
   */
  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    setTimeout(() => {
      const chartElement1 = document.getElementById('chart1');
      const chartElement2 = document.getElementById('chart2');
      const chart1 = getInstanceByDom(chartElement1);
      const chart2 = getInstanceByDom(chartElement2);
      connect([chart1, chart2]);
      chart1.on('click', (params) => {
        this.updateChart(params.dataIndex).then();
      });
      chart2.on('click', (params) => {
        this.updateChart(params.dataIndex).then();
      });
      this.updateChart().then();
    });
  }

  /**
   * Update chart marking the selection or resetting selection if no selection given
   * @param selection index of selected data
   */
  async updateChart(selection?: number) {
    let chart1;
    let chart2;
    while (!chart1 || !chart2) {
      const chartElement1 = document.getElementById('chart1');
      chart1 = getInstanceByDom(chartElement1);
      const chartElement2 = document.getElementById('chart2');
      chart2 = getInstanceByDom(chartElement2);
      await new Promise(r => setTimeout(r, 100));
    }
    const data1 = [10, 52, 200, 334, 390, 330, 220].map((value, index) => {
      if (selection !== undefined && selection === index) {
        return {
          value,
          itemStyle: {
            color: '#a90000'
          }
        };
      } else {
        return {
          value
        };
      }
    });
    chart1.setOption({
      series: [
        {
          name: 'Counters',
          type: 'bar',
          barWidth: '60%',
          data: data1
        }
      ]
    });
    const data2 = [23, 34, 175, 275, 355, 300, 215].map((value, index) => {
      if (selection !== undefined && selection === index) {
        return {
          value,
          itemStyle: {
            color: '#a90000'
          }
        };
      } else {
        return {
          value
        };
      }
    });
    chart2.setOption({
      series: [
        {
          name: 'Counters',
          type: 'bar',
          barWidth: '60%',
          data: data2
        }
      ]
    });
  }

  /**
   * Clear the chart selection
   */
  reset(): void {
    this.updateChart().then();
  }
}

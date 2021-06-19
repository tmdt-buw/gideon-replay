import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {getInstanceByDom} from 'echarts';
import ResizeObserver from 'resize-observer-polyfill';
import {TrackedComponent} from '../../../../projects/replay/src/examples/angular/tracked.component';
import {Gideon} from '../../../../projects/replay/src/lib/gideon';


@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.less']
})
export class AdvancedComponent extends TrackedComponent implements OnDestroy {

  @ViewChild('container') container: ElementRef;

  symbolSize = 20;
  data = [
    [15, 0],
    [-50, 10],
    [-56.5, 20],
    [-46.5, 30],
    [-22.1, 40]
  ];
  options = {
    title: {
      left: 'center',
      text: 'Advanced Example',
      subtext: 'Hover and drag data'
    },
    tooltip: {
      triggerOn: 'none',
      formatter: (params) =>
        'X: ' + params.data[0].toFixed(2) + '<br>Y: ' + params.data[1].toFixed(2)
    },
    xAxis: {
      min: -100,
      max: 80,
      type: 'value',
      axisLine: {onZero: false}
    },
    yAxis: {
      min: -30,
      max: 60,
      type: 'value',
      axisLine: {onZero: false}
    },
    dataZoom: [
      {
        id: 'zx',
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'empty'
      },
      {
        id: 'zy',
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'empty'
      }
    ],
    series: [
      {
        id: 'a',
        type: 'line',
        smooth: true,
        symbolSize: this.symbolSize,
        data: this.data,
        animation: false
      }
    ]
  };

  constructor() {
    super(Gideon.getInstance());
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /**
   * Create chart functionality (dragging of points / axis zoom)
   * @param chart
   */
  onChartReady(chart: any): void {
    // Add shadow circles (which is not visible) to enable drag.
    setTimeout(() => {
      chart.setOption({
        graphic: this.data.map((item, dataIndex) => {
          return {
            type: 'circle',
            position: chart.convertToPixel({gridIndex: 0}, item),
            shape: {
              cx: 0,
              cy: 0,
              r: this.symbolSize / 2
            },
            invisible: true,
            draggable: true,
            ondrag: (evt) => this.onPointDragging(chart, dataIndex, [evt.offsetX, evt.offsetY]),
            onmousemove: () => this.showTooltip(chart, dataIndex),
            onmouseout: () => this.hideTooltip(chart),
            z: 100
          };
        })
      });
      const chartElement = document.getElementById('chart-adv');
      const observer = new ResizeObserver(entries => {
        this.updatePosition();
      });
      observer.observe(chartElement);
      chart.on('dataZoom', (event) => {
        this.updatePosition();
      });
    }, 0);
  }

  showTooltip(chart: any, dataIndex: number) {
    chart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex
    });
  }

  hideTooltip(chart: any) {
    chart.dispatchAction({
      type: 'hideTip'
    });
  }

  onPointDragging(chart: any, dataIndex: number, pos: number[][]) {
    this.data[dataIndex] = chart.convertFromPixel('grid', pos);
    // Update data
    chart.setOption({
      series: [{
        id: 'a',
        data: this.data
      }]
    });
  }

  updatePosition() {
    const chartElement = document.getElementById('chart-adv');
    if (chartElement) {
      const chart = getInstanceByDom(chartElement);
      chart.setOption({
        graphic: this.data.map((item) => ({
          position: chart.convertToPixel({gridIndex: 0}, item)
        }))
      });
    }
  }

  async reset() {
    let chart;
    while (!chart) {
      const chartElement = document.getElementById('chart-adv');
      chart = getInstanceByDom(chartElement);
      await new Promise(r => setTimeout(r, 100));
    }
    this.data = [
      [15, 0],
      [-50, 10],
      [-56.5, 20],
      [-46.5, 30],
      [-22.1, 40]
    ];
    chart.setOption({
      dataZoom: [
        {
          id: 'zx',
          start: 0,
          end: 100
        },
        {
          id: 'zy',
          start: 0,
          end: 100
        }
      ],
      series: [{
        id: 'a',
        data: this.data
      }]
    });
    this.updatePosition();
  }
}

import { AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Chart,registerables} from 'chart.js'

Chart.register(...registerables);
@Component({
  selector: 'app-admin-dash',
  imports: [ ],
  templateUrl: './admin-dash.component.html'
})
export class AdminDashComponent implements AfterViewInit {
 public config: any = {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Total Website Views (2025)', // or another year
      data: [1200, 1500, 1700, 1600, 2000, 2400, 2200, 2100, 2300, 2500, 2700, 3000],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.3, 
      pointBackgroundColor: 'rgb(75, 192, 192)'
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Views'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    }
  }
};
public trafficByDeviceConfig: any = {
  type: 'doughnut',
  data: {
    labels: ['Desktop (Windows & Mac)', 'Android', 'IOS'],
    datasets: [{
      label: 'Traffic by Device',
      data: [60, 30, 10], 
      backgroundColor: [
        '#00BFFF', // Sky Blue for Desktop
        '#007BFF', // Primary Blue for Mobile
        '#6C757D'  // Muted Blue Gray for Tablet
      ],
      hoverOffset: 10
    }]
  },
  options: {
    plugins: {
      legend: {
        position: 'bottom'
      },
    }
  }
};

  chart:any;
  trafficChart:any;
  constructor(private cdr:ChangeDetectorRef){}
  ngAfterViewInit(): void {
    this.trafficChart = new Chart('TrafficDeviceChart', this.trafficByDeviceConfig);
    this.chart = new Chart('MyChart', this.config);

    this.cdr.detectChanges();  
  }

}

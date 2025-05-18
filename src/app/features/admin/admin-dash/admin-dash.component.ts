import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import gsap from 'gsap';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dash',
  standalone: true,
  imports: [],
  templateUrl: './admin-dash.component.html'
})
export class AdminDashComponent implements AfterViewInit {
  @ViewChildren('statCard') statCards!: QueryList<ElementRef>;
  @ViewChildren('chartsWrapper') chartsWrapper!: QueryList<ElementRef>;

  public config: any = {
    type: 'line',
    data: {
      labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      datasets: [{
        label: 'Total Website Views (2025)',
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
          title: { display: true, text: 'Views' }
        },
        x: {
          title: { display: true, text: 'Month' }
        }
      },
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { enabled: true }
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
        backgroundColor: ['#00BFFF', '#007BFF', '#6C757D'],
        hoverOffset: 10
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  };

  chart: any;
  trafficChart: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.chart = new Chart('MyChart', this.config);
    this.trafficChart = new Chart('TrafficDeviceChart', this.trafficByDeviceConfig);

    // Animate stat cards
    gsap.from(this.statCards.map(c => c.nativeElement), {
      opacity: 0.3,
      y: 40,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out'
    });

    // Animate charts
    gsap.from(this.chartsWrapper.map(c => c.nativeElement), {
      opacity: 0.3,
      y: 50,
      duration: 1.2,
      stagger: 0.3,
      ease: 'power3.out',
      delay: 0.5
    });

    this.cdr.detectChanges();
  }
}

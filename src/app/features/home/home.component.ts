import { Component } from '@angular/core';
import { HomeSec1Component } from './home-sec1/home-sec1.component';
import { HomeSec2Component } from './home-sec2/home-sec2.component';
import { HomeSec3Component } from './home-sec3/home-sec3.component';
import { HomeSec4Component } from './home-sec4/home-sec4.component';
import { HomeSec5Component } from "./home-sec5/home-sec5.component";


@Component({
  selector: 'app-home',
  imports: [
    HomeSec1Component,
    HomeSec2Component,
    HomeSec3Component,
    HomeSec4Component,
    HomeSec5Component
],
  templateUrl: './home.component.html',
  styles:''
})
export class HomeComponent {}

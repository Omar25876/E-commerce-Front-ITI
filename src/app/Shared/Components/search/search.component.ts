import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { SearchContentComponent } from "../search-content/search-content.component";
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    SearchContentComponent
  ],
  providers: [ProductService],
  templateUrl: './search.component.html',
  styles: ``
})
export class SearchComponent implements OnInit, AfterViewInit {
  activeFilters: any = {};

  // Animate sidebar and search-content individually
  @ViewChild('pageWrapper', { static: true }) pageWrapper!: ElementRef;
  @ViewChildren('sectionWrapper') sections!: QueryList<ElementRef>;

  ngOnInit(): void {}

  onFiltersChanged(filters: any) {
    this.activeFilters = filters;
  }

  ngAfterViewInit(): void {
     gsap.from(this.pageWrapper.nativeElement, {
      duration: 0.8,
      y: 40,
      opacity: 0.3,
      ease: 'power2.out'
    });
    const elements = this.sections.map(el => el.nativeElement);

    gsap.from(elements, {
      opacity: 0.3,
      y: 40,
      duration: 0.7,
      stagger: 0.2,
      ease: 'power2.out'
    });
  }
}

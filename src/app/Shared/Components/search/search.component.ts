import { Component, Input } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { SearchContentComponent } from "../search-content/search-content.component";
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class SearchComponent {
  activeFilters: any = {};
  @Input() searchTerm: string = ''
  onFiltersChanged(filters: any) {
    this.activeFilters = filters ;
    this.searchTerm = filters.searchTerm;
  }
}

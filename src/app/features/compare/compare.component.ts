import { Component, OnInit } from '@angular/core';
import { CompareService } from '../../services/compare.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from "../../Shared/Components/product-card/product-card.component";
import { Product } from '../../models/productModel';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../models/brandModel';
import { map } from 'rxjs';

@Component({
  selector: 'app-compare',
  imports: [
    FormsModule,
    CommonModule,
    ProductCardComponent
  ],
  providers: [ProductService, BrandService],
  templateUrl: './compare.component.html',
  styles: ``
})
export class CompareComponent implements OnInit {

  constructor(
    private compareprodServ: CompareService,
    private productsrv: ProductService,
    private brandsrv: BrandService
  ) {}

  // قائمة المنتجات المختارة للمقارنة
  productCompare: Product[] = [];

  // قائمة كل الماركات
  brands: Brand[] = [];

  // قائمة كل المنتجات
  products: Product[] = [];

  // Map لتخزين ربط بين ID الماركة واسمها لسهولة العرض
  brandMap = new Map<string, string>();

  ngOnInit(): void {
    // اشتراك في المنتجات المختارة للمقارنة
    this.compareprodServ.compareProducts$.subscribe(data =>
      this.productCompare = data
    );

    // جلب جميع الماركات وتخزينها في brandMap
    this.brandsrv.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
        this.brandMap = new Map(data.map(dat => [dat._id, dat.name]));
      }
    });

    // جلب جميع المنتجات لتسهيل استخراج التفاصيل (مثل الألوان والمواصفات)
    this.productsrv.getAllProductsbyFilters().subscribe({
      next: (data) => {
        this.products = data;
        console.log(this.products);
      }
    });
  }

  // دالة لإرجاع اسم الماركة بناءً على ID
  getBrandname(brand: string): string {
    return this.brandMap.get(brand) || 'Unknown Brand';
  }

  // دالة للحصول على جميع الألوان المتاحة لمنتج معين باستخدام الـ id
  getProductColors(id: string): string[] {
    const product = this.products.find(prod => prod._id === id);
    if (product && product.imagesAndColors) {
      const colors = Object.keys(product.imagesAndColors);
      return colors;
    }
    return [];
  }

  // دالة لإرجاع أنواع القيم الموجودة تحت مفتاح محدد في الـ specs (مثل Charging Port)
  getType(id: string, key: string): string[] {
    const product = this.products.find(prod => prod._id === id);
    if (product && product.specs) {
      const value = product.specs[key];
      return Array.isArray(value) ? value : [String(value)];
    }
    return [];
  }

  // إزالة منتج من المقارنة
  remove(id: string) {
    this.compareprodServ.removeFromCompare(id);
  }

  // مسح جميع المنتجات من المقارنة
  clear() {
    this.compareprodServ.clearCompare();
  }
}

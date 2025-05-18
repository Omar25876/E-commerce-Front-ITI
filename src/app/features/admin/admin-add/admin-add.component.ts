import {
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromoCodeService } from '../../../services/PromoCode.service';
import { MessageService } from '../../../services/message.service';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/productModel';
import { PromoCode } from '../../../models/PromoCodeModel';
import { Category } from '../../../models/categoryModel';
import gsap from 'gsap';

@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AdminAddComponent implements OnInit, AfterViewInit {
  @ViewChildren('section') sections!: QueryList<ElementRef>;

  driverSize = '';
  BluetoothVersion = '';
  ChargingPort = '';
  BatteryLife = '';
  whatInTheBoxText = '';
  highlightsText = '';

  PromoCode: PromoCode = {
    _id: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    expiryDate: '',
    isActive: false,
    usageLimit: 0,
    usedCount: 0,
    createdAt: '',
    updatedAt: '',
  };

  MyProduct: Product = {
    _id: '',
    name: '',
    description: '',
    price: 0,
    oldPrice: 0,
    discount: 0,
    colors: [],
    images: [],
    imagesAndColors: {},
    selectedColor: '',
    stock: 0,
    rating: 0,
    reviewsCount: 0,
    reviews: [],
    highlights: [],
    specs: {},
    modelNumber: '',
    modelName: '',
    whatsInTheBox: [],
    isPopular: false,
    isNewArrival: false,
    isDiscover: false,
    category: '',
    brand: '',
    createdAt: '',
    updatedAt: '',
  };

  categories: Category[] = [];
  selectedCategoryBrands: any[] = [];

  imagePreviews: string[] = [];
  selectedImages: File[] = [];

  constructor(
    private promoSer: PromoCodeService,
    private msgSer: MessageService,
    private cateSer: CategoryService,
    private productSer: ProductService
  ) {}

  ngOnInit() {
    this.cateSer.getAllCategories().subscribe({
      next: (res) => (this.categories = res),
      error: (err) => console.error(err),
    });
  }

  ngAfterViewInit(): void {
    gsap.from(
      this.sections.map((sec) => sec.nativeElement),
      {
        opacity: 0.3,
        y: 30,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out',
      }
    );
  }

  onCategoryChange(evt: Event) {
    const value = (evt.target as HTMLSelectElement).value;
    const cat = this.categories.find((c) => c.categoryName === value);
    this.selectedCategoryBrands = cat ? cat.brandNames : [];
    this.MyProduct.category = value;
    this.MyProduct.brand = '';
  }

  PromoSave() {
    if (
      !this.PromoCode.code ||
      !this.PromoCode.usageLimit ||
      !this.PromoCode.discountValue ||
      !this.PromoCode.expiryDate
    ) {
      this.msgSer.show('Please Fill In All Required Data First');
      return;
    }

    const temp = {
      code: this.PromoCode.code,
      usageLimit: this.PromoCode.usageLimit,
      discountValue: this.PromoCode.discountValue,
      expiryDate: this.PromoCode.expiryDate,
      discountType: this.PromoCode.discountType,
    };

    this.promoSer.createPromoCode(temp).subscribe({
      next: (res) => this.msgSer.show('Promo code created successfully'),
      error: (err) => console.error('Error creating promo code:', err),
    });
  }

  FVaildate(event: Event) {
    const input = event.target as HTMLInputElement;
    const inputName = input.id;

    if (inputName === 'DiscountValue') {
      let value = input.value.replace(/\D/g, '').slice(0, 3);
      if (parseInt(value, 10) > 100) value = '100';
      this.PromoCode.discountValue = parseInt(value, 10);
      input.value = value;
    }

    if (inputName === 'Limt') {
      let rawValue = input.value.replace(/\D/g, '').slice(0, 9);
      this.PromoCode.usageLimit = parseInt(rawValue || '0');
      input.value = Number(rawValue).toLocaleString();
    }

    if (inputName === 'Code') {
      const value = input.value.replace(/[^a-zA-Z0-9]/g, '');
      this.PromoCode.code = value;
      input.value = value;
    }

    if (inputName === 'expiryDate') {
      let raw = input.value.replace(/\D/g, '').slice(0, 8);
      let day = raw.slice(0, 2);
      let month = raw.slice(2, 4);
      let year = raw.slice(4, 8);

      if (day.length === 2) {
        let d = Math.max(1, Math.min(31, parseInt(day)));
        day = d.toString().padStart(2, '0');
      }

      if (month.length === 2) {
        let m = Math.max(1, Math.min(12, parseInt(month)));
        month = m.toString().padStart(2, '0');
      }

      if (year.length === 4) {
        let y = Math.max(2026, parseInt(year));
        year = y.toString();
      }

      let formatted = day;
      if (month) formatted += `-${month}`;
      if (year) formatted += `-${year}`;

      this.PromoCode.expiryDate = formatted;
      input.value = formatted;
    }
  }

  private splitLines = (t: string) =>
    t
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

  extractColorsAndImages(imagesAndColors: Record<string, string>): {
    colors: string[];
    images: string[];
  } {
    const colors = Object.keys(imagesAndColors);
    const images = Object.values(imagesAndColors);
    return { colors, images };
  }

  updateColor(index: number, color: string) {
    if (index >= 0 && index < this.MyProduct.colors.length) {
      this.MyProduct.colors[index] = color;
    }
  }

  onImageSelected(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;
    this.selectedImages = Array.from(files);
    this.imagePreviews = [];
    this.MyProduct.colors = [];

    this.selectedImages.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        this.imagePreviews.push((ev.target as any).result);
      reader.readAsDataURL(f);
      this.MyProduct.colors.push('#ffffff');
    });
  }

  removeImage(i: number) {
    this.selectedImages.splice(i, 1);
    this.imagePreviews.splice(i, 1);
  }

  saveProduct() {
    this.MyProduct.whatsInTheBox = this.splitLines(this.whatInTheBoxText);
    this.MyProduct.highlights = this.splitLines(this.highlightsText);
    this.MyProduct.specs = {
      driverSize: this.driverSize.trim(),
      BluetoothVersion: this.BluetoothVersion.trim(),
      ChargingPort: this.ChargingPort.trim(),
      BatteryLife: this.BatteryLife.trim(),
    };

    const errs: string[] = [];
    const r = this.MyProduct;
    if (!r.name.trim()) errs.push('Name required.');
    if (!r.description.trim()) errs.push('Description required.');
    if (!r.category) errs.push('Category required.');
    if (!r.brand) errs.push('Brand required.');
    if (r.price <= 0) errs.push('Price must be > 0.');
    if (r.stock < 0) errs.push('Stock cannot be negative.');
    if (r.discount < 0) errs.push('Discount cannot be negative.');
    if (r.oldPrice && r.oldPrice < r.price)
      errs.push('Old price must be ≥ price.');
    if (!this.selectedImages.length)
      errs.push('At least one image is required.');
    if (!r.highlights.length) errs.push('Add a highlight.');
    if (!r.whatsInTheBox.length) errs.push('“What’s in the Box” empty.');
    if (Object.values(r.specs).some((v) => !v))
      errs.push('Fill all spec fields.');

    if (errs.length) {
      this.msgSer.show(errs.join('\n'));
      return;
    }

    const fd = new FormData();
    fd.append('name', r.name);
    fd.append('description', r.description);
    fd.append('price', r.price.toString());
    fd.append('oldPrice', r.oldPrice.toString());
    fd.append('discount', r.discount.toString());
    fd.append('stock', r.stock.toString());
    fd.append('category', r.category);
    fd.append('brand', r.brand);
    fd.append('modelNumber', r.modelNumber);
    fd.append('modelName', r.modelName);
    fd.append('selectedColor', r.selectedColor);
    fd.append('isPopular', r.isPopular.toString());
    fd.append('isNewArrival', r.isNewArrival.toString());
    fd.append('isDiscover', r.isDiscover.toString());
    fd.append('highlights', JSON.stringify(r.highlights));
    fd.append('whatsInTheBox', JSON.stringify(r.whatsInTheBox));
    fd.append('specs', JSON.stringify(r.specs));
    fd.append('colors', JSON.stringify(r.colors));

    this.selectedImages.forEach((file) => {
      fd.append('file', file, file.name);
    });

    for (const pair of fd.entries()) {
      console.log(pair[0], pair[1]);
    }

    this.productSer.addProductFormData(fd).subscribe({
      next: () => this.msgSer.show('Product added.'),
      error: (err) => {
        console.error('Save product error', err);
        this.msgSer.show('Failed to add product.');
      },
    });
  }

  private resetForm() {
    this.MyProduct = {
      ...this.MyProduct,
      name: '',
      description: '',
      modelNumber: '',
      modelName: '',
      price: 0,
      oldPrice: 0,
      discount: 0,
      stock: 0,
      category: '',
      brand: '',
      selectedColor: '',
      highlights: [],
      whatsInTheBox: [],
      specs: {},
      isPopular: false,
      isNewArrival: false,
      isDiscover: false,
    };
    this.driverSize =
      this.BluetoothVersion =
      this.BatteryLife =
      this.ChargingPort =
        '';
    this.whatInTheBoxText = this.highlightsText = '';
    this.selectedImages = [];
    this.imagePreviews = [];
  }
}

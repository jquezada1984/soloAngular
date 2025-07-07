import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  code: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Input() isVisible = false;
  @Output() save = new EventEmitter<Product>();
  @Output() close = new EventEmitter<void>();

  productForm!: FormGroup;
  isEditing = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      if (this.product) {
        this.isEditing = true;
        setTimeout(() => {
          if (this.productForm && this.product) {
            this.productForm.patchValue(this.product);
          }
        });
      } else {
        this.isEditing = false;
        if (this.productForm) {
          this.productForm.reset();
        }
      }
    }
  }

  private initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required, Validators.min(0)]] ,
      stock: ['', [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isSubmitting = true;
      const productData: Product = {
        id: this.product?.id || this.generateId(),
        ...this.productForm.value
      };
      setTimeout(() => {
        this.save.emit(productData);
        this.isSubmitting = false;
        this.closeForm();
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  closeForm() {
    this.close.emit();
    this.productForm.reset();
    this.isEditing = false;
    this.isSubmitting = false;
  }

  private markFormGroupTouched() {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  private generateId(): number {
    return Math.floor(Math.random() * 10000) + 1;
  }
} 
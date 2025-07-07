import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../../../shared/components/nav-bar/nav-bar';
import { ProductFormComponent, Product } from '../product-form/product-form';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, NavBarComponent, ProductFormComponent],
  templateUrl: './product-list.html',
  styleUrls: ['../../../../shared/styles/list-styles.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  showForm = false;
  selectedProduct: Product | null = null;

  ngOnInit() {
    // Datos de ejemplo
    this.products = [
      {
        id: 1,
        name: 'Laptop HP Pavilion',
        description: 'Laptop de 15 pulgadas con procesador Intel i5',
        price: 899.99,
        stock: 15,
        category: 'Electrónicos',
        code: 'LAP-001'
      },
      {
        id: 2,
        name: 'Mouse Inalámbrico Logitech',
        description: 'Mouse ergonómico con conexión Bluetooth',
        price: 29.99,
        stock: 50,
        category: 'Accesorios',
        code: 'MOU-002'
      },
      {
        id: 3,
        name: 'Monitor Samsung 24"',
        description: 'Monitor LED Full HD con panel IPS',
        price: 199.99,
        stock: 25,
        category: 'Monitores',
        code: 'MON-003'
      }
    ];
  }

  addProduct() {
    this.selectedProduct = null;
    this.showForm = true;
  }

  editProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.showForm = true;
  }

  deleteProduct(productId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.products = this.products.filter(product => product.id !== productId);
    }
  }

  onSaveProduct(product: Product) {
    if (this.selectedProduct) {
      // Editar producto existente
      const index = this.products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        this.products[index] = product;
      }
    } else {
      // Agregar nuevo producto
      this.products.push(product);
    }
  }

  onCloseForm() {
    this.showForm = false;
    this.selectedProduct = null;
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
} 
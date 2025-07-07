import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PRODUCT_ROUTES } from './product.routes';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductFormComponent } from './components/product-form/product-form';

@NgModule({
  imports: [
    RouterModule.forChild(PRODUCT_ROUTES),
    ProductListComponent,
    ProductFormComponent
  ]
})
export class ProductModule {} 
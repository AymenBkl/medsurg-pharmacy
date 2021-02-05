import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BannerComponent } from '../banner/banner.component';

import { HeaderComponent } from '../header/header.component';
import { CategoriesComponent } from '../crm/categories/categories.component';
import { ProductsComponent } from '../crm/products/products.component';

import { EditCategoryComponent } from '../modals/edit-category/edit-category.component';
import { EditProductComponent } from '../modals/edit-product/edit-product.component';

import { PrescriptionsComponent } from '../posts/prescriptions/prescriptions.component';
import { PrescriptionComponent } from '../posts/prescription/prescription.component';

import { GetAllMessagesComponent } from '../messages/get-all-messages/get-all-messages.component';
import { SendMessageComponent } from '../messages/send-message/send-message.component';

import { OrderDetailComponent } from '../crm/orders/order-detail/order-detail.component';
import { AddProductToCommentComponent } from '../posts/add-product-to-comment/add-product-to-comment.component';
import { RefundDetailComponent } from '../crm/refund-detail/refund-detail.component';
import { PaymentDetailComponent } from '../payment-detail/payment-detail.component';

@NgModule({
  declarations: [
    EditProductComponent,
    BannerComponent,
    ProductsComponent,
    HeaderComponent,
    CategoriesComponent,
    EditCategoryComponent,
    PrescriptionsComponent,
    PrescriptionComponent,
    SendMessageComponent,
    GetAllMessagesComponent,
    OrderDetailComponent,
    AddProductToCommentComponent,
    RefundDetailComponent,
    PaymentDetailComponent
  ],
  exports: [
    BannerComponent,
    ProductsComponent,
    HeaderComponent,
    CategoriesComponent,
    EditCategoryComponent,
    EditProductComponent,
    PrescriptionsComponent,
    PrescriptionComponent,
    SendMessageComponent,
    GetAllMessagesComponent,
    OrderDetailComponent,
    AddProductToCommentComponent,
    RefundDetailComponent,
    PaymentDetailComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ShareModule { }

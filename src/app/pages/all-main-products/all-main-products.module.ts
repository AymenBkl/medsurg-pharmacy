import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllMainProductsPageRoutingModule } from './all-main-products-routing.module';

import { AllMainProductsPage } from './all-main-products.page';
import { ShareModule } from 'src/app/components/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllMainProductsPageRoutingModule,
    ShareModule
  ],
  declarations: [AllMainProductsPage]
})
export class AllMainProductsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentDetailPageRoutingModule } from './payment-detail-routing.module';

import { PaymentDetailPage } from './payment-detail.page';
import { ShareModule } from 'src/app/components/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentDetailPageRoutingModule,
    ShareModule
  ],
  declarations: [PaymentDetailPage]
})
export class PaymentDetailPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefundPageRoutingModule } from './refund-routing.module';

import { RefundPage } from './refund.page';
import { ShareModule } from 'src/app/components/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefundPageRoutingModule,
    ShareModule
  ],
  declarations: [RefundPage]
})
export class RefundPageModule {}

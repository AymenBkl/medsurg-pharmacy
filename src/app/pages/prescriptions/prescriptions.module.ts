import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrescriptionsPageRoutingModule } from './prescriptions-routing.module';

import { PrescriptionsPage } from './prescriptions.page';

import { ShareModule } from '../../components/share/share.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrescriptionsPageRoutingModule,
    ShareModule
  ],
  declarations: [PrescriptionsPage]
})
export class PrescriptionsPageModule {}

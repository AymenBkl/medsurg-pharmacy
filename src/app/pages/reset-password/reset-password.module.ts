import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordPageRoutingModule } from './reset-password-routing.module';

import { ResetPasswordPage } from './reset-password.page';
import { ShareModule } from 'src/app/components/share/share.module';
import { AngularFireModule } from '@angular/fire';
import { config } from 'src/app/services/config';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPasswordPageRoutingModule,
    ReactiveFormsModule,
    ShareModule,
    AngularFireModule.initializeApp(config.firebaseConfig), 
  ],
  declarations: [ResetPasswordPage]
})
export class ResetPasswordPageModule {}

import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../../services/auth.service';
import { ModalControllers } from '../../../classes/modalControllers';
import { ModalController } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescriptions';
import { InteractionService } from '../../../services/interaction.service';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss'],
})
export class PrescriptionsComponent implements OnInit {

  currentUser: User;
  modalControllers: ModalControllers;
  prescriptions: Prescription[];
  sliderConfig = {
    slidesPerView: 2.2,
    spaceBetween: 0,
    autoplay: true
  };
  constructor(private authService: AuthService,
              private modalController: ModalController,
              private interactionService: InteractionService,
              private prescriptionService: PrescriptionService) {
                this.modalControllers = new ModalControllers(modalController);
              }

  ngOnInit() {
    this.getCurrentUser();
    this.buildPrescription();
  }

  getCurrentUser() {
      this.currentUser = this.authService.user;

  }



  getPrescription(){
  }



  buildPrescription(){
      this.prescriptionService.getAllPrescriptions().
      then(async (data: any) => {
        console.log(data);
        if (data.length === 0 ){
          this.prescriptions = [];
          this.interactionService.createToast('No data found', 'primary', 'bottom');
        }
        else {
          this.prescriptions = data.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        }
      })
      .catch(err => {
        this.prescriptions = [];
        this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
      });
  }

  callPrescriptionPage(prescription: Prescription){
    this.modalControllers.callPrescriptionPage(this.currentUser, prescription);
  }

}

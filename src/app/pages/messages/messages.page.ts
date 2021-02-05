import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ModalControllersMessages } from '../../classes/modalController.messages';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  modalControllerMessages: ModalControllersMessages;
  user: User;
  constructor(private modalCntrl: ModalController,
    private authService: AuthService ) {
    this.modalControllerMessages = new ModalControllersMessages(modalCntrl);
   }

  ngOnInit() {
    
  }


  callSendMessageController() {
    this.modalControllerMessages.callAddMessage(this.user);
  }

  getUser() {
    this.user = this.authService.user;
  }

  ionViewDidEnter(){
    this.getUser();
  }

}

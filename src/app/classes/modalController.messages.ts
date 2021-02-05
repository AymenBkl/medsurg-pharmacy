import {  ModalController } from '@ionic/angular';
import { SendMessageComponent } from '../components/messages/send-message/send-message.component';
import { User } from '../interfaces/user';

export class ModalControllersMessages {

    constructor(private modalController: ModalController){

    }

    public async callAddMessage(userr: User){
        const modal = await this.modalController.create({
            component : SendMessageComponent,
            componentProps : {
                user: userr
            }
            
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }
}

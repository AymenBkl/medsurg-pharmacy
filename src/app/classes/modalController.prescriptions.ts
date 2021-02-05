import {  ModalController } from '@ionic/angular';
import { AddProductToCommentComponent } from '../components/posts/add-product-to-comment/add-product-to-comment.component';
import { User } from '../interfaces/user';

export class ModalControllersPrescription {

    constructor(private modalController: ModalController){

    }

    public async callAddProductToComment(userr: User){
        const modal = await this.modalController.create({
            component : AddProductToCommentComponent,
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

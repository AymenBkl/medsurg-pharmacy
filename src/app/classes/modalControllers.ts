import { NavController, ModalController } from '@ionic/angular';
import { EditCategoryComponent } from '../components/modals/edit-category/edit-category.component';
import { EditProductComponent } from '../components/modals/edit-product/edit-product.component';
import { AddProductToCommentComponent } from '../components/posts/add-product-to-comment/add-product-to-comment.component';
import { PrescriptionComponent } from '../components/posts/prescription/prescription.component';
import { Category } from '../interfaces/category';
import { Comment } from '../interfaces/comment';
import { Prescription } from '../interfaces/prescriptions';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';


export class ModalControllers {

    constructor(private modalController: ModalController){

    }

    public async callEditCategory(selectedCategory: Category){
        const modal = await this.modalController.create({
            component : EditCategoryComponent,
            componentProps : {
                category : selectedCategory
            }
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }

    public async callEditProduct(selectedProduct: Product){
        const modal = await this.modalController.create({
            component : EditProductComponent,
            componentProps : {
                product : selectedProduct
            }
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }

    public async callPrescriptionPage(userr: User, prescriptionn: Prescription){
        const modal = await this.modalController.create({
            component : PrescriptionComponent,
            componentProps : {
                prescription : prescriptionn,
                user: userr
            }
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }

    public async callAddProductToComment(userr: User,commentToAdd: Comment){
        const modal = await this.modalController.create({
            component : AddProductToCommentComponent,
            componentProps : {
                user: userr,
                comment: commentToAdd
            }
            
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }
}

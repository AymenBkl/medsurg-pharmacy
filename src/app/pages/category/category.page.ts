import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { InteractionService } from '../../services/interaction.service';
import { CategoryService } from '../../services/crm/category.service';
import { Category } from 'src/app/interfaces/category';
import { NavController, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { ModalControllers } from '../../classes/modalControllers';
import { Router } from '@angular/router';
@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  user: User;
  categories: Category[];
  modalController: ModalControllers;
  constructor(private authService: AuthService,
              private intercationService: InteractionService,
              private categoryService: CategoryService,
              private navCntrl: NavController,
              private modalCntrl: ModalController,
              private router: Router,
              ) {
                this.modalController = new ModalControllers(modalCntrl);
              }

  ngOnInit() {
}
getCategories() {
  this.intercationService.createLoading('Loading Please Wait !')
    .then(() => {
      this.categoryService.getAllCategories()
      .then((result: any) => {
        this.intercationService.hide();
        if (result && result !== false){
          this.categories = result;
        }
        else {
          this.intercationService.createToast('Error', 'danger', 'bottom');
        }
      })
      .catch(err => {
        this.intercationService.hide();
        this.intercationService.createToast('Error', 'danger', 'bottom');
      });
    });
}

openAddCategory() {
  this.router.navigate(['/addcategory']);
}

openEditCategory(selectedCategory: Category){
  this.modalController.callEditCategory(selectedCategory);
}

ionViewDidEnter(){
  this.checkCategories();
  this.user = this.authService.user;
}

checkCategories(){
  this.getCategories();
}

ionViewDidLeave(){ 
}


}

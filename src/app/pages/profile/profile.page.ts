import { Component, Inject, OnInit } from '@angular/core';
import { InteractionService } from '../../services/interaction.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { onValueChanged } from '../register/valueChanges';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { CameraUploadService } from 'src/app/services/plugin/camera-upload.service';
import { ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  currentUser: User;
  toggle = false;
  profileForm: FormGroup;
  formErrors: any;
  submitted = false;
  image: any;
  constructor(private authService: AuthService,
              private interactionService: InteractionService,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,
              private cameraService: CameraUploadService,
              private actionSheetController: ActionSheetController,
              @Inject('bucketURL') public bucketURL,
              ) {
  }

  ngOnInit() {
  }


  getCurrentUser() {
    this.currentUser = this.authService.user;
    this.buildReactiveForm();
  }

  buildReactiveForm() {
    this.profileForm = this.formBuilder.group({
      firstname : [this.currentUser.firstname, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      lastname : [this.currentUser.lastname, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    });

    this.profileForm.valueChanges
      .subscribe(user => {
        this.formErrors = onValueChanged(user, this.profileForm);
        console.log(this.formErrors);
      });
  }

  update() {
    this.submitted = true;
    this.interactionService.createLoading('Updating your information')
      .then(() => {
        this.userService.updateUser(this.profileForm.value)
          .then((result: any) => {
            this.interactionService.hide();
            this.submitted = false;
            if (result && result !== false){
              this.currentUser = result;
              this.interactionService.createToast('Your Information Has Been Updated', 'success', 'bottom');
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.submitted = false;
            this.interactionService.hide();
            this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
          });
      });
  }

  selectedImage(event) {
    if (this.isFileImage(event.target.files[0])){
    this.interactionService.createLoading('Updating Your image !!')
      .then(() => {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        this.userService.postImage(formData)
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result !== false){
              this.interactionService.createToast('Your image updated', 'success', 'bottom');
              this.currentUser.imageUrl = result;
            }
            else {
              this.interactionService.hide();
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
      }   );
      }).catch(err => {
        this.interactionService.hide();
        this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
      });
    }
      else {
        this.interactionService.createToast('You must select an image !', 'danger', 'bottom');
      }
  }

  isFileImage(file) {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];
  
    return file && acceptedImageTypes.includes(file['type'])
  }

  ionViewDidEnter(){
    this.getCurrentUser()
  }

  logOut(){
    this.authService.logOut()
      .then(() => {
        this.router.navigate(['/login']);
      }).catch(() => {
        this.router.navigate(['/login']);
      });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{

        text: 'Open Camera',
        icon: 'camera-outline',
        handler: () => {
          this.getPhoto( 'camera')
        }
      },
      {

        text: 'Open Gallery',
        icon: 'image-outline',
        handler: () => {
          this.getPhoto('gallery')
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  getPhoto(type: string) {
    this.cameraService.uploadPhotoGallery(type)
      .then((result: any) => {
        console.log(JSON.stringify(result.url));
        console.log("file", result.file);
        if (result && result != null) {
          console.log("check", result.url != '' && result.file != '');
          if (result === 'not image') {
            this.interactionService.createToast('TOAST_IMAGE_ERROR', 'danger', 'bottom');
          }
          else if (result.url != '' && result.file != '') {
            this.selectedImage(result.file);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }


}

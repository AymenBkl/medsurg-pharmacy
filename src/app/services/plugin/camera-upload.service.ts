import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class CameraUploadService {

  constructor(private imagePicker: ImagePicker,
              private camera: Camera,
              private androidPermissions: AndroidPermissions) { }


  uploadPhotoGallery(handler: string) {
    return new Promise((resolve,reject) => {
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,this.androidPermissions.PERMISSION.CAMERA])
            .then((result) => {
              console.log(result.hasPermission);
              if (result.hasPermission) {
                if (handler == 'gallery'){
                  resolve(this.openGallery());
                }
                else if (handler == 'camera'){
                  resolve(this.openCamera());
                }
              }
            })
            .catch(err => {
              reject(err);
            });
    })
    
  }

  openCamera() {
    return new Promise((resolve, reject) => {
      const options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG
    }
    this.camera.getPicture(options)
      .then((image64Data) => {
        resolve(this.selectedImage('data:image/jpeg;base64,' + image64Data))
      })
      .catch(err => {
        reject(err);
      })
    })
  }
  openGallery() {
    return new Promise((resolve, reject) => {
      let options = {
        maximumImagesCount: 1,
        width: 500,
        height: 500,
        quality: 90,
        outputType: 1
      }

      this.imagePicker.getPictures(options).then(
        image64Data => {
          resolve(this.selectedImage('data:image/jpeg;base64,' + image64Data))
        },

        err => reject(err)
      );
    })

  }

  private convertBase64ToBlob(base64Image: string) {
    console.log(base64Image);
    // Split into two parts
    const parts = base64Image.split(';base64,');
    console.log(parts[1])
    // Hold the content type
    const imageType = parts[0].split(':')[1];
    console.log(imageType)
    // Decode Base64 string 
    const decodedData = atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }


  selectedImage(base64Data: string) {
    return this.preview(this.convertBase64ToBlob(base64Data));
  }

  preview(file) {
    return new Promise((resolve, reject) => {
      console.log(file)
      if (!file) {
        return resolve('not file');
      }
      const mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        return resolve('not image');
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        resolve({ url: reader.result, file: file })
      };
    })

  }


}

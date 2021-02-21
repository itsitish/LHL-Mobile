import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

@Component({
  selector: 'app-scenes',
  templateUrl: './scenes.page.html',
  styleUrls: ['./scenes.page.scss'],
})
export class ScenesPage implements OnInit {
  scenes = [];
  constructor(
    public toastController: ToastController,
    private blte: BluetoothLE,
    private ngZone: NgZone,
    private storage: NativeStorage,
    public modalController: ModalController,
    private platform: Platform) {
    // console.log(new Date(new Date().getTime()));
    // this.schedule() 

  }

  async createScene() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss()
      .then(() => {
        this.storage.getItem('storedScenes').then(d => {

          this.ngZone.run(() => {
            this.scenes = d;
          })
        }, err => console.log(err));
      });

    return await modal.present();
  }

  delete(j) {
    this.ngZone.run(() => {
      if (j > -1) {
        this.scenes.splice(j, 1);
        this.storage.setItem('storedScenes', this.scenes);
      }
    })
  }
  clear() {
    this.ngZone.run(() => {
      this.scenes = [];
    })
    this.storage.remove('storedScenes');
  }
  ngOnInit() {
    this.storage.getItem('storedScenes').then(d => {
      this.ngZone.run(() => {
        this.scenes = d;
      })
    }, err => console.log(err))
  }

  playScene(i) {
    this.hitValue(i.pat).then(() => {
      this.hitValue(i.color).then(() => {
        this.hitValue(i.speed).then(() => {
          this.hitValue(i.bright);
        })
      })
    }, err => console.log(err));

  }
  hitValue(value) {
    console.log(value);
    const one = new Promise((resolve, reject) => {
      var sendString = value;
      var bytes = this.blte.stringToBytes(sendString);
      var encodedString = this.blte.bytesToEncodedString(bytes);
      this.storage.getItem('connectedTo').then(d => {
        console.log(d)
        this.blte.write({ "value": encodedString, "service": "4FAFC201-1FB5-459E-8FCC-C5C9C331914B", "characteristic": "BEB5483E-36E1-4688-B7F5-EA07361B26A8", "address": d }
        ).then(writeData => { resolve(writeData) }, err => {
          this.presentToast('Something went wrong');
          console.log(err)
        })
      }, err => reject(err))
    });
    return one;

  } async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      mode: 'ios',
      position: 'top',
      cssClass: 'toast'
    });
    toast.present();
  }
}

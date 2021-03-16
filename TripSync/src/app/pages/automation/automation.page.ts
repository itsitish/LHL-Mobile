import { Component, NgZone, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalController, ToastController } from '@ionic/angular';
import { AddTimePage } from '../../modals/add-time/add-time.page';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.page.html',
  styleUrls: ['./automation.page.scss'],
})
export class AutomationPage implements OnInit {
  scenes = [];
  constructor(private modalController: ModalController, private toastController: ToastController, private storage: NativeStorage, private ngZone: NgZone) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.storage.getItem('storedScenes').then(d => {
      this.ngZone.run(() => {
        this.scenes = d;
      })
    }, err => console.log(err))
  }
  async setTime(x) {
    const modal = await this.modalController.create({
      component: AddTimePage,
      cssClass: 'add-time',
      componentProps: { 
        name: x.name
      }
    });
    modal.onDidDismiss().then(data=> {
      if(data.data==='automated') {
        this.presentToast('Your scene is automated')
      }
    })
    return await modal.present();
  }
  public async close() {
    const modal = await this.modalController.getTop();
    modal ? modal.dismiss() : null;
  }
    
  async presentToast(message) {
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

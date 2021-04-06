import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { DBMeter } from '@ionic-native/db-meter/ngx';
import { SceneAddPage } from '../../modals/scene-add/scene-add.page';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-scenes',
  templateUrl: './scenes.page.html',
  styleUrls: ['./scenes.page.scss'],
})
export class ScenesPage implements OnInit {
  scenes = [];
  interval: any;
  crazyVal: number = 10;

  subscription: any;
  constructor(public alertController: AlertController,
    private nav: NavController,
    public toastController: ToastController,
    private blte: BluetoothLE,
    private ngZone: NgZone,
    private storage: NativeStorage,
    public modalController: ModalController, private dbMeter: DBMeter) {
  }
  async presentAlertConfirm(j) {
    const alert = await this.alertController.create({
      cssClass: 'delete-class',
      header: 'Delete',
      message: 'Are you <strong>sure</strong>?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.ngZone.run(() => {
              if (j > -1) {
                this.scenes.splice(j, 1);
                this.storage.setItem('storedScenes', this.scenes);
              }
            })
          }
        }
      ]
    });

    await alert.present();
  }
  crazyValueLog() {
    this.ngZone.run(() => {
      this.crazyVal = this.crazyVal
    })
  }
  onAudioInput() {
    let a = [];
    this.subscription = this.dbMeter.start().subscribe(
      data => {
        a.push(data);
        // console.log(a);
        console.log(data)
      }
    );
  }
  stop() {

    // Stop listening
    this.subscription.unsubscribe();

  }
  async createScene() {
    const modal = await this.modalController.create({
      component: SceneAddPage,
      cssClass: 'add-scene'
    });
    return await modal.present();
  }

  psycho() {
    this.interval = setInterval(() => {
      this.hitValue(`C/${Math.floor(Math.random() * 256)}/${Math.floor(Math.random() * 256)}/${Math.floor(Math.random() * 256)}/0`)
    }, 1000 / this.crazyVal);

  }
  stopInterval() { clearInterval(this.interval) }

  clear() {
    this.ngZone.run(() => {
      this.scenes = [];
    })
    this.storage.remove('storedScenes');
  }
  public async goBack() {
    const modal = await this.modalController.getTop();
    modal ? modal.dismiss() : null;
    this.nav.navigateBack(['/landing']);
  }
  ngOnInit() {

  }
  ionViewWillEnter() {
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

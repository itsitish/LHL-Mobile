import { Component, NgZone, ViewChild, } from '@angular/core';
import { AlertController, IonSlides } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Pattern } from '../shared/pattern'
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  blueAndLoc: boolean;
  locationEnabled: boolean;
  foundDevices = [];
  favouritePatterns = [];
  patternArray = Pattern.Pattern;
  connectedStatus: any;
  brightValue: any = 255;
  slideOpts = {
    initialSlide: 0,
    speed: 400, pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
    },
  };
  initialState = '#fff'
  hitColor: any = 'C/0/0/0/1';
  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(public toastController: ToastController,
    private alertController: AlertController,
    private blte: BluetoothLE,
    private ngZone: NgZone,
    private storage: NativeStorage) {
    this.storage.getItem('favouritePatterns').then(data => {
      this.favouritePatterns = data;
      console.log(this.favouritePatterns);
    }, err => console.log(err));
    this.storage.getItem('patternsArray').then(data => {
      this.patternArray = data
    }, err => console.log(err));
    setTimeout(this.scanBlte.bind(this), 1000);
  }
  //location permission check
  isLocationEnabled() {
    return new Promise((resolve, reject) => {
      this.blte.hasPermission().then(data => {
        if (data.hasPermission) {
          this.blte.isLocationEnabled().then(data => {
            if (data['isLocationEnabled']) {
              this.locationEnabled = true;
              resolve(this.locationEnabled);
            } else {
              this.presentToast('Location disabled');
              this.blueAndLoc = false;
            }
          }, err => console.log(err));
        } else {
          this.blte.requestPermission().then(data => {
            if (data.requestPermission) {
              this.blte.isLocationEnabled().then(data => {
                if (data['isLocationEnabled']) {
                  this.locationEnabled = true;
                  this.scanBlte();
                }
              }, err => console.log(err));
            }
          });
        }

      });
    })


  }


  patternHit() {
    this.slides.getActiveIndex().then(id => {
      this.hitValue(this.patternArray[id].code);
    })
  }
  changeComplete(ev) {
    let color = ev.color.rgb;
    this.hitColor = `C/${color.r}/${color.g}/${color.b}/${Math.abs(color.a - 1)}`;
    // console.log(this.hitColor)
    this.hitValue(this.hitColor);
  }
  brightnessHit() {
    // console.log(brightVal);
    this.hitValue(`B/${this.brightValue}`);
  }
  pickFavourite() {
    this.slides.getActiveIndex().then(id => {
      if (this.favouritePatterns.some(e => e['id'] === id)) {
        this.patternArray[id].icon = 'heart-outline';
        this.favouritePatterns.splice(this.favouritePatterns.findIndex(e => e['id'] === id), 1)
        // console.log(this.favouritePatterns)
      } else {
        if (this.favouritePatterns.length != 4) {
          if (this.patternArray[id].icon === 'heart') {
            this.patternArray[id].icon = 'heart-outline';
          } else {
            this.patternArray[id].icon = 'heart';
            this.favouritePatterns.push({ 'id': id, 'icon': 'heart' });
          }
        } else {
          this.presentAlert('Capacity full', 'Remove some items')
        }
        // console.log(this.favouritePatterns)
      }
      this.storage.setItem('favouritePatterns', this.favouritePatterns);
      this.storage.setItem('patternsArray', this.patternArray);
    })

  }

  hitFavourite(val) {
    // console.log(val)
    switch (val) {
      case val = 0: {
        this.hitValue(`M/${this.favouritePatterns[0].id}`);
        break;
      }
      case val = 1: {
        this.hitValue(`M/${this.favouritePatterns[1].id}`);
        break;
      }
      case val = 2: {
        this.hitValue(`M/${this.favouritePatterns[2].id}`);
        break;
      }
      case val = 3: {
        this.hitValue(`M/${this.favouritePatterns[3].id}`);
        break;
      }
    }
  }
  //auto scan and connect
  scanBlte() {
    this.blte.initialize().subscribe(data => {
      this.isLocationEnabled().then(() => {
        // console.log(JSON.stringify(data));
        this.blueAndLoc = data.status === "enabled" && this.locationEnabled;
        if (this.blueAndLoc) {
          this.blte.startScan({
            "services": [
              "4FAFC201-1FB5-459E-8FCC-C5C9C331914B"
            ],
          }).subscribe(data => {
            if (data['status'] === "scanResult") {
              if (!this.foundDevices.some(device => {
                return device.address === data.address;
              })) {
                // console.log('FOUND DEVICE:');
                // console.log(JSON.stringify(data));
                this.foundDevices.push(data);
              }
              this.blte.connect({ "address": this.foundDevices[0].address }).subscribe(data => this.onConnected(data), err => this.onError());
            }

          })
          setTimeout(() => {
            this.blte.stopScan().then(data => { }, err => { });
            if (this.foundDevices.length === 0) {
              this.presentToast('No devices found');
              this.blueAndLoc = false;
            } else if (this.connectedStatus != 'connected') {
              this.presentToast('Try again');
              this.blueAndLoc = false;
            }
          }, 1000)
        } else {
          this.presentToast('Bluetooth disabled');
        }
      });
    })
  }
  async presentAlert(message, subMessage) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: message,
      subHeader: subMessage,
      message: '',
      buttons: ['OK']
    });

    await alert.present();
  }
  //reconnect on error 'already connected'
  onError() {
    this.blte.reconnect({ "address": this.foundDevices[0].address }).subscribe(data => this.onConnected(data), err => console.log(err));;
  }
  //connection status check and services discovery
  onConnected(peripheralData) {
    this.ngZone.run(() => {
      this.connectedStatus = peripheralData.status;
      if (this.connectedStatus === 'disconnected') {
        this.presentToast('Try reconnecting');
        this.blueAndLoc = false;
      } else {
        this.blueAndLoc = true;
      }
      // console.log(this.connectedStatus)
    })
    this.blte.discover({ "address": this.foundDevices[0].address }).then(data => {
      // console.log(`this is success ${JSON.stringify(data)}`)
    }, err => {
      this.blueAndLoc = false;
      this.presentToast('Something went wrong');
      console.log(`this is error ${JSON.stringify(err)}`)
    });
  }
  hitValue(value) {
    // console.log(value);
    var string = value;
    var bytes = this.blte.stringToBytes(string);
    var encodedString = this.blte.bytesToEncodedString(bytes);
    this.blte.write({ "value": encodedString, "service": "4FAFC201-1FB5-459E-8FCC-C5C9C331914B", "characteristic": "BEB5483E-36E1-4688-B7F5-EA07361B26A8", "type": "noResponse", "address": this.foundDevices[0].address }
    ).then(data => { }, err => {
      this.blueAndLoc = false;
      this.presentToast('Something went wrong');
      console.log(err)
    })
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

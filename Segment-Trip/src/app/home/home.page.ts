import { Component, NgZone, ViewChild, } from '@angular/core';
import { AlertController, IonSlides, Platform } from '@ionic/angular';
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
  lhlSegment = 'S1'
  customPopoverOptions: any = {
    header: 'Devices available',
    subHeader: 'Select the device you want to connect with',
  };
  brightValue: any = 255;
  slideOpts = {
    initialSlide: 0,
    speed: 400, pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
    },
  };
  segment = 'color';
  initialState = '#fff'
  hitColor: any = 'C/0/0/0/1';
  @ViewChild(IonSlides) slides: IonSlides;
  speedValue: any = 56000;
  selectedLhl: any;
  currentConnected;
  constructor(public toastController: ToastController,
    private alertController: AlertController,
    private blte: BluetoothLE,
    private ngZone: NgZone,
    private storage: NativeStorage,
    private platform: Platform) {
    setTimeout(this.scanBlte.bind(this), 1000);
  }
  retrieveFavs() {
    this.storage.getItem('favouritePatterns').then(favData => {
      this.favouritePatterns = favData;
      console.log(this.favouritePatterns);
    }, err => console.log(err));
    this.storage.getItem('patternsArray').then(favArr => {
      this.patternArray = favArr
      console.log(this.patternArray);
    }, err => console.log(err));
  }
  selectOne() {
    console.log(this.selectedLhl);
    this.blte.disconnect({ "address": this.currentConnected.address }).then(selectOther => {
      console.log(selectOther);
      setTimeout(() => {
        this.blte.connect({ "address": this.selectedLhl }).subscribe(connectData => {
          console.log(connectData);
          this.blte.discover({
            "address": connectData.address, "clearCache": true
          }).then(connectedData => {
            this.currentConnected = connectedData;
            console.log(`this is success --> ${JSON.stringify(connectedData)}`)
          }, err => {
            this.blueAndLoc = false;
            this.presentToast('Something went wrong');
            console.log(`this is error --> ${JSON.stringify(err)}`)
          });
        }, err => {
          this.onError(this.selectedLhl);
        });
      }, 1000);
    });
  }
  scanCommmon(status) {
    this.blte.startScan({
      "services": [
        "4FAFC201-1FB5-459E-8FCC-C5C9C331914B"
      ],
    }).subscribe(deviceData => {
      if (deviceData['status'] === "scanResult") {
        if (!this.foundDevices.some(device => {
          return device.address === deviceData.address;
        })) {
          console.log('FOUND DEVICE:');
          console.log(JSON.stringify(status));
          this.foundDevices.push(deviceData);
          console.log(this.foundDevices);
        }
        this.blte.connect({ "address": this.foundDevices[0].address }).subscribe(connectData => this.onConnected(connectData, this.foundDevices[0].address), err => this.onError(err.address));
      }
    })
    setTimeout(() => {
      this.blte.stopScan().then(stopData => { console.log(stopData) }, err => { console.log(err) });
      if (this.foundDevices.length === 0) {
        this.presentToast('No devices found');
        this.blueAndLoc = false;
      } else if (this.connectedStatus != 'connected') {
        this.presentToast('Try again');
        this.blueAndLoc = false;
      }
    }, 1000)
  }
  //auto scan and connect
  scanBlte() {
    this.blte.initialize().subscribe(bluetoothStatus => {
      if (this.platform.is('android')) {
        this.isLocationEnabled().then(() => {
          console.log(JSON.stringify(bluetoothStatus));
          this.blueAndLoc = bluetoothStatus.status === "enabled" && this.locationEnabled;
          if (this.blueAndLoc) {
            this.scanCommmon(bluetoothStatus);
          } else {
            this.presentToast('Bluetooth disabled');
          }
        });
      } else {
        if (bluetoothStatus.status === 'enabled') {
          this.scanCommmon(bluetoothStatus);
        } else {
          this.presentToast('Bluetooth disabled');
        }
      }

    })
  }
  //location permission check
  isLocationEnabled() {
    return new Promise((resolve, reject) => {
      this.blte.hasPermission().then(permData => {
        if (permData.hasPermission) {
          this.blte.isLocationEnabled().then(locData => {
            if (locData['isLocationEnabled']) {
              this.locationEnabled = true;
              resolve(this.locationEnabled);
            } else {
              this.presentToast('Location disabled');
              this.blueAndLoc = false;
            }
          }, err => console.log(err));
        } else {
          this.blte.requestPermission().then(reqPerm => {
            if (reqPerm.requestPermission) {
              this.blte.isLocationEnabled().then(enbData => {
                if (enbData['isLocationEnabled']) {
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
    console.log(this.brightValue);
    this.hitValue(`B/${this.brightValue}`);
  }
  valueLog() {
    // console.log(Math.abs(56000 - this.speedValue + 2));
    this.hitValue(`S/${Math.abs(56000 - this.speedValue + 2)}`);
  }
  pickFavourite() {
    this.slides.getActiveIndex().then(id => {
      if (this.favouritePatterns.some(e => e['id'] === id)) {
        this.patternArray[id].icon = 'heart-outline';
        this.favouritePatterns.splice(this.favouritePatterns.findIndex(e => e['id'] === id), 1)
        console.log(this.favouritePatterns)
      } else {
        if (this.favouritePatterns.length != 4) {
          if (this.patternArray[id].icon === 'heart') {
            this.patternArray[id].icon = 'heart-outline';
          } else {
            this.patternArray[id].icon = 'heart';
            this.favouritePatterns.push({ 'id': id, 'icon': 'heart', 'name': Pattern.Pattern[id]['title'] });
          }
        } else {
          this.presentAlert('Capacity full', 'Remove some items')
        }
        console.log(this.favouritePatterns)
      }
      this.storage.setItem('favouritePatterns', this.favouritePatterns);
      this.storage.setItem('patternsArray', this.patternArray);
    })

  }

  hitFavourite(val) {
    // console.log(val)
    switch (val) {
      case 0: {
        this.slides.slideTo(this.favouritePatterns[0].id);
        this.hitValue(`M/${this.favouritePatterns[0].id}`);
        break;
      }
      case 1: {
        this.slides.slideTo(this.favouritePatterns[1].id);
        this.hitValue(`M/${this.favouritePatterns[1].id}`);
        break;
      }
      case 2: {
        this.slides.slideTo(this.favouritePatterns[2].id);
        this.hitValue(`M/${this.favouritePatterns[2].id}`);
        break;
      }
      case 3: {
        this.slides.slideTo(this.favouritePatterns[3].id);
        this.hitValue(`M/${this.favouritePatterns[3].id}`);
        break;
      }
    }
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
  onError(add) {
    this.blte.reconnect({ "address": add }).subscribe(reconnectData => this.onConnected(reconnectData, add), err => console.log(err));;
  }
  //connection status check and services discovery
  onConnected(peripheralData, address) {
    this.ngZone.run(() => {
      this.connectedStatus = peripheralData.status;
      if (this.connectedStatus === 'disconnected') {
        this.presentToast('Try reconnecting');
        this.blueAndLoc = false;
      } else {
        this.blueAndLoc = true;
      }
      console.log(this.connectedStatus)
    })
    this.blte.discover({
      "address": address, "clearCache": true
    }).then(connectedData => {
      this.currentConnected = connectedData;
      console.log(`this is success --> ${JSON.stringify(connectedData)}`)
      console.log(this.currentConnected.name);
      this.selectedLhl = this.currentConnected.address;
    }, err => {
      this.blueAndLoc = false;
      this.presentToast('Something went wrong');
      console.log(`this is error --> ${JSON.stringify(err)}`)
    });
  }
  hitValue(value) {
    console.log(value + '/' + this.lhlSegment);
    var bytes = this.blte.stringToBytes(value + '/' + this.lhlSegment);
    var encodedString = this.blte.bytesToEncodedString(bytes);
    this.blte.write({ "value": encodedString, "service": "4FAFC201-1FB5-459E-8FCC-C5C9C331914B", "characteristic": "BEB5483E-36E1-4688-B7F5-EA07361B26A8", "address": this.currentConnected.address }
    ).then(writeData => { console.log(writeData) }, err => {
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

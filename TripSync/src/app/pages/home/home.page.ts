import { Component, NgZone, ViewChild, } from '@angular/core';
import { AlertController, IonSlides, Platform } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Pattern } from '../../shared/pattern'
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  loader: any;

  blueAndLoc: boolean;
  locationEnabled: boolean;
  foundDevices = [];
  favouritePatterns = [];
  patternArray = Pattern.Pattern;
  connectedStatus: any;
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
  speedValue: any = 3000;
  selectedLhl: any;
  currentConnected: any;
  lastSlide: number;
  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    private alertController: AlertController,
    private blte: BluetoothLE,
    private ngZone: NgZone,
    private storage: NativeStorage,
    private platform: Platform,
  ) {
    setTimeout(this.scanBlte.bind(this), 1000);
  }
  ngOnInit() {

  }
  async presentLoading(mes) {
    this.loader = await this.loadingController.create({
      message: mes,
      mode: 'ios'
    });
    await this.loader.present();

  }
  retrieveFavs() {
    this.storage.getItem('patternsArray').then(favArr => {
      this.patternArray = favArr
      this.storage.getItem('favouritePatterns').then(favData => {
        this.favouritePatterns = favData;
        // console.log(this.favouritePatterns);
        this.lastSlide ? this.slides.slideTo(this.lastSlide) : null;
      }, err => {
        this.lastSlide ? this.slides.slideTo(this.lastSlide) : null;
        console.log(err)
      });
      // console.log(this.patternArray);
    }, err => {
      this.lastSlide ? this.slides.slideTo(this.lastSlide) : null;
      console.log(err)
    });
  }

  selectOne() {
    console.log(this.selectedLhl);
    if (this.selectedLhl != this.currentConnected.address) {
      if (this.currentConnected) {
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
                this.ngZone.run(()=>this.blueAndLoc = true)
              }, err => {
                this.blueAndLoc = false;
                this.presentToast('Something went wrong');
                console.log(`this is error --> ${JSON.stringify(err)}`)
              });
            }, err => {
              this.onError(this.selectedLhl, err);
            });
          }, 1000);
        }, err => { console.log("select one " + err) });
      } else {
        this.blte.connect({ "address": this.selectedLhl }).subscribe(connectData => {
          console.log(connectData);
          this.blte.discover({
            "address": connectData.address, "clearCache": true
          }).then(connectedData => {
            this.currentConnected = connectedData;
            this.ngZone.run(()=>this.blueAndLoc = true)
            console.log(`this is success --> ${JSON.stringify(connectedData)}`)
          }, err => {
            this.blueAndLoc = false;
            this.presentToast('Something went wrong');
            console.log(`this is error --> ${JSON.stringify(err)}`)
          });
        }, err => {
          this.onError(this.selectedLhl, err);
        });
      }
    }
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
        this.blte.connect({ "address": this.foundDevices[0].address }).subscribe(connectData => this.onConnected(connectData, this.foundDevices[0].address), err => {
          this.onError(err.address, err);

        });
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
    }, 500)
  }
  //auto scan and connect
  scanBlte() {
    this.presentLoading('Trying to connect..').then(()=> {
      this.foundDevices = [];
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
          }, err => { console.log("location enabled " + err) });
        } else {
          if (bluetoothStatus.status === 'enabled') {
            this.scanCommmon(bluetoothStatus);
          } else {
            this.presentToast('Bluetooth disabled');
          }
        }
  
      })
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
          }, err => { console.log("request location " + err) });
        }

      }, err => { console.log("location has permission " + err) });
    })
  }

  patternHit() {
    this.slides.getActiveIndex().then(id => {
      this.lastSlide = id;
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
    this.hitValue(`S/${Math.abs(3000 - this.speedValue + 2)}`);
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
        this.lastSlide = this.favouritePatterns[0].id;
        this.hitValue(`M/${this.favouritePatterns[0].id}`);
        break;
      }
      case 1: {
        this.slides.slideTo(this.favouritePatterns[1].id);
        this.lastSlide = this.favouritePatterns[1].id;
        this.hitValue(`M/${this.favouritePatterns[1].id}`);
        break;
      }
      case 2: {
        this.slides.slideTo(this.favouritePatterns[2].id);
        this.lastSlide = this.favouritePatterns[2].id;
        this.hitValue(`M/${this.favouritePatterns[2].id}`);
        break;
      }
      case 3: {
        this.slides.slideTo(this.favouritePatterns[3].id);
        this.lastSlide = this.favouritePatterns[3].id;
        this.hitValue(`M/${this.favouritePatterns[3].id}`);
        break;
      }
    }
  }

  async presentAlert(message, subMessage) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: message,
      subHeader: subMessage,
      message: '',
      buttons: ['OK']
    });

    await alert.present();
  }

  onError(add, err) {
    if (err.error = "isNotDisconnected") {
        this.blte.reconnect({ "address": add }).subscribe(reconnectData => this.onConnected(reconnectData, add), err => console.log(err));;
    } else {
      this.blte.disconnect({ "address": add }).then(() => {
        setTimeout(() => {
          this.blte.connect({ "address": add }).subscribe(connectData => {
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
            console.log(err)
          });
        }, 500);
      }, err => { console.log("disconnect block " + JSON.stringify(err)) });
    }

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
      this.loader.dismiss();
      console.log(`this is success --> ${JSON.stringify(connectedData)}`)
      console.log(this.currentConnected.name);
      this.ngZone.run(()=>this.selectedLhl = this.currentConnected.address);
      this.storage.setItem('connectedTo', this.selectedLhl);
    }, err => {
      this.blueAndLoc = false;
      this.presentToast('Something went wrong');
      console.log(`this is error --> ${JSON.stringify(err)}`)
    });
  }
  hitValue(value) {
    console.log(value);
    var sendString = value;
    var bytes = this.blte.stringToBytes(sendString);
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

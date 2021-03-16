import { Component, NgZone, OnInit } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController, MenuController } from '@ionic/angular';
import { NavController, Platform } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  newDevices = [

  ];
  previousConnected = [

  ];
  devices = [];
  connectedStatus: any;
  currentConnected: any;
  blueAndLoc: boolean;
  locationEnabled: boolean;
  loader: any;
  constructor(private ngZone: NgZone,
    public toastController: ToastController,
    private platform: Platform,
    public loadingController: LoadingController,
    private blte: BluetoothLE, private navCtrl: NavController,
    private menu: MenuController, private storage: NativeStorage) {
    this.storage.getItem('previousConnected').then(previousConnected => {
      this.previousConnected = previousConnected;

    }, err => {

    })
    setTimeout(this.scanBlte.bind(this), 500);
  }

  ngOnInit() {

  }
  ionViewWillEnter() {
    this.menu ? this.menu.close() : null;

  }
  //auto scan and connect
  scanBlte() {
    this.presentLoading('Scanning..').then(() => {
      this.blte.initialize().subscribe(bluetoothStatus => {
        if (this.platform.is('android')) {
          this.isLocationEnabled().then(() => {
            console.log(JSON.stringify(bluetoothStatus));
            this.blueAndLoc = bluetoothStatus.status === "enabled" && this.locationEnabled;
            if (this.blueAndLoc) {
              this.scanCommmon(bluetoothStatus);
            } else {
              this.loader ? this.loader.dismiss() : null;
              this.presentToast('Bluetooth disabled');
            }
          }, err => {
            this.loader ? this.loader.dismiss() : null;
            console.log("location enabled " + err)
          });
        } else {
          if (bluetoothStatus.status === 'enabled') {
            this.scanCommmon(bluetoothStatus);
          } else {
            this.presentToast('Bluetooth disabled');
            this.loader ? this.loader.dismiss() : null;

          }
        }

      }, err => {
        this.loader ? this.loader.dismiss() : null;
      })
    })
  }
  scanCommmon(status) {
    this.blte.startScan({
      "services": [
        "4FAFC201-1FB5-459E-8FCC-C5C9C331914B"
      ],
    }).subscribe(deviceData => {
      if (deviceData['status'] === "scanResult") {
        if (!this.devices.some(device => {
          return device.address === deviceData.address;
        })) {
          console.log('FOUND DEVICE:');
          console.log(JSON.stringify(status));
          this.devices.push(deviceData);
          console.log(this.devices);
        }

      }
    })
    setTimeout(() => {
      this.blte.stopScan().then(stopData => { console.log(stopData) }, err => { console.log(err) });
      if (this.devices.length === 0) {
        this.presentToast('No devices found');
        this.blueAndLoc = false;
      }
      this.loader ? this.loader.dismiss() : null;
    }, 500)
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
              this.loader ? this.loader.dismiss() : null;
              this.presentToast('Location disabled');
              this.blueAndLoc = false;
            }
          }, err => {
            this.loader ? this.loader.dismiss() : null;
            console.log(err)
          });
        } else {
          this.loader ? this.loader.dismiss() : null;
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

      }, err => {
        this.loader ? this.loader.dismiss() : null;
        console.log("location has permission " + err)
      });
    })
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
      this.loader ? this.loader.dismiss() : null;
      console.log(`this is success --> ${JSON.stringify(connectedData)}`)
      this.storage.setItem('connectedTo', this.currentConnected.address);
      this.loader.dismiss()
      this.navCtrl.navigateForward('home');
    }, err => {
      this.loader.dismiss()
      this.blueAndLoc = false;
      this.presentToast('Something went wrong');
      console.log(`this is error --> ${JSON.stringify(err)}`)
    });
  }

  addDevice(x) {
    console.log(x.address);
    this.presentLoading('Connecting').then(() => {
      this.storage.getItem('connectedTo').then(d => {
        if (d === x.address) {
          this.loader ? this.loader.dismiss() : null;
          this.navCtrl.navigateForward('home');
        } else {
          this.blte.disconnect({ "address": d }).then(selectOther => {
            console.log(selectOther);
            setTimeout(() => {
              this.blte.connect({ "address": x.address }).subscribe(connectData => {
                console.log(connectData);
                this.blte.discover({
                  "address": connectData.address, "clearCache": true
                }).then(connectedData => {
                  this.currentConnected = connectedData;
                  console.log(`this is success --> ${JSON.stringify(connectedData)}`);

                  this.storage.setItem('connectedTo', this.currentConnected.address);
                  this.ngZone.run(() => this.blueAndLoc = true)
                  this.loader ? this.loader.dismiss() : null;
                  this.navCtrl.navigateForward('home');
                }, err => {
                  this.loader ? this.loader.dismiss() : null;
                  this.blueAndLoc = false;
                  this.presentToast('Something went wrong');
                  console.log(`this is error --> ${JSON.stringify(err)}`)
                });
              }, err => {
                this.loader ? this.loader.dismiss() : null;
                this.onError(x.address, err);
              });
            }, 100);
          }, err => {
            this.loader ? this.loader.dismiss() : null;
            console.log("select one " + err)
          });
        }
      }, err => {
        this.blte.connect({ "address": x.address }).subscribe(connectData => this.onConnected(connectData, x.address), err => {
          this.onError(err.address, err);

        });
      })


    })
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
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
  async presentLoading(mes) {
    this.loader = await this.loadingController.create({
      message: mes,
      mode: 'ios'
    });
    await this.loader.present();

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
  nameChange(i) {
    console.log(i.name)
  }
  goToHome() {
    this.menu.close();
  }
  goToAutomation() {
    this.navCtrl.navigateForward('/automation')
  }
  goToScenes() {
    this.navCtrl.navigateForward('/scenes');
  }
  goToProfile() {
    this.navCtrl.navigateForward('/profile');
  }
}

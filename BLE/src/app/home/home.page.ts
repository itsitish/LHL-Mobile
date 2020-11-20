import { Component, ElementRef, NgZone, ViewChild, } from '@angular/core';
import { AlertController, IonSlides } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Pattern } from './pattern'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  bluetoothEnabled: boolean;
  locationEnabled: boolean;
  foundDevices = [];
  sentValue: any;
  favouritePatterns = [];
  favouriteColors = [];
  connectedStatus: any;
  value: any = 255;
  slideOpts = {
    initialSlide: 0,
    speed: 400, pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
    },
  };
  favColor: any;
  color: any;
  patternArray = Pattern.Pattern;
  favPattern: any = 0;
  toggle: boolean = true;
  @ViewChild('slides', { static: true }) slides: IonSlides;
  @ViewChild('inputPick', { static: true }) inputPick: ElementRef;


  constructor(public alertController: AlertController, public blte: BluetoothLE,
    public ngZone: NgZone) {
    this.scanBlte();
  }
  patternHit() {
    this.slides.getActiveIndex().then(id => {
      this.hitValue(this.patternArray[id].code);
    })
  }
  pickColor() {
    this.favColor = this.color;
    console.log(this.favColor)
    this.colorModify(this.color);
  }
  colorModify(color) {
    color = color.replace('rgba(', 'C/');
    color = color.replace(/,/g, '/');
    color = color.replace(')', '');
    // console.log(color);
    this.hitValue(color);
  }
  brightnessHit() {
    let brightVal = `B/${this.value}`;
    // console.log(brightVal);
    this.hitValue(brightVal);
  }
  isLocationEnabled() {
    this.blte.isLocationEnabled().then(data => {
      if (data['isLocationEnabled']) {
        this.locationEnabled = true;
      }
    }, err => console.log(err));
  }

  pickFavourite(val) {
    if (val === 'pattern') {
      this.slides.getActiveIndex().then(id => {
        this.favouritePatterns.push({ 'id': id });
        this.favouritePatterns.length > 4 ? this.favouritePatterns.pop() : null;
        console.log(this.favouritePatterns)
      })
    } else {
      this.favColor === undefined ? null : this.favouriteColors.push({ 'color': this.favColor });
      this.favouriteColors.length > 4 ? this.favouriteColors.pop() : null;
      console.log(this.favouriteColors)
    }
  }
  hitValue(value) {
    console.log(value);
    var string = value;
    var bytes = this.blte.stringToBytes(string);
    var encodedString = this.blte.bytesToEncodedString(bytes);
    this.blte.write({ "value": encodedString, "service": "4FAFC201-1FB5-459E-8FCC-C5C9C331914B", "characteristic": "BEB5483E-36E1-4688-B7F5-EA07361B26A8", "type": "noResponse", "address": this.foundDevices[0].address }
    ).then(data => { }, err => console.log(err))
  }
  hitFavourite(val, type) {
    console.log(type)
    if (type === 'pattern') {
      switch (val) {
        case val = 0: {
          this.hitValue(this.favouritePatterns[0].id);
          break;
        }
        case val = 1: {
          this.hitValue(this.favouritePatterns[1].id);
          break;
        }
        case val = 2: {
          this.hitValue(this.favouritePatterns[2].id);
          break;
        }
        case val = 3: {
          this.hitValue(this.favouritePatterns[3].id);
          break;
        }
      }
    } else {
      switch (val) {
        case val = 0: {
          this.colorModify(this.favouriteColors[val].color);
          break;
        }
        case val = 1: {
          this.colorModify(this.favouriteColors[val].color);
          break;
        }
        case val = 2: {
          this.colorModify(this.favouriteColors[val].color);
          break;
        }
        case val = 3: {
          this.colorModify(this.favouriteColors[val].color);
          break;
        }
        
      }
    }

  }
  scanBlte() {
    this.blte.initialize().subscribe(data => {
      this.isLocationEnabled();
      console.log(JSON.stringify(data));
      this.bluetoothEnabled = data.status === "enabled" && this.locationEnabled;
      this.blte.startScan({
        "services": [
          "4FAFC201-1FB5-459E-8FCC-C5C9C331914B"
        ],
      }).subscribe(data => {
        if (data['status'] === "scanResult") {

          if (!this.foundDevices.some(device => {
            return device.address === data.address;
          })) {
            console.log('FOUND DEVICE:');
            console.log(JSON.stringify(data));
            this.foundDevices.push(data);
          }
          this.blte.connect({ "address": this.foundDevices[0].address }).subscribe(data => this.onConnected(data), err => this.onError(err));
        }
      })

      setTimeout(() => {
        this.blte.stopScan().then(data => { }, err => { });
      }, 500)
    })

  }
  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: message,
      subHeader: '',
      message: '',
      buttons: ['OK']
    });

    await alert.present();
  }

  onError(data) {
    if (data.message === "Device previously connected, reconnect or close for new device") {
      this.blte.reconnect({ "address": this.foundDevices[0].address }).subscribe(data => this.onConnected(data), err => console.log(err));;
    } else {
      console.log(data);
    }
  }

  onConnected(peripheralData) {
    this.ngZone.run(() => {
      this.connectedStatus = peripheralData.status;
      if (this.connectedStatus === 'disconnected') {
        this.bluetoothEnabled = false;
      } else {
        this.bluetoothEnabled = true;
      }
      // console.log(this.connectedStatus)
    })
    this.blte.discover({ "address": this.foundDevices[0].address }).then(data => console.log(`this is success ${JSON.stringify(data)}`), err => console.log(`this is error ${JSON.stringify(err)}`));
  }
}

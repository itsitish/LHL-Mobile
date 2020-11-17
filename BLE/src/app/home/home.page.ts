import { Component, NgZone, ViewChild } from '@angular/core';
import { AlertController, IonSlides } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  foundDevices = [];
  sentValue: any;
  status: any;
  value: any = 255;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  patternArray = [{
    "title": "Preset 1",
    "code": "M/0"
  }, {
    "title": "Preset 2",
    "code": "M/1"
  }, {
    "title": "Preset 3",
    "code": "M/2"
  }, {
    "title": "Preset 4",
    "code": "M/3"
  }, {
    "title": "Preset 5",
    "code": "4"
  }, {
    "title": "Preset 6",
    "code": "M/5"
  }, {
    "title": "Preset 7",
    "code": "M/6"
  }, {
    "title": "Preset 8",
    "code": "M/7"
  }, {
    "title": "Preset 9",
    "code": "M/8"
  }, {
    "title": "Preset 10",
    "code": "M/9"
  }];
  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(public alertController: AlertController, public blte: BluetoothLE,
    public ngZone: NgZone) {

    this.blte.initialize().subscribe(data => this.scanBlte(data));
  }
  patternHit() {
    this.slides.getActiveIndex().then(id=> {
      
      this.hitValue(this.patternArray[id].code);
    })
  }
  
  brightnessHit() {
    let brightVal = `B/${this.value}`;
    // console.log(brightVal);
    this.hitValue(brightVal);
  }

  hitValue(value) {
    var string = value;
    var bytes = this.blte.stringToBytes(string);
    var encodedString = this.blte.bytesToEncodedString(bytes);
    this.blte.write({ "value": encodedString, "service": "4FAFC201-1FB5-459E-8FCC-C5C9C331914B", "characteristic": "BEB5483E-36E1-4688-B7F5-EA07361B26A8", "type": "noResponse", "address": this.foundDevices[0].address }
    ).then(data => console.log(data), err => console.log(err))
  }
  scanBlte(data) {
    console.log(JSON.stringify(data));
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
        this.connect(this.foundDevices[0].address);
      }
    })

    setTimeout(() => {
      this.blte.stopScan().then(data => { }, err => { });
    }, 500)
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

  connect(address) {
    this.blte.connect({ "address": address }).subscribe(data => this.onConnected(data), err => this.onError(err));

  }
  onError(data) {
    if (data.message === "Device previously connected, reconnect or close for new device") {
      this.blte.reconnect({ "address": this.foundDevices[0].address }).subscribe(data => this.onConnected(data), err => console.log(err));;
    } else {
      console.log(data);
    }
  }

  hit(value) {
    console.log(this.sentValue)
    var string = this.sentValue;
    var bytes = this.blte.stringToBytes(string);
    var encodedString = this.blte.bytesToEncodedString(bytes);
    console.log(encodedString)
    this.blte.write({ "value": encodedString, "service": "4FAFC201-1FB5-459E-8FCC-C5C9C331914B", "characteristic": "BEB5483E-36E1-4688-B7F5-EA07361B26A8", "type": "noResponse", "address": this.foundDevices[0].address }
    ).then(data => console.log(data), err => console.log(err))
  }
  onConnected(peripheralData) {
    this.ngZone.run(() => {
      this.status = peripheralData.status;
    })
    this.blte.discover({ "address": this.foundDevices[0].address }).then(data => console.log(`this is success ${JSON.stringify(data)}`), err => console.log(`this is error ${JSON.stringify(err)}`));
  }
}

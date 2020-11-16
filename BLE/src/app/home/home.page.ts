import { Component, NgZone } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BLE } from '@ionic-native/ble/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  foundDevices = [];
  othershit: string;
  lhl = [];
  spinner: any;
  spinnerHit: any;
  peripheralData: any;
  sentValue: any;
  constructor(private ble: BLE, public alertController: AlertController, public blte:BluetoothLE,
    public ngZone: NgZone) {

    this.blte.initialize().subscribe(data=>console.log(data))

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
  scanBle() {
    this.spinner = true;
    this.ble.scan([], 5).subscribe(device => {
      this.ngZone.run(() => {
        this.foundDevices.push(device);
        device.name && device.name.toString().includes('LHL') ? this.lhl.push(device) : null;
      })
    });
    setTimeout(() => {
      this.ngZone.run(() => {
        console.log(`this is the devices after scan ${JSON.stringify(this.foundDevices)}`)
        this.spinner = false;
      })

    }, 5100);
  }

  connect() {
    this.spinnerHit = true;
    this.blte.connect({"address": this.lhl[0].id}).subscribe(data=>this.onConnected(data), err=> console.log(err));
    
  }
  reconnect() {
    this.blte.reconnect({"address": this.lhl[0].id}).subscribe(data=>this.onConnected(data), err=> console.log(err));;
  }
  hit() {
    console.log(this.sentValue)
    var string = this.sentValue;
    var bytes = this.blte.stringToBytes(string);
    var encodedString = this.blte.bytesToEncodedString(bytes);
    console.log(encodedString)
    this.blte.write({"value":encodedString,"service":"4FAFC201-1FB5-459E-8FCC-C5C9C331914B","characteristic":"BEB5483E-36E1-4688-B7F5-EA07361B26A8","type":"noResponse","address":this.lhl[0].id}
    ).then(data=>console.log(data), err=> console.log(err))
  }
  onConnected(peripheralData) {
    console.log(this.peripheralData = peripheralData);
    this.blte.discover({"address": this.lhl[0].id}).then(data=>console.log(`this is success ${JSON.stringify(data)}`), err=>console.log(`this is error ${JSON.stringify(err)}`));

    // Subscribe for notifications when the temperature changes
    // this.ble.startNotification(this.peripheralData.id, "4fafc201-1fb5-459e-8fcc-c5c9c331914b", "e3327c31-3123-4a99-bf27-b900c24c4e68").subscribe(
    //   data => console.log(`this is notification wala ${data}`),
    //   err => console.log(err)
    // )


  }
}

import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Pattern } from '../../shared/pattern';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  customAlertOptions: any = {
    header: 'Patterns',
    subHeader: 'Choose one',
    translucent: true
  };
  name: string = '';
  pickedColor: any = 'C/255/255/255/0';
  patterns = Pattern.Pattern;
  selectedPattern: any = 'M/0';
  speedValue: any = 3000;
  brightValue: any = 255;
  interval: any;
  constructor(private storage: NativeStorage, private blte: BluetoothLE,

    public toastController: ToastController,
    public modalController: ModalController) { }

  ngOnInit() {
    this.speedValue = 3000;
    this.selectedPattern = 'M/0';
    this.brightValue = 255;
    this.pickedColor = 'C/255/255/255/0';
  }
  pickColor(e) {
    // console.log(e);
    this.pickedColor = e;
    this.hitValue(e);
  }
  clear() {
    this.storage.remove('storedScenes');
  }
  valueLog() {
    // console.log(this.speedValue);
    this.hitValue(`S/${Math.abs(3000 - this.speedValue + 2)}`);
  }
  presetSet() {
    let code;
    code = { 'pat': this.selectedPattern, 'color': this.pickedColor, 'bright': 'B/' + this.brightValue, 'speed': 'S/' + this.speedValue, 'name': this.name };
    // console.log(code);
    this.storage.getItem('storedScenes').then(d => {
      console.log(d);
      d.push(code);
      this.storage.setItem('storedScenes', d);
      this.modalController.dismiss();
    }, err => {
      let b = [];
      b.push(code);
      this.storage.setItem('storedScenes', b);
      this.modalController.dismiss();
      console.log(b)
    })
  }
  brightnessHit() {
    // console.log(this.brightValue);
    this.hitValue('B/' + this.brightValue);
  }
  selectOne() {
    // console.log(this.selectedPattern);
    this.hitValue(this.selectedPattern);

  }
  hitValue(value) {
    console.log(value);
    var sendString = value;
    var bytes = this.blte.stringToBytes(sendString);
    var encodedString = this.blte.bytesToEncodedString(bytes);
    this.storage.getItem('connectedTo').then(d => {
      console.log(d)
      this.blte.write({ "value": encodedString, "service": "4FAFC201-1FB5-459E-8FCC-C5C9C331914B", "characteristic": "BEB5483E-36E1-4688-B7F5-EA07361B26A8", "address": d }
      ).then(writeData => { console.log(writeData) }, err => {
        this.presentToast('Something went wrong');
        console.log(err)
      })
    }, err => console.log(err))

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
  psycho() {
    this.interval = setInterval(() => {
      this.hitValue(`C/${Math.floor(Math.random() * 256)}/${Math.floor(Math.random() * 256)}/${Math.floor(Math.random() * 256)}/0`)
    }, 100)
  }
  stop() { clearInterval(this.interval) }

}

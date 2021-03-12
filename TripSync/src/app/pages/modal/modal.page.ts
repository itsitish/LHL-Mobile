import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Pattern } from '../../shared/pattern';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Router } from '@angular/router';

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
  time: any
  selectedMood: any;
  pickedColor: any = 'C/255/255/255/0';
  patterns = Pattern.Pattern;
  selectedPattern: any = 'M/0';
  speedValue: any = 3000;
  brightValue: any = 255;
  name = this.router.getCurrentNavigation().extras.state.sceneName;
  constructor(private router: Router,private localNotifications: LocalNotifications, private storage: NativeStorage, private blte: BluetoothLE,

    public toastController: ToastController,
    public modalController: ModalController) {
    this.localNotifications.hasPermission().then(d => {
      console.log(d)
    }, err => {
      console.log(err)
      this.localNotifications.requestPermission().then(e => console.log(e), er => {
        console.log(er)
      })
    })
  }

  ngOnInit() {
   }
  pickColor(e) {
    // console.log(e);
    this.pickedColor = e;
    this.hitValue(e);
  }
  schedule(h, m, i) {
    this.localNotifications.schedule({
      id: i,
      title:'Hey there!',
      text: 'Its time for your new scene!',
      trigger: { every: { hour: h, minute: m} },
      foreground: true
    });
    console.log('scheduled');
  }

  valueLog() {
    // console.log(this.speedValue);
    this.hitValue(`S/${Math.abs(3000 - this.speedValue + 2)}`);
  }

  timePick() {
    // console.log(this.time)
  }
  presetSet() {
    let code;
    code = { 'pat': this.selectedPattern, 'color': this.pickedColor, 'bright': 'B/' + this.brightValue, 'speed': 'S/' + this.speedValue, 'name': this.name, 'mood': this.selectedMood, 'hour': parseInt(this.time.slice(11, 13)) , 'min': parseInt(this.time.slice(14, 16)) };
    console.log(code);
    this.storage.getItem('storedScenes').then(d => {
      console.log(d);
      d.push(code);
      this.storage.setItem('storedScenes', d);
      this.schedule(code.hour, code.min,d.length + 1);
      this.router.navigate(['/scenes']);
    }, err => {
      let b = [];
      b.push(code);
      this.schedule(code.hour,code.min, 1);
      this.storage.setItem('storedScenes', b);
      this.router.navigate(['/scenes']);
      console.log(b)
    })
  }
  selectMood() {
    console.log(this.selectedMood)
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

}

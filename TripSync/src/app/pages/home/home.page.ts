import { Component, NgZone, OnInit, ViewChild, } from '@angular/core';
import { AlertController, IonSlides } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Pattern } from '../../shared/pattern'
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastController } from '@ionic/angular';
import iro from "@jaames/iro";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  loader: any;
  favouritePatterns = [];
  patternArray = Pattern.Pattern;
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
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  speedValue: any = 3000;
  selectedLhl: any;
  lastSlide: number;
  segmentSelected: any = 'color';

  constructor(
    public toastController: ToastController,
    private alertController: AlertController,
    private blte: BluetoothLE,
    private ngZone: NgZone,
    private storage: NativeStorage,
  ) {
    this.storage.getItem('connectedTo').then(d => {
      this.selectedLhl = d;
    }, err => {
      this.presentToast('No device connected');
    })
  }
  ngOnInit() {
    let colorWheel = iro.ColorPicker("#colorWheelDemo", {
      layout: [
        {
          component: iro.ui.Wheel,
          options: {
            wheelLightness: true,
            wheelAngle: 0,
            wheelDirection: "anticlockwise",
            // border width
            borderWidth: 2,
            // border color
            borderColor: 'thistle',
          }
        }
      ]

    });
    colorWheel.on('color:change', (c) => {
      console.log(c.rgba);
      this.hitValue(`C/${c.rgba.r}/${c.rgba.g}/${c.rgba.b}/0}`);
    })

  }

  retrieveFavs() {
    this.ngZone.run(() => {
      this.segment === 'color' ? this.segmentSelected = 'color' : this.segmentSelected = 'pattern';
      this.storage.getItem('patternsArray').then(favArr => {
        this.patternArray = favArr
        this.storage.getItem('favouritePatterns').then(favData => {
          this.favouritePatterns = favData;
          // console.log(this.favouritePatterns);
          setTimeout(() => {
            try {
              this.lastSlide ? this.slides.slideTo(this.lastSlide) : null;
            } catch {
              //
            }
          }, 50)

        }, err => {
          setTimeout(() => {
            try {
              this.lastSlide ? this.slides.slideTo(this.lastSlide) : null;
            } catch {
              //
            }
          }, 50)
          console.log(err)
        });
        // console.log(this.patternArray);
      }, err => {
        setTimeout(() => {
          try {
            this.lastSlide ? this.slides.slideTo(this.lastSlide) : null;
          } catch {
            //
          }
        }, 50)
        console.log(err)
      });
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

  hitValue(value) {
    console.log(value);
    var sendString = value;
    var bytes = this.blte.stringToBytes(sendString);
    var encodedString = this.blte.bytesToEncodedString(bytes);
    try {
      this.blte.write({ "value": encodedString, "service": "4FAFC201-1FB5-459E-8FCC-C5C9C331914B", "characteristic": "BEB5483E-36E1-4688-B7F5-EA07361B26A8", "address": this.selectedLhl }
      ).then(writeData => { console.log(writeData) }, err => {
        this.storage.remove('connectedTo');
        this.presentToast('Something went wrong! Please reconnect.');
        console.log(err)
      })
    } catch {
      //
    }

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

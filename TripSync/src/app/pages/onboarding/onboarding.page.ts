import { Component, OnInit, ViewChild } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { IonSlides, NavController } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  skip = true;
  @ViewChild(IonSlides) slides: IonSlides;

  constructor(    private navCtrl: NavController,
    private storage: NativeStorage,
  ) { }

  ngOnInit() {
  }
  skipToLast() {
    this.slides.slideTo(3);
  }
  next() {
    this.navCtrl.navigateRoot('/login');
    this.storage.setItem('firstTimeLogin', 'done');
  }
}

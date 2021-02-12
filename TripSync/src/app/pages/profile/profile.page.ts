import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../services/authentication/authentication.service';
import { NavController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userEmail: string;

  constructor(private storage: NativeStorage, private navCtrl: NavController,
    private authService: AuthenticateService
  ) {
    this.storage.getItem('email').then(d => {
      this.userEmail = d;
    });
  }

  ngOnInit() {

  }
  logout() {
    this.authService.logoutUser()
      .then(res => {
        console.log(res);
        this.navCtrl.navigateRoot('login');
      })
      .catch(error => {
        console.log(error);
      })
  }
}

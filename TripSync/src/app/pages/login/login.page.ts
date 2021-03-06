import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../../services/authentication/authentication.service';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';
  userEmail: string;
  loader: any;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  constructor(public toastController: ToastController,
    public loadingController: LoadingController,
    private storage: NativeStorage,
    private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder

  ) {
    this.storage.remove('connectedTo');
    this.presentLoading('Please wait..').then(() => {
      this.storage.getItem('firstTimeLogin').then(d => {
        if (d === 'done') {
          this.loader.dismiss();
          this.autoLogin();
        } else {
          this.loader.dismiss();

          this.navCtrl.navigateRoot('/onboarding');
        }
      }, err => {
        this.loader.dismiss();

        this.navCtrl.navigateRoot('/onboarding');

      })

    })
  }
  autoLogin() {
    this.presentLoading('Trying to login..').then(() => {
      this.authService.userDetails().subscribe(res => {
        console.log('res', res);
        if (res !== null) {
          this.userEmail = res.email;
          this.storage.setItem('email', this.userEmail);
          this.navCtrl.navigateRoot('/landing');
          this.loader.dismiss();
        } else {
          this.loader.dismiss();
          // this.presentToast("Oops, looks like you're logging in for the first time");
        }
      }, err => {
        this.loader.dismiss();
        console.log('err', err);
      })
    });

  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
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
  async presentLoading(mes) {
    this.loader = await this.loadingController.create({
      message: mes,
      mode: 'ios'
    });
    await this.loader.present();

  }
  ngOnInit() {

    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }


  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  guestLogin() {
    this.navCtrl.navigateRoot('/landing')
  }
  loginUser(value) {
    this.presentLoading('Logging in..').then(() => {
      this.authService.loginUser(value)
        .then(res => {
          console.log(res);
          this.errorMessage = "";
          this.loader.dismiss();
          this.navCtrl.navigateRoot('/landing');
        }, err => {
          this.loader.dismiss();
          this.errorMessage = err.message;
        })
    })
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }

}

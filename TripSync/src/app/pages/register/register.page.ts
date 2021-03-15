import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticateService } from '../../services/authentication/authentication.service';
import { LoadingController, NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  validations_form: FormGroup;


  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };
  loader: any;

  constructor(
    public toastController: ToastController,private navCtrl: NavController,
    private authService: AuthenticateService,
    private formBuilder: FormBuilder, public loadingController: LoadingController,

  ) { }

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
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  async presentLoading() {
    this.loader = await this.loadingController.create({
      message: 'Creating an account for you..',
      mode: 'ios'
    });
    await this.loader.present();

  }
  tryRegister(value) {
    this.presentLoading().then(() => {
      this.authService.registerUser(value)
      .then(res => {
        console.log(res);
        this.presentToast('Your account has been created. Please log in.');
        this.loader.dismiss();
        this.navCtrl.navigateRoot('');
      }, err => {
        console.log(err);
        this.presentToast(err.message);

        this.loader.dismiss();

      })
    })

  }

  goLoginPage() {
    this.navCtrl.navigateRoot('');
  }


}

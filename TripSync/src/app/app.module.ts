import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { ModalPage } from './pages/modal/modal.page';
import { ModalPageModule } from './pages/modal/modal.module';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { DBMeter } from '@ionic-native/db-meter/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [ModalPage],
  imports: [AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    BrowserModule, IonicModule.forRoot(), AppRoutingModule, ModalPageModule,

  ],
  providers: [DBMeter,LocalNotifications,
    NativeStorage,
    StatusBar,
    SplashScreen,
    BluetoothLE,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  newDevices = [{address: "24:62:AB:FD:E1:12",
  advertisement: "AgEGEQdLkTHDycXMj55FtR8Bwq9PBRISAEAAAgEGDwlMSEwtMjg4NTU0MjE2MQIKAwUSEgBAAAAAAAAAAAA=",
  name: "LHL-2885542161",
  rssi: -50,
  status: "scanResult"},{address: "24:62:AB:FD:E1:12",
  advertisement: "AgEGEQdLkTHDycXMj55FtR8Bwq9PBRISAEAAAgEGDwlMSEwtMjg4NTU0MjE2MQIKAwUSEgBAAAAAAAAAAAA=",
  name: "LHL-2885542161",
  rssi: -50,
  status: "scanResult"},{address: "24:62:AB:FD:E1:12",
  advertisement: "AgEGEQdLkTHDycXMj55FtR8Bwq9PBRISAEAAAgEGDwlMSEwtMjg4NTU0MjE2MQIKAwUSEgBAAAAAAAAAAAA=",
  name: "LHL-2885542161",
  rssi: -50,
  status: "scanResult"},{address: "24:62:AB:FD:E1:12",
  advertisement: "AgEGEQdLkTHDycXMj55FtR8Bwq9PBRISAEAAAgEGDwlMSEwtMjg4NTU0MjE2MQIKAwUSEgBAAAAAAAAAAAA=",
  name: "LHL-2885542161",
  rssi: -50,
  status: "scanResult"}];
  previousConnected = [{address: "24:62:AB:FD:E1:12",
  advertisement: "AgEGEQdLkTHDycXMj55FtR8Bwq9PBRISAEAAAgEGDwlMSEwtMjg4NTU0MjE2MQIKAwUSEgBAAAAAAAAAAAA=",
  name: "LHL-2885542161",
  rssi: -50,
  status: "scanResult"},{address: "24:62:AB:FD:E1:12",
  advertisement: "AgEGEQdLkTHDycXMj55FtR8Bwq9PBRISAEAAAgEGDwlMSEwtMjg4NTU0MjE2MQIKAwUSEgBAAAAAAAAAAAA=",
  name: "LHL-2885542161",
  rssi: -50,
  status: "scanResult"},{address: "24:62:AB:FD:E1:12",
  advertisement: "AgEGEQdLkTHDycXMj55FtR8Bwq9PBRISAEAAAgEGDwlMSEwtMjg4NTU0MjE2MQIKAwUSEgBAAAAAAAAAAAA=",
  name: "LHL-2885542161",
  rssi: -50,
  status: "scanResult"},{address: "24:62:AB:FD:E1:12",
  advertisement: "AgEGEQdLkTHDycXMj55FtR8Bwq9PBRISAEAAAgEGDwlMSEwtMjg4NTU0MjE2MQIKAwUSEgBAAAAAAAAAAAA=",
  name: "LHL-2885542161",
  rssi: -50,
  status: "scanResult"}];
  constructor(    private navCtrl: NavController,
    private menu: MenuController,private router: Router) { }

  ngOnInit() {
  }
  addDevice() {

  }
  goToHome () {
    this.menu.close();
  }
  goToScenes(){
    this.navCtrl.navigateForward('/scenes');
  }
  goToProfile(){
    this.navCtrl.navigateForward('/profile');
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
}

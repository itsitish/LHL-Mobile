import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private menu: MenuController,private router: Router) { }

  ngOnInit() {
  }
  goToScenes(){
    this.router.navigate(['/scenes']);
  }
  goToProfile(){
    this.router.navigate(['/profile']);

  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController} from '@ionic/angular';

@Component({
  selector: 'app-scene-add',
  templateUrl: './scene-add.page.html',
  styleUrls: ['./scene-add.page.scss'],
})
export class SceneAddPage implements OnInit {
  name: any='';
  constructor(private router: Router,
    public modalController: ModalController) { }

  ngOnInit() {
  }
  addActions() {
    this.router.navigate(['/modal'], {state: {'sceneName': this.name}});
    this.modalController.dismiss();
  }
}

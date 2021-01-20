import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
})
export class FavouritesComponent implements OnInit {
  @Input() variable;
  @Input() pattern;
  @Input() label;
  @Input() putClass;
  
  constructor() {

  }

  ngOnInit() { }

}

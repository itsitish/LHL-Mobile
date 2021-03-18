import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() isDark: any;
  @Output() public messageToEmit = new EventEmitter();
  @Input() public setAction = false;

  constructor() { }

  ngOnInit() { }

  backButtonAlert($event) {
    this.messageToEmit.emit($event)
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-error-messages',
  templateUrl: './server-error-messages.component.html',
  styleUrls: ['./server-error-messages.component.scss']
})
export class ServerErrorMessagesComponent implements OnInit {

  @Input('server-error-messages') serverErrorMessages: string[] = null;

  constructor() { }

  ngOnInit(): void {
  }

}

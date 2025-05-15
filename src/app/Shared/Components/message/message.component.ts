import { CommonModule, NgIf } from '@angular/common';
import { Component,Input } from '@angular/core';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-message',
  imports: [CommonModule, NgIf],
  templateUrl: './message.component.html',
  standalone:true
})
export class MessageComponent {
   @Input() message: string = '';
  visible = false;

  constructor(private MessageSer:MessageService){}
  ngOnInit() {
  this.MessageSer.message$.subscribe(msg => {
    if (msg) {
      this.message = msg;
      this.visible = true;
       
      setTimeout(() => {
      this.visible = false;
    }, 3000);
    }
  });
}

}

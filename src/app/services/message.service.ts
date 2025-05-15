import { Injectable } from '@angular/core';
import { MessageComponent } from '../Shared/Components/message/message.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  private _message = new BehaviorSubject<string>('');
  message$ = this._message.asObservable();
  
  show(msg: string) {
    this._message.next(msg);
  }
}

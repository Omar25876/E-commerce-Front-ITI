import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharingUserService {

  private isPressedSource = new BehaviorSubject<boolean>(false);
  isPressed$ = this.isPressedSource.asObservable();

  private user: any = null;

  setIsPressed(value: boolean) {
    this.isPressedSource.next(value);
  }

  getIsPressed(): boolean {
    return this.isPressedSource.getValue();
  }

  setUser(user: any) {
    this.user = user;
  }

  getUser(): any {
    return this.user;
  }

  reset() {
    this.isPressedSource.next(false);
    this.user = null;
  }
}

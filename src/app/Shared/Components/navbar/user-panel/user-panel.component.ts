import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styles: ''
})
export class UserPanelComponent {
@Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();
fire(){
  this.toggleSidebar.emit();
  console.log("toggleSidebar event emitted");
}
}

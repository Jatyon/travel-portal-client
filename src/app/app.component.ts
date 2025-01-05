import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { AppSocketService } from '@shared/app-socket/services/app-socket.service';
import { AuthService } from '@shared/auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  authSub?: Subscription;

  constructor(private readonly authService: AuthService, private readonly appSocketService: AppSocketService) {}

  ngOnInit(): void {
    this.authSub = this.authService.user$.subscribe((result) => {
      if (result) this.appSocketService.connect();
      else this.appSocketService.disconnect();
    });
  }
}

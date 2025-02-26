import { RouterOutlet } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppSocketService } from '@shared/app-socket/services/app-socket.service';
import { AuthService } from '@shared/auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private title = 'Travel Portal';
  private authSub: Subscription = new Subscription();

  constructor(private readonly authService: AuthService, private readonly appSocketService: AppSocketService, private readonly titleService: Title) {
    titleService.setTitle(this.title);
  }

  ngOnInit(): void {
    this.authSub.add(
      this.authService.user$.subscribe((result) => {
        if (result) this.appSocketService.connect();
      }),
    );
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}

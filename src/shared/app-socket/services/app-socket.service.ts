import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { AuthService } from '@shared/auth/services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class AppSocketService {
  private _socket!: Socket;
  private _config = {
    url: `${environment.host}`,
  };

  private _connection$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public connection$: Observable<boolean> = this._connection$.asObservable();

  constructor(private readonly authService: AuthService) {}

  get isConnection(): boolean {
    return this._connection$.getValue();
  }

  connect(): void {
    if (this.isConnection) return;

    this._socket = io(this._config.url, {
      transports: ['websocket'],
      auth: { token: `Bearer ${this.authService.getToken()}` || '' },
      reconnectionDelay: 3000,
    });

    this._socket.on('connect', () => {
      console.log({ msg: 'Socket connection...' });
      this._connection$.next(true);
    });

    this._socket.on('disconnect', () => {
      console.log({ msg: 'Socket disconnection' });
      this._connection$.next(false);
    });
  }

  on(event: string, cb: (data: any) => void): void {
    this._socket.on(event, cb);
  }

  emit(eventName: string, data: any): void {
    if (!this.isConnection) return;

    this._socket.emit(eventName, data);
  }

  disconnect(): void {
    if (!this.isConnection) {
      console.log("Socket object doesn't exist");
      return;
    }

    this._socket.disconnect();
    this.authService.user$.next(null);
    this._connection$.next(false);
  }
}

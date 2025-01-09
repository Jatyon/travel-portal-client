import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { User } from '@shared/user/models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  findUsersInSearch(nick: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.host}/user/search/${nick}`);
  }
}

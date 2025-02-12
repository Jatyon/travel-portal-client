import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { UserSearch } from '../models/user-search.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  findUsersInSearch(nick: string): Observable<UserSearch[]> {
    return this.httpClient.get<UserSearch[]>(`${environment.host}/user/search/${nick}`);
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { User } from '@shared/user/models/user.model';
import { UserService } from '@shared/user/services/user.service';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './top-nav.component.html',
  styleUrls: ['top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  searchControl = new FormControl();
  users: User[] = [];
  isLoading = false;

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.trim() === '') return of([]);

          this.isLoading = true;
          return this.userService.findUsersInSearch(query);
        }),
        catchError(() => {
          this.isLoading = false;
          return of([]);
        }),
      )
      .subscribe((results) => {
        this.users = results;
        this.isLoading = false;
      });
  }
}

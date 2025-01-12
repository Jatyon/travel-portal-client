import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@shared/user/models/user.model';
import { UserService } from '@shared/user/services/user.service';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './search.component.html',
  styleUrls: ['search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() isArrowBack: boolean = false;

  searchControl = new FormControl();
  users: User[] = [];
  isLoading: boolean = false;

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

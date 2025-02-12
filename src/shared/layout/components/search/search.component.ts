import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserSearch } from '@shared/user/models/user-search.model';
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

  @Output() closeSearch = new EventEmitter<void>();

  searchControl = new FormControl();
  users: UserSearch[] = [];

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.search();
  }

  toogleSearch() {
    this.closeSearch.emit();
  }

  clearSearch() {
    this.searchControl.reset();
  }

  search(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.trim() === '') return of([]);

          return this.userService.findUsersInSearch(query);
        }),
        catchError(() => {
          return of([]);
        }),
      )
      .subscribe((results) => {
        this.users = results;
      });
  }
}

import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserSearch } from '@shared/user/models/user-search.model';
import { UserService } from '@shared/user/services/user.service';
import { catchError, debounceTime, distinctUntilChanged, map, of, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './search.component.html',
  styleUrls: ['search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() isArrowBack: boolean = false;

  @Output() closeSearch = new EventEmitter<void>();

  @ViewChild('searchDiv') searchDiv!: ElementRef;

  searchControl = new FormControl();
  users: UserSearch[] = [];
  isSearch: boolean = false;
  private subscriptions = new Subscription();

  constructor(private readonly router: Router, private readonly userService: UserService) {}

  ngOnInit(): void {
    this.search();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isSearch) return;

    if (this.searchDiv && !this.searchDiv.nativeElement.contains(event.target)) {
      this.isSearch = false;
    }
  }

  toogleSearch() {
    this.closeSearch.emit();
    this.clearSearch();
  }

  clearSearch() {
    this.searchControl.reset();
    this.isSearch = false;
    this.users = [];
  }

  onInputClick() {
    if (this.searchControl.value) this.isSearch = true;
  }

  search(): void {
    const searchSub = this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.trim() === '') return of({ users: [], isSearch: false });

          return this.userService.findUsersInSearch(query).pipe(
            map((users) => ({
              users,
              isSearch: true,
            })),
            catchError(() => of({ users: [], isSearch: true })),
          );
        }),
      )
      .subscribe((results) => {
        this.users = results.users;
        this.isSearch = results.isSearch;
      });

    this.subscriptions.add(searchSub);
  }

  searchUsers() {
    if (!this.searchControl.value) return;

    this.router.navigate(['/search'], { queryParams: { search_query: this.searchControl.value } });
  }
}

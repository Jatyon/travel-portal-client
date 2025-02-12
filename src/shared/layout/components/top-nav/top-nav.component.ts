import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@shared/user/models/user.model';
import { SearchComponent } from '../search/search.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, SearchComponent],
  templateUrl: './top-nav.component.html',
  styleUrls: ['top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  searchControl = new FormControl();
  users: User[] = [];
  isLoading: boolean = false;
  isSearch: boolean = false;
  isSmallScreen: boolean = false;

  constructor(private readonly breakpointObserver: BreakpointObserver, private readonly router: Router) {
    this.breakpointObserver.observe(['(max-width: 575px)']).subscribe((result) => {
      this.isSmallScreen = result.matches;
    });
  }

  ngOnInit(): void {}

  toogleIsSearch() {
    this.isSearch = !this.isSearch;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}

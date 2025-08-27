import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IUsers } from '../../types/users';
import { Userservice } from '../../user/services/user';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkActive,RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
 cartCount = 0;
  currentUser: IUsers | null = null;

  constructor(private userService: Userservice) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
  }

  logout(): void {
    this.userService.logout();
    this.currentUser = null;
  }
}

import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {User} from "../../core/model/user.model";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  navItems: {name: string, route: string, iconUrl: string}[] = [];
  user:User | null = null;

  ngOnInit() {


    if(this.user?.role === 'ADMIN'){
      this.navItems = [
        {name: 'Profile', route: '/profile', iconUrl: 'icons/profile.png'},
        {name: 'Logout', route: '/profile', iconUrl: ''},
      ]
    } else if (this.user?.role === 'REGULAR_USER') {
      this.navItems = [
        {name: 'Profile', route: '/profile', iconUrl: 'icons/profile.png'},
        {name: 'Logout', route: '/profile', iconUrl: ''},
      ]
    } else {
      this.navItems = [
        {name: 'Home', route: '', iconUrl: 'assets/icons/profile.png'},
        {name: 'Login', route: '/login', iconUrl: 'assets/icons/add.png'},
        {name: 'Signup', route: '/signup', iconUrl: 'assets/icons/logout.png'},
      ]
    }

  }

}

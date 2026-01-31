import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {NavigationEnd, Router, RouterModule} from "@angular/router";
import {User} from "../../core/model/user.model";
import {AuthService} from "../../core/service/auth/auth.service";

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
  isTransparent: boolean = true;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const transparentRoutes = ['', '/', '/login', '/signup'];
        this.isTransparent = transparentRoutes.includes(event.url);
      }
    });

    this.authService.userRole$.subscribe(role => {
      console.log('Navbar primio ulogu:', role);
      this.updateNavItems(role);
    });
  }

  updateNavItems(role: string) {
    if (role === 'ADMIN') {
      this.navItems = [
        { name: 'Profile', route: '/profile', iconUrl: 'icons/profile.png' },
        { name: 'Notifications', route: '/profile', iconUrl: 'icons/profile.png' },
        { name: 'Logout', route: '', iconUrl: '' }
      ];
    } else if (role === 'GUEST' ) {
      this.navItems = [
        { name: 'Profile', route: '/profile', iconUrl: 'icons/profile.png' },
        { name: 'Notifications', route: '/profile', iconUrl: 'icons/profile.png' },
        { name: 'Logout', route: '', iconUrl: '' }
      ];
    } else if (role === 'HOST') {
      this.navItems = [
        { name: 'Profile', route: '/profile', iconUrl: 'icons/profile.png' },
        { name: 'Notifications', route: '/profile', iconUrl: 'icons/profile.png' },
        { name: 'Logout', route: '', iconUrl: '' }
      ];
    } else {
      this.navItems = [
        { name: 'Home', route: '', iconUrl: 'assets/icons/profile.png' },
        { name: 'Login', route: '/login', iconUrl: 'assets/icons/add.png' },
        { name: 'Signup', route: '/signup', iconUrl: 'assets/icons/logout.png' }
      ];
    }

  }

  onLogout() {
    this.authService.logout();
  }

}

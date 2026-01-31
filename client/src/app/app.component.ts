import { Component } from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from "./shared/navbar/navbar.component";
import {CommonModule} from "@angular/common";
import {AuthService} from "./core/service/auth/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
  userRole: string = '';
  isVideoVisible: boolean = true;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.userRole$.subscribe((role) => {
      this.userRole = role;
    });

    const checkVideoVisibility = (url: string) => {
      const videoRoutes = ['/', '/login', '/signup', ''];
      const currentRoute = url.split('?')[0];
      this.isVideoVisible = videoRoutes.includes(currentRoute);
    };

    checkVideoVisibility(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        checkVideoVisibility(event.urlAfterRedirects || event.url);
      }
    });
  }
}

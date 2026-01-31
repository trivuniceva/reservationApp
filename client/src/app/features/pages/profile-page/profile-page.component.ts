import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AuthService} from "../../../core/service/auth/auth.service";
import {User} from "../../../core/model/user.model";
import {CommonModule, isPlatformBrowser, NgIf} from "@angular/common";
import {EntityHeaderComponent} from "../../../shared/ui/entity-header/entity-header.component";
import {TabsComponent} from "../../../shared/ui/tabs/tabs.component";
import {EditProfileComponent} from "../../components/edit-profile/edit-profile.component";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    TabsComponent,
    EditProfileComponent,
    EntityHeaderComponent,

  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit{
  user: User | null = null;
  showEditPopup = false;

  activeTab = 'Reservation';
  tabs = ['Reservation', 'Make Reservation', 'History'];

  hideSidebar = false;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.user = this.authService.getUserInfo();
      console.log('Podaci o korisniku na profilu:', this.user);
    }

  }

  onTabChange(tab: string) {
    this.activeTab = tab;
    this.hideSidebar = tab === 'Users Overview' || tab === 'Quick Actions';
  }

  closeEditPopup() {
    this.showEditPopup = false;
  }

  openEditPopup() {
    console.log("klikno")
    this.showEditPopup = true;
  }


}

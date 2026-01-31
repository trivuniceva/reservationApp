import {AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AuthService} from "../../../core/service/auth/auth.service";
import {User} from "../../../core/model/user.model";
import {CommonModule, isPlatformBrowser, NgIf} from "@angular/common";
import {EntityHeaderComponent} from "../../../shared/ui/entity-header/entity-header.component";
import {TabsComponent} from "../../../shared/ui/tabs/tabs.component";
import {EditProfileComponent} from "../../components/edit-profile/edit-profile.component";
import {PropertiesPageComponent} from "../properties/properties-page/properties-page.component";
import {CreateApartmentPageComponent} from "../properties/create-apartment-page/create-apartment-page.component";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    TabsComponent,
    EditProfileComponent,
    EntityHeaderComponent,
    PropertiesPageComponent,
    CreateApartmentPageComponent,

  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit{
  user: User | null = null;
  showEditPopup = false;

  activeTab = '';
  tabs: string[] = [];

  hideSidebar = false;

  constructor(
    private authService: AuthService,
    private cdref: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.user = this.authService.getUserInfo();
        if (this.user) {
          this.setTabsByRole(this.user.role);
        }
      });
    }
  }

  private setTabsByRole(role: string) {
    if (role === 'GUEST') {
      this.tabs = ['Reservation', 'Make Reservation', 'History'];
      this.activeTab = 'Reservation';
    } else if (role === 'HOST') {
      this.tabs = ['Create Apartment', 'My Properties', 'Bookings', 'Income', 'Analytics'];
      this.activeTab = 'Create Apartment';
    } else if (role === 'ADMIN') {
      this.tabs = ['Users Overview', 'Quick Actions', 'System Logs'];
      this.activeTab = 'Users Overview';
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

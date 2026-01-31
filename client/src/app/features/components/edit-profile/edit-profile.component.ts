import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {User} from "../../../core/model/user.model";
import {InputComponent} from "../../../shared/ui/input/input.component";
import {ButtonComponent} from "../../../shared/ui/button/button.component";
import {UserService} from "../../../core/service/user/user.service";

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();

  private selectedFile: File | null = null;
  public password = '';
  public confirmPassword = '';

  constructor(private userService: UserService) {
  }

  closePopup() {
    this.close.emit();
  }

  onFileSelected($event: Event) {

  }

  // edit-profile.component.ts
  saveProfileInfo() {
    if (this.password && this.password !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Pripremamo podatke za slanje (DTO)
    const updateData = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      password: this.password || null // Šaljemo pass samo ako je unet
    };

    this.userService.updateUser(this.user.id, updateData).subscribe({
      next: (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));

        alert('Profile updated successfully!');

        this.closePopup();

        window.location.reload();
      },
      error: (err) => {
        console.error('Error Error updating profile:', err);
        alert('Failed to update profile.');
      }
    });
  }

}

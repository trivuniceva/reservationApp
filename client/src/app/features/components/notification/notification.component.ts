import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from "../../../core/service/notifications/notifications.service";
import { PropertiesService } from "../../../core/service/properties/properties.service";

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  @Input() notification: any;
  @Output() onActionFinished = new EventEmitter<void>();

  constructor(
    private propService: PropertiesService,
    private notifService: NotificationsService
  ) {}

  approve() {
    if (this.notification && this.notification.relatedPropertyId) {
      this.propService.approveProperty(this.notification.relatedPropertyId).subscribe({
        next: () => {
          this.notifService.markAsRead(this.notification.id).subscribe({
            next: () => {
              this.onActionFinished.emit();
            }
          });
        }
      });
    }
  }

  close() {
    this.onActionFinished.emit();
  }
}

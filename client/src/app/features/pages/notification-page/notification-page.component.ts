import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from "../../components/notification/notification.component";
import { NotificationsService, Notification as AppNotification } from "../../../core/service/notifications/notifications.service";

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [
    CommonModule,
    NotificationComponent
  ],
  templateUrl: './notification-page.component.html',
  styleUrl: './notification-page.component.css'
})
export class NotificationPageComponent implements OnInit {
  notifications: AppNotification[] = [];
  selectedNotif: AppNotification | null = null;

  constructor(private notifService: NotificationsService) {}

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.notifService.getUnreadNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.selectedNotif = null;
      }
    });
  }

  selectNotification(notif: AppNotification) {
    this.selectedNotif = notif;
  }
}

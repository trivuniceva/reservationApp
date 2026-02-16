package notifications.notifications;

import accommodationmodule.accommodationmodule.dto.PropertyCreatedEvent;
import notifications.notifications.model.Notification;
import notifications.notifications.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    @Autowired
    private NotificationRepository notificationRepository;

    @EventListener
    public void handlePropertyCreated(PropertyCreatedEvent event) {
        Notification notification = new Notification();
        notification.setRecipientRole("ADMIN");

        notification.setMessage("Smeštaj '" + event.getPropertyName() + "' (ID: " + event.getPropertyId() + ") čeka na odobrenje.");
        notification.setRelatedPropertyId(event.getPropertyId());

        notificationRepository.save(notification);
    }

}

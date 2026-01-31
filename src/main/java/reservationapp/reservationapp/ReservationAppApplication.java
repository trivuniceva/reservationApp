package reservationapp.reservationapp;

import accommodationmodule.accommodationmodule.AccommodationModuleApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import usermodule.usermodule.UserModuleApplication;

@SpringBootApplication
@Import({UserModuleApplication.class, AccommodationModuleApplication.class})
public class ReservationAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReservationAppApplication.class, args);
    }

}

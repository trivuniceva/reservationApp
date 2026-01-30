package reservationapp.reservationapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import usermodule.usermodule.UserModuleApplication;

@SpringBootApplication
@Import(UserModuleApplication.class)
public class ReservationAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReservationAppApplication.class, args);
    }

}

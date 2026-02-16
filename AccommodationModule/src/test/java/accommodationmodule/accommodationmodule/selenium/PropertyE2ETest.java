package accommodationmodule.accommodationmodule.selenium;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PropertyE2ETest {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeAll
    void setup() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(30));
    }

    private void lag(int millis) throws InterruptedException {
        Thread.sleep(millis);
    }

    @Test
    void testDefineAvailabilityPriceAndCancellation() throws InterruptedException {
        driver.get("http://localhost:4200/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[formcontrolname='email']"))).sendKeys("jana@gmail.com");
        driver.findElement(By.cssSelector("input[formcontrolname='password']")).sendKeys("sad");
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        lag(3000);

        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(text(), 'My Properties')]"))).click();
        lag(2000);
        wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".property-card"))).click();
        lag(2000);
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(text(), 'Cene i Dostupnost')]"))).click();
        lag(2000);

        int[] singleClickDays = {15, 16, 17};

        for (int day : singleClickDays) {
            driver.findElement(By.xpath("//div[contains(@class, 'calendar-day')]//span[text()='" + day + "']/..")).click();
            System.out.println("LOG: Kliknuto jednom na dan " + day);
            lag(1000);
        }

        WebElement day18 = driver.findElement(By.xpath("//div[contains(@class, 'calendar-day')]//span[text()='18']/.."));
        day18.click();
        System.out.println("LOG: Dan 18 - prvi klik (unavailable).");
        lag(1500);
        day18.click();
        System.out.println("LOG: Dan 18 - drugi klik (vraćeno na available).");
        lag(2000);

        driver.findElement(By.xpath("//button[contains(text(), 'Posebne Cene')]")).click();
        lag(1500);

        WebElement strategySelect = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//select")));
        Select select = new Select(strategySelect);
        select.selectByValue("PER_UNIT");
        System.out.println("LOG: Izabrana strategija: PER_UNIT.");
        lag(1000);

        WebElement priceInput = driver.findElement(By.cssSelector("input[type='number']"));
        priceInput.sendKeys(Keys.chord(Keys.COMMAND, "a"), Keys.BACK_SPACE);
        priceInput.sendKeys("150");
        lag(1000);

        WebElement day20 = driver.findElement(By.xpath("//div[contains(@class, 'calendar-day')]//span[text()='20']/.."));
        day20.click();
        lag(1500);

        driver.findElement(By.cssSelector(".save-price-btn")).click();
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();
        lag(2000);

        driver.findElement(By.xpath("//button[contains(text(), 'Opšta Pravila')]")).click();
        lag(2000);

        WebElement cancelInput = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//div[contains(@class, 'settings-view')]//input[@type='number']")));

        cancelInput.sendKeys(Keys.chord(Keys.COMMAND, "a"), Keys.BACK_SPACE);
        cancelInput.sendKeys("7");
        lag(1000);

        driver.findElement(By.xpath("//button[contains(text(), 'Sačuvaj pravila')]")).click();
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();
        lag(2000);

        System.out.println("TEST FINISHED: Uspešno odrađen specifičan redosled klikova!");
    }

    @AfterAll
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}

package com.nsa.testing.tests;

import java.io.IOException;
import java.util.Properties;

import javax.xml.parsers.ParserConfigurationException;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Test;
import org.xml.sax.SAXException;

import com.nsa.testing.commons.Browser;
import com.nsa.testing.commons.Common;

@Test
public class DashboardPhotosTest extends Browser {
	Properties properties;
	WebElement element;

	@BeforeMethod
	public void StartBrowser() throws IOException {
		properties = readData(PROP_COMMON_PROPERTIES);
	}

	@AfterMethod
	public void ClosingBrowser() {
		closeBrowser();
	}

	@Test
	public void addDashboardPhotos() throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties properties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(12000);
		Common.clickPos(driver, properties, "asset_mgmt");
		Common.clickPos(driver, properties, "dashboard_nav");
		Thread.sleep(7000);
		Common.clickPos(driver, properties, "add_photos_btn");
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "upload_Link");
		Common.uploadFile("nature.jpg");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "dashboard_close");
		Thread.sleep(5000);

	}
}
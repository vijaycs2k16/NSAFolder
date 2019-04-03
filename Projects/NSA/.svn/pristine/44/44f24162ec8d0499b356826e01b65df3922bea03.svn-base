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
import org.testng.annotations.Parameters;

import com.nsa.testing.commons.Browser;
import com.nsa.testing.commons.Common;

@Test
public class CreateHomeworkTest extends Browser {
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
	@Parameters({ "hwname", "description", "subject" })
	public void createHomework(@Optional String hwname,
			@Optional String description, @Optional String subject)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "click_school_management");
		Common.clickPos(driver, properties, "click_create_homework");
		Thread.sleep(5000);
		Common.clickPos(driver, properties, "click_add_homework");
		Thread.sleep(10000);
		Common.clickPos(driver, properties, "click_class_taxanomy");
		Common.clickPos(driver, properties, "click_section_taxanomy");
		Common.sendKeysPos(driver, properties, "set_hwname", hwname);
		Thread.sleep(1000);
		Common.clickPos(driver, properties, "select_dropdown");
		Thread.sleep(2000);
		Common.clickValues("xpath", properties, "select_sub", subject);
		Common.clickPos(driver, properties, "select_dropdown");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "select_date");
		Thread.sleep(2000);
		Common.clickValue("xpath", properties, "radio_selected_stn",
				"Selected Students");
		Thread.sleep(5000);
		Common.clickPos(driver, properties, "stn_list_dropdwn");
		Thread.sleep(2000);
		Common.clickValues("xpath", properties, "select_student", "Rama Krishna");
		Common.clickPos(driver, properties, "stn_list_dropdwn");
		Common.clickPos(driver, properties, "upload_Link");
		Common.uploadFile("AboutUs.txt");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "saveas_Draft");
		Thread.sleep(5000);

	}

}

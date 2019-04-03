package com.nsa.testing.tests;

import java.io.IOException;
import java.util.Properties;

import javax.xml.parsers.ParserConfigurationException;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.Reporter;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import com.nsa.testing.commons.Browser;
import com.nsa.testing.pageObjects.LoginPage;
import com.nsa.testing.commons.Common;

public class OnboardNotification extends Browser {

	Properties properties = null;

	@BeforeMethod
	public void startBrowser() throws IOException {
		properties = readData(PROP_COMMON_PROPERTIES);
	}

	@AfterMethod
	public void closingBrowser() {
		closeBrowser();
	}

	@Test
	@Parameters({"notifi_name", "radio_name"})
	public void onboardnotification(@Optional String radio_name, @Optional String notifi_name)
			throws ParserConfigurationException, SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" + driver);
		Common.clickPos(driver, loginproperties, "activity_nav");
		Common.clickPos(driver, loginproperties, "navigate_OnBoard");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "click_AddOnboard");
		Thread.sleep(5000);
		Common.setText("xpath", loginproperties, "notify_name", notifi_name);
		Common.clickValue("xpath", loginproperties, "radio_label", radio_name);
		Common.clickPos(driver, loginproperties, "class_stu");
		Common.clickPos(driver, loginproperties, "div_cls");
		Common.clickPos(driver, loginproperties, "sent");
		
	}
	
}

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

public class Holidays extends Browser {

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
	@Parameters({ "holiname", "holitype" })
	public void createHoliday(@Optional String holiname, @Optional String holitype)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(5000);
		System.out.println("sucesss" + driver);
		Common.clickPos(driver, loginproperties, "navigate_Academic");
		Common.clickSubMenu("linkText", loginproperties, "linktext_Cal",
				"linktext_Holi");
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "click_AddHolidays");
		Common.setText("xpath", loginproperties, "holi_Name", holiname);
		Common.clickPos(driver, loginproperties, "sel_Holi");
		Thread.sleep(5000);
		Common.clickValue("xpath", loginproperties, "sel_Holitype", holitype);
		Thread.sleep(5000);
		// Common.clickPos(driver, loginproperties, "holiday_Save");
		Common.clickPos(driver, loginproperties, "sel_Date");
		Common.clickPos(driver, loginproperties, "holiApply");
		Thread.sleep(5000);
	}

}
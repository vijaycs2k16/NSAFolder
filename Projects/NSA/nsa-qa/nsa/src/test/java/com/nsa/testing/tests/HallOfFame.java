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

public class HallOfFame extends Browser {

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
	@Parameters({ "award_Name", "student", "category_desc" })
	public void hallofFame(@Optional String award_Name,
			@Optional String student, @Optional String category_desc)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "activity_nav");
		Common.clickPos(driver, loginproperties, "navigate_HallOfFame");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "click_AddAward");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "award_Sel", award_Name);
		Common.setDate("xpath", loginproperties, "hof_Date", "22-May-2018");
		Common.setText("xpath", loginproperties, "sel_student", student);
		Common.clickPos(driver, loginproperties, "list");
		Common.sendKeysPos(driver, loginproperties, "category", category_desc);
		Common.clickPos(driver, loginproperties, "savebtn");
		Thread.sleep(3000);
	}

}

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

public class CreateActivity extends Browser {

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
	@Parameters({ "activity_Name", "activity_description", "to_Date",
			"from_Date", "st_Time", "ed_Time", "type", "category",
			"venue_selection" })
	public void createActivity(@Optional String activity_Name,
			@Optional String activity_description, @Optional String to_Date,
			@Optional String from_Date, @Optional String st_Time,
			@Optional String ed_Time, @Optional String type,
			@Optional String category, @Optional String venue_selection)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "activity_nav");
		Common.clickSubMenu("linkText", loginproperties, "linktext_Act",
				"linktext_Createactivity");
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "create_ActivityBt");
		Thread.sleep(2000);
		Common.sendKeysPos(driver, loginproperties, "activity_Title",
				activity_Name);
		Common.sendKeysPos(driver, loginproperties, "activity_desc",
				activity_description);
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "date_Click");
		Common.setText("xpath", loginproperties, "start_Date", from_Date);
		Thread.sleep(3000);
		Common.setText("xpath", loginproperties, "end_Date", to_Date);
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "date_Apply");
		Common.setText("id", loginproperties, "start_Time", st_Time);
		Thread.sleep(1000);
		Common.setText("id", loginproperties, "end_Time", ed_Time);
		Thread.sleep(1000);
		Common.clicksValue("xpath", loginproperties, "select_Type", type);
		Thread.sleep(3000);
		Common.clickValue("xpath", loginproperties, "select_Category", category);
		Common.clickPos(driver, loginproperties, "venue_Ns");
		Common.clickValue("xpath", loginproperties, "venue_sel",
				venue_selection);
		Common.clickPos(driver, loginproperties, "venue_Ns");
		Common.clickPos(driver, loginproperties, "tax_sel");
		// Common.clickScrollDown("xpath", loginproperties, "scroll_Down");
		// Common.clickPos(driver, loginproperties, "closebtn");
		Common.clickPos(driver, loginproperties, "save_event");
		Thread.sleep(5000);

	}

}

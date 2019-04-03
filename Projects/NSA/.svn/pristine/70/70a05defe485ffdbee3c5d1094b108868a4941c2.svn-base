package com.nsa.testing.tests;

import java.io.IOException;
import java.util.Properties;

import javax.xml.parsers.ParserConfigurationException;

import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;
import org.xml.sax.SAXException;

import com.nsa.testing.commons.Browser;
import com.nsa.testing.commons.Common;

public class ActivityCategory extends Browser {

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
	@Parameters({ "categoryname", "decsription" })
	public void activityCategory(@Optional String categoryname,
			@Optional String decsription) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "activity_nav");
		Common.clickSubMenu("linkText", loginproperties, "linktext_Act",
				"linktext_Cat");
		Thread.sleep(9000);
		Common.clickPos(driver, loginproperties, "add_Category");
		Common.sendKeysPos(driver, loginproperties, "venue_Name", categoryname);
		Common.sendKeysPos(driver, loginproperties, "venue_Location", decsription);
		Common.clickPos(driver, loginproperties, "savebtn");
		Thread.sleep(7000);

	}

}

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

public class SectionList extends Browser {

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
	@Parameters({ "seccode", "secname", "secstatus" })
	public void addSection(@Optional String seccode,
			@Optional String secname, @Optional String secstatus)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(9000);
		System.out.println("sucesss" + driver);
		Common.clickPos(driver, loginproperties, "navigate_Academic");
		Thread.sleep(2000);
		Common.clickSubMenu("linkText", loginproperties, "linktext_Sec",
				"linktext_Seclist");
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "click_AddSection");
		Thread.sleep(5000);
		Common.sendKeysPos(driver, loginproperties, "sec_Name", secname);
		Common.sendKeysPos(driver, loginproperties, "sec_Code", seccode);
		Thread.sleep(2000);
		Common.clicksValue("xpath", loginproperties, "sec_status", secstatus);
		Common.clickPos(driver, loginproperties, "savebtn");

	}

}

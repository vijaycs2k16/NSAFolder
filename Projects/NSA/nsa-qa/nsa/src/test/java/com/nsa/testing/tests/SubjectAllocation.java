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

public class SubjectAllocation extends Browser {

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
	@Parameters({ "subj_Name", "academics_Radio" })
	public void subAlloc(@Optional String subj_Name,
			@Optional String academics_Radio)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "navigate_Academic");
		Common.clickSubMenu("linkText", loginproperties, "linktext_Sub", "linktext_Suballoc");
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "click_AssociateSubject");
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "sub_Taxcls");
		Common.clickPos(driver, loginproperties, "sub_Taxsec");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "sub_Ns");
		Thread.sleep(2000);
		Common.clickValues("xpath", loginproperties, "sub_sel", subj_Name);
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "sub_Ns");
		Common.clickValue("xpath", loginproperties, "academics",
				academics_Radio);
		Common.clickPos(driver, loginproperties, "savebtn");
	}

}

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

public class SectionAllocation extends Browser {

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
	@Parameters({ "assoc_Class", "assoc_Sec" })
	public void sectionAllowcation(@Optional String assoc_Class,
			@Optional String assoc_Sec) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "navigate_Academic");
		Common.clickSubMenu("linkText", loginproperties, "linktext_Sec",
				"linktext_Secalloc");
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "click_AssociateSection");
		Common.clicksValue("xpath", loginproperties, "assoc_Cls", assoc_Class);
		Common.click(driver, loginproperties, "assoc_sec");
		Common.clickValue("xpath", loginproperties, "assoc_seca", assoc_Sec);
		Common.clickPos(driver, loginproperties, "assoc_sec");
		Common.setText("xpath", loginproperties, "stu_intake", "10");
		Common.clickPos(driver, loginproperties, "savebtn");
		Thread.sleep(3000);
	}

}

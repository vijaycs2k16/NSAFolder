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

public class SubjectList extends Browser {

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
	@Parameters({ "aspect_Name", "aspect_Code", "dept_Name", "subject_Name",
			"subject_Code", "sel_Aspns", "aspect", "status_Value" })
	public void addSubject(@Optional String aspect_Name,
			@Optional String aspect_Code, @Optional String dept_Name,
			@Optional String subject_Name, @Optional String subject_Code,
			@Optional String sel_Aspns, @Optional String aspect,
			@Optional String status_Value) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(5000);
		System.out.println("sucesss" + driver);
		Common.clickPos(driver, loginproperties, "navigate_Academic");
		Common.clickSubMenu("linkText", loginproperties, "linktext_Sub",
				"linktext_Sublist");
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "click_Aspect");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "click_AddAspect");
		Thread.sleep(2000);
		Common.sendKeysPos(driver, loginproperties, "aspect_Name", aspect_Name);
		Common.sendKeysPos(driver, loginproperties, "aspect_Code", aspect_Code);
		Common.clickPos(driver, loginproperties, "save_Aspect");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "close_Aspect");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "click_AddSubject");
		Thread.sleep(2000);
		Common.clicksValue("xpath", loginproperties, "sel_subdept", dept_Name);
		Common.setText("id", loginproperties, "select_Subject", subject_Name);
		Common.setText("id", loginproperties, "subject_Code", subject_Code);
		Common.click(driver, loginproperties, "sel_Aspns");
		Common.clickValue("xpath", loginproperties, "aspect", aspect);
		Common.clickPos(driver, loginproperties, "sel_Aspns");
		// Common.clicksValue("xpath", loginproperties, "sel_Substatus",
		// status_Value);
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "save_subject");
		Thread.sleep(2000);

	}
}

package com.nsa.testing.tests;

import java.io.IOException;
import java.util.Properties;

import javax.xml.parsers.ParserConfigurationException;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
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

public class ProgressCard extends Browser {

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
	@Parameters({"exam_Clsname", "exam_Secname", "exam_name", "grade"})
	public void progrsCrd(@Optional String exam_Clsname, @Optional String exam_Secname, @Optional String exam_name, @Optional String grade )
			throws ParserConfigurationException, SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" + driver);
		Common.clickPos(driver, loginproperties, "click_school_management");
		Common.clickPos(driver, loginproperties, "navigate_ProgressCard");
		Common.clickPos(driver, loginproperties, "click_EnterMarks");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "ex_Clsname", exam_Clsname);
		Thread.sleep(2000);
		Common.clicksValue("xpath", loginproperties, "ex_Secname", exam_Secname);
		Thread.sleep(3000);
		Common.clicksValue("xpath", loginproperties, "ex_Examname", exam_name);
		Thread.sleep(5000);
		Common.sendKeysPos(driver, loginproperties, "ex_Stuname", "harish");
		Thread.sleep(7000);
		Common.clear("xpath", loginproperties, "exname_Jp");
		Common.sendKeys(driver, loginproperties, "exname_Jp", "100");
		Common.clear("xpath", loginproperties, "exname_his");
		Common.sendKeysPos(driver, loginproperties, "exname_his", "100");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties,"ex_update");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "ex_Cls");
		Thread.sleep(5000);
		Common.sendKeysPos(driver, loginproperties, "ex_Srch", "ANNUAL");
		Common.clickPos(driver, loginproperties, "publish_Bt");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "publish_Submit");
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "statistics");
		Thread.sleep(3000);
		
		//Common.click(driver, loginproperties, "stat_srch");
		Common.clicksValue("xpath", loginproperties, "grdesel", grade);
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "subjectwsereprt");
		Thread.sleep(2000);
		Common.clickScrollDown("xpath", loginproperties, "hamburgericon");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "mylev_Close");
	}	
	
	
}

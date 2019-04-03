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

public class ShuffleStudents extends Browser {

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
	public void shuffleStudents() throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" + driver);
		Common.clicksValue("xpath", loginproperties, "chngeacyr", "2018-2019");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "click_school_management");
		Common.clickPos(driver, loginproperties, "navshuffle");
		Thread.sleep(5000);
		Common.sendKeysPos(driver, loginproperties, "not_search", "Class 4");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "shufflebt");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "sec");
		Thread.sleep(1000);
		Common.clickValues("xpath", loginproperties, "selsec", "Section A");
		Thread.sleep(1000);
		Common.clicksValue("xpath", loginproperties, "mvto", "Section A");
		Common.clickPos(driver, loginproperties, "shuflesrch");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "sms");
		//Common.click(driver, loginproperties, "app");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "shufleselall");
		Thread.sleep(7000);
		Common.clickScrollDown("xpath", loginproperties, "shuflescrl");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "shuflenxt");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "shuffle");
		Thread.sleep(5000);
		

	}
}

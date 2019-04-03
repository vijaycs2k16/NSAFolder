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

public class StudentPromotion extends Browser {

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
	@Parameters({ "pmtnclss", "prmsecsel" })
	public void studentPromotion(@Optional String pmtnclss,
			@Optional String prmsecsel) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" + driver);
		Common.clickPos(driver, loginproperties, "click_school_management");
		Common.clickPos(driver, loginproperties, "student_promotion");
		Common.clickPos(driver, loginproperties, "promotionBtn");
		Thread.sleep(3000);
		Common.clicksValue("xpath", loginproperties, "prclsns", pmtnclss);
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "promot_section_dw");
		Thread.sleep(5000);
		Common.clickValues("xpath", loginproperties, "selPromot_section", prmsecsel);
		Thread.sleep(2000);
		Common.clickValues("xpath", loginproperties, "selsec", "Section A");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "shuflesrch");
		Thread.sleep(2000);
		Common.clickScrollDown("xpath", loginproperties, "prmtnscrl");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "shuflenxt");
		Thread.sleep(2000);
		Common.clickScrollDown("xpath", loginproperties, "prmtnscrl1");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "prmttnnxt");
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "promote_btn");
		Thread.sleep(5000);

	}

}

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

public class GenerateTmeTbl extends Browser {

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
	@Parameters({ "tmetblcls", "tmetblsec", "empname", "subjctname",
			"subjcttchr", "maxi_prds", "subjctname1", "subjcttchr1",
			"Class1sel", "subjctname2", "subjcttchr2", "subjctname3",
			"subjcttchr3", "maxi_prds1", "subjcttchr4", "subjctname4" })
	public void tmetblgenrte(@Optional String tmetblcls,
			@Optional String tmetblsec, @Optional String empname,
			@Optional String subjctname, @Optional String subjcttchr,
			@Optional String maxi_prds, @Optional String subjctname1,
			@Optional String subjcttchr1, @Optional String Class1sel,
			@Optional String subjctname2, @Optional String subjcttchr2,
			@Optional String subjctname3, @Optional String subjcttchr3,
			@Optional String maxi_prds1, @Optional String subjctname4,
			@Optional String subjcttchr4) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" + driver);
		Common.clickPos(driver, loginproperties, "click_school_management");
		Common.clickPos(driver, loginproperties, "click_tmetble");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "click_gentble");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "click_classtmetbl",
				tmetblcls);
		Thread.sleep(2000);
		Common.clicksValue("xpath", loginproperties, "click_sectmetble",
				tmetblsec);
		Thread.sleep(2000);
		Common.clicksValue("xpath", loginproperties, "click_emp", empname);
		Thread.sleep(2000);

		Common.clicksValue("xpath", loginproperties, "click_sub", subjctname);
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "click_subtchr",
				subjcttchr);
		Thread.sleep(5000);
		Common.sendKeysPos(driver, loginproperties, "max_prds", maxi_prds);
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "plusicon");

		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "click_sub1", subjctname1);
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "click_subtchr1",
				subjcttchr1);
		Thread.sleep(5000);
		Common.sendKeysPos(driver, loginproperties, "max_prds1", maxi_prds);
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "plusicon1");

		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "click_sub2", subjctname2);
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "click_subtchr2",
				subjcttchr2);
		Thread.sleep(5000);
		Common.sendKeysPos(driver, loginproperties, "max_prds2", maxi_prds1);
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "plusicon2");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "click_sub3", subjctname3);
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "click_subtchr3",
				subjcttchr3);
		Thread.sleep(5000);
		Common.sendKeysPos(driver, loginproperties, "max_prds3", maxi_prds1);
		Thread.sleep(5000);
		// Common.clickPos(driver, loginproperties, "ttclose");
		Common.clickPos(driver, loginproperties, "tmetbleupdate");
		Thread.sleep(5000);
		Common.sendKeysPos(driver, loginproperties, "searchtmetbl", Class1sel);
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "tmetbleedit");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "tmetbleupdate");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "generate");

	}

}

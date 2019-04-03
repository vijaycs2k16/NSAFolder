package com.nsa.testing.tests;

import java.io.IOException;
import java.util.Properties;

import javax.xml.parsers.ParserConfigurationException;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Test;
import org.xml.sax.SAXException;
import org.testng.annotations.Parameters;

import com.nsa.testing.commons.Browser;
import com.nsa.testing.commons.Common;

@Test
public class ParentInformationTest extends Browser {
	Properties properties;
	WebElement element;

	@BeforeMethod
	public void StartBrowser() throws IOException {
		properties = readData(PROP_COMMON_PROPERTIES);
	}

	@AfterMethod
	public void ClosingBrowser() {
		closeBrowser();
	}

	@Test
	@Parameters({ "srcStdName", "newMobileNo" })
	public void addEmployee(@Optional String srcStdName,
			@Optional String newMobileNo) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(5000);
		Common.clickPos(driver, properties, "click_user_manmt");
		Common.clickPos(driver, properties, "parentInfo_nav");
		Thread.sleep(7000);
		Common.clickPos(driver, properties, "clk_editicon");
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "associat_new_btn");
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "srch_std", srcStdName);
		Thread.sleep(7000);
		Common.clickPos(driver, properties, "slct_srch_ward");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "close_wardPU");
		Thread.sleep(5000);
		Common.clickPos(driver, properties, "change_mobileNo_btn");
		Thread.sleep(2000);
		Common.sendKeysPos(driver, properties, "new_mobileNo", newMobileNo);
		Thread.sleep(1000);
		/*
		 * Common.click(driver, properties, "save_number"); Thread.sleep(1000);
		 */
		Common.click(driver, properties, "close_changeNo");
		Thread.sleep(1000);
		/*
		 * Common.click(driver, properties, "change_number_yes");
		 * Thread.sleep(2000);
		 */
		Common.click(driver, properties, "close_editParent");
		Thread.sleep(1000);

	}
}
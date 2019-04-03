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
public class FeeDefaultersTest extends Browser {
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
	@Parameters({ "selClass", "selSection", "feeSelection" })
	public void createHomework(@Optional String selClass,
			@Optional String selSection, @Optional String feeSelection)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		System.out.println("selClass------------" +selClass);
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "click_school_management");
		Common.clickPos(driver, properties, "fee_Defaulters");
		Thread.sleep(5000);
		Common.clickPos(driver, properties, "class_Noneselected");
		Thread.sleep(3000);
		Common.clicksValue("xpath", properties, "select_Class", selClass);
		Thread.sleep(3000);
		Common.clicksValue("xpath", properties, "selected_Sec", selSection);
		Thread.sleep(5000);
		Common.clicksValue("xpath", properties, "fee_Name", feeSelection);
		
		Common.click(driver, properties, "search_Button");
		Thread.sleep(7000);

	}
}

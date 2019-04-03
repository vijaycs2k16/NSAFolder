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
public class FeeStructureTest extends Browser {
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
	@Parameters({ "feStrctname", "term", "selectFeetype1", "selectFeetype2", "selectFeetype3", "status",
			"feeStrtdesc" })
	public void createHomework(@Optional String feStrctname,
			@Optional String term, @Optional String selectFeetype1, 
			@Optional String selectFeetype2, @Optional String selectFeetype3,
			@Optional String status, @Optional String feeStrtdesc)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "click_school_management");
		Common.clickPos(driver, properties, "fee_Structure");
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "Fee_Struct_btn");
		Thread.sleep(5000);
		Common.sendKeysPos(driver, properties, "fee_Strct_Name", feStrctname);
		Common.clicksValue("xpath", properties, "select_Term", term);
		Common.clickPos(driver, properties, "multi_Dwfee");
		Thread.sleep(2000);
		Common.clickValues("xpath", properties, "click_Feetype_list",
				selectFeetype1);
		Thread.sleep(2000);
		Common.clickValues("xpath", properties, "click_Feetype_list",
				selectFeetype2);
		Thread.sleep(2000);
		Common.clickValues("xpath", properties, "click_Feetype_list",
				selectFeetype3);
		Common.clickPos(driver, properties, "multi_Dwfee");
		Common.clicksValue("xpath", properties, "active_Status", status);
		Thread.sleep(2000);
		Common.sendKeysPos(driver, properties, "fee_Struct_Desc", feeStrtdesc);
		Thread.sleep(2000);
		// Common.clickPos(driver, properties, "closebtn");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "savebtn"); Thread.sleep(2000);
	}
}
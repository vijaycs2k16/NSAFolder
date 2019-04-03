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
public class MyLeavesTest extends Browser {
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
	@Parameters({ "leaveName", "startDate", "endDate", "reason" })
	public void addLeaveType(@Optional String leaveName,
			@Optional String startDate, @Optional String endDate,
			@Optional String reason) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "click_user_manmt");
		Common.clickPos(driver, properties, "myLeaves_nav");
		Thread.sleep(7000);
		Common.clickPos(driver, properties, "clk_Apply_lev");
		Thread.sleep(3000);
		Common.clicksValue("xpath", properties, "slck_AssignedLeave", leaveName);
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "date_Range_dw");
		Common.sendKeysPos(driver, properties, "lev_start_date", startDate);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "lev_end_date", endDate);
		Common.clickPos(driver, properties, "lev_dateApply_btn");
		Thread.sleep(2000);
		Common.sendKeysPos(driver, properties, "lev_Reason", reason);
		/*Common.clickPos(driver, properties, "mylev_Close");*/
		Common.clickPos(driver, properties, "savebtn");
		Thread.sleep(2000);
		 
	}
}
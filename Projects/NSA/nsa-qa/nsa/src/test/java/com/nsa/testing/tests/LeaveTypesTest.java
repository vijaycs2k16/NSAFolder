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
public class LeaveTypesTest extends Browser {
	Properties properties;
	WebElement element;

	@BeforeMethod
	public void StartBrowser() throws IOException {
		properties = readData(PROP_COMMON_PROPERTIES);
	}

	
	  @AfterMethod public void ClosingBrowser() {
	  closeBrowser();
	}

	@Test
	@Parameters({"lev_TypeName", "lev_Desc", "noOfDays"})
	public void addLeaveType(@Optional String lev_TypeName, @Optional String lev_Desc, @Optional String noOfDays) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "click_user_manmt");
		Common.clickPos(driver, properties, "leav_Types");
		Common.clickPos(driver, properties, "add_LevTypes");
		Thread.sleep(3000);
		Common.sendKeysPos(driver, properties, "lev_TypeName", lev_TypeName);
		Common.sendKeysPos(driver, properties, "lev_TypeDesc", lev_Desc);
		Thread.sleep(2000);
		Common.sendKeysPos(driver, properties, "lev_Days", noOfDays);
		Thread.sleep(2000);
		//Common.clickPos(driver, properties, "lev_TypeClose");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "savebtn");
		//Thread.sleep(2000);

}
}
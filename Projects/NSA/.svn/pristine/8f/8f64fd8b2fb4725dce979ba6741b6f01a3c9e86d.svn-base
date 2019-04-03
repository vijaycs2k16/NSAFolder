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
public class DepartmentTest extends Browser {
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
	@Parameters({ "deptName", "aliseName" })
	public void createHomework(@Optional String deptName,
			@Optional String aliseName) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "click_user_manmt");
		Common.clickPos(driver, properties, "department_nav");
		Common.clickPos(driver, properties, "add_Dept_btn");
		Thread.sleep(3000);
		Common.sendKeysPos(driver, properties, "dept_Name", deptName);
		Common.sendKeysPos(driver, properties, "dept_Alias", aliseName);
		Thread.sleep(2000);
		/*
		 * Common.clickPos(driver, properties, "close_Dept"); Thread.sleep(2000);
		 */
		Common.clickPos(driver, properties, "save_Dept");
		Thread.sleep(2000);

	}
}
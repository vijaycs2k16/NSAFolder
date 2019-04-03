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
import com.nsa.testing.commons.Common;
import com.nsa.testing.pageObjects.LoginPage;

public class AttendanceHis extends Browser {

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
	@Parameters({ "selClass", "selSection" })
	public void attendanceHis(@Optional String selClass, @Optional String selSection) throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(7000);
		Common.clickPos(driver, loginproperties, "click_school_management");
		Common.clickPos(driver, loginproperties, "attendance_History");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties,"class_Noneselected");
		Thread.sleep(2000);
		Common.clicksValue("xpath", loginproperties, "select_Class", selClass);
		Thread.sleep(2000);
		Common.clicksValue("xpath", loginproperties, "selected_Sec", selSection);
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "btn_attandance_date");	
		Common.setText("xpath", loginproperties, "start_Datea", "05/01/2018");
		Thread.sleep(3000);
		Common.setText("xpath", loginproperties, "end_Datea", "07/01/2018");
		Thread.sleep(3000);
		Common.clickPos(driver, loginproperties, "date_Apply");
		Common.clickPos(driver, loginproperties,"search_Button");
		Thread.sleep(3000);
		Common.clickScrollDown("xpath", loginproperties, "attendance_scroll");
		Thread.sleep(7000);
	
	}
}

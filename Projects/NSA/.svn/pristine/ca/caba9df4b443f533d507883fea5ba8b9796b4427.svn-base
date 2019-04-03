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

public class WrittenExam extends Browser {

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
	@Parameters({ "examname", "examcode", "decsription" })
	public void writtenExam(@Optional String examname,
			@Optional String examcode, @Optional String decsription)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "click_school_management");
		Common.clickPos(driver, loginproperties, "navigate_ExamSettings");
		Thread.sleep(7000);
		Common.clickPos(driver, loginproperties, "navigate_ExamSchedule");
		Common.clickPos(driver, loginproperties, "set_DetailOfWrittenExam");
		Thread.sleep(2000);
		Common.sendKeysPos(driver, loginproperties, "set_ExamName", examname);
		Common.sendKeysPos(driver, loginproperties, "set_ExamCode", examcode);
		Common.sendKeysPos(driver, loginproperties, "set_description", decsription);
		Common.clickPos(driver, loginproperties, "save_Writtenexam");
		Thread.sleep(3000);

	}
}

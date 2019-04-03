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

public class VceMsgSch extends Browser {

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
	@Parameters({"sel_audionames", "mob_No", "audionames_sel", "navsch_name"})
	public void voicemsgsch(@Optional String sel_audionames, @Optional String mob_No,  @Optional String audionames_sel, @Optional String navsch_name )
			throws ParserConfigurationException, SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "activity_nav");
		Common.clickPos(driver, loginproperties, "navigate_VoiceMessages");
		Thread.sleep(7000);
		Common.clickValue("xpath", loginproperties, "navigate_Schedules", navsch_name);
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "click_CreateVoiceMessage");
		Thread.sleep(2000);
		Common.setText("xpath", loginproperties, "sel_audio", sel_audionames);
		Common.setText("xpath", loginproperties, "sel_Mobno", mob_No);
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "student_Name");
		Thread.sleep(3000);
		Common.clicksValue("xpath", loginproperties, "audioname_sel", audionames_sel);
		Thread.sleep(1000);
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "draft");

		Thread.sleep(5000);
	}
	
}
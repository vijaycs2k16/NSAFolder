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

public class VoiceMsgRec extends Browser {

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
	@Parameters({"navaudi_name"})
	public void voicemsrec(@Optional String navaudi_name)
			throws ParserConfigurationException, SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		LoginTest.loginSingle();
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "activity_nav");
		Common.clickPos(driver, loginproperties, "navigate_VoiceMessages");
		Thread.sleep(3000);
		Common.clickValue("xpath", loginproperties, "navigate_Audio", navaudi_name);
		Common.clickPos(driver, loginproperties, "click_AddAudio");
		Common.clickValue("xpath", loginproperties, "navigate_Audio", navaudi_name);
		Common.clickValue("xpath", loginproperties, "brwse_File", "Browse File");
		Common.clickPos(driver, loginproperties, "up_Audio");
		Thread.sleep(2000);
		Common.uploadFile("voicetest.mp3");
		Thread.sleep(5000);
		
		Common.clickPos(driver, loginproperties, "savebtn");
		Thread.sleep(5000);
		
	}
	
	}
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
	

	public class Notification extends Browser {

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
		public void createNotification() throws ParserConfigurationException, SAXException, IOException,
				InterruptedException {
			WebDriver driver = openBrowser(properties);
			LoginTest.loginSingle();
			Properties loginproperties = readData(PROP_OR_PROPERTIES);
			Thread.sleep(2000);
			Common.clickPos(driver, loginproperties, "activity_nav");
			Common.clickPos(driver, loginproperties, "notification");
			Thread.sleep(5000);
			Common.clickPos(driver, loginproperties, "create_Notification");
			Thread.sleep(5000);
			Common.sendKeysPos(driver, loginproperties, "notify_Title", "WELCOME TO  NEXSCHOOLP APP");
			Thread.sleep(5000);
			Common.clickPos(driver, loginproperties, "taxanomy_Emp");
			Thread.sleep(5000);
			Common.clickPos(driver, loginproperties, "template_Ns");
			Thread.sleep(5000);
			Common.clickPos(driver, loginproperties, "sel_Template");
			Thread.sleep(5000);
			//Common.click(driver, loginproperties, "saveas_Draft");
			Thread.sleep(5000);
			Common.clickPos(driver, loginproperties, "send");
			Thread.sleep(5000);
			
		}
	}

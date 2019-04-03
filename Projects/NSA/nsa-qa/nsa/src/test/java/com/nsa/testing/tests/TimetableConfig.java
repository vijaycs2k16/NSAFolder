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
import org.xml.sax.SAXException;

import com.nsa.testing.commons.Browser;
import com.nsa.testing.pageObjects.LoginPage;
import com.nsa.testing.commons.Common;

public class TimetableConfig extends Browser {

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
	@Parameters({ "selcls", "setprds" })
	public void tmetblconfig(@Optional String selcls, @Optional String setprds)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" + driver);
		Common.clickPos(driver, loginproperties, "click_school_management");
		Common.clickPos(driver, loginproperties, "tmtble_config");
		Thread.sleep(2000);
		Common.clickPos(driver, loginproperties, "click_newconfig");
		Thread.sleep(1000);
		Common.clickPos(driver, loginproperties, "select_dropdown");
		Thread.sleep(2000);
		Common.clickValues("xpath", loginproperties, "cls_tmtble", selcls);
		Common.clickPos(driver, loginproperties, "select_dropdown");
		Thread.sleep(2000);
		Common.setText("id", loginproperties, "start_Time", "9:00:AM");
		Thread.sleep(1000);
		Common.setText("id", loginproperties, "end_Time", "4:20:PM");
		Thread.sleep(1000);
		Common.clicksValue("xpath", loginproperties, "sel_prdns", setprds);
		Thread.sleep(2000);
		Common.clickScrollDown("xpath", loginproperties, "scrll_dwn");
		Thread.sleep(5000);
		Common.setText("xpath", loginproperties, "p1_end_time", "9:40:AM");
		Thread.sleep(1000);
		Common.setText("xpath", loginproperties, "p2_end_time", "10:30:AM");
		Thread.sleep(1000);
		Common.setText("xpath", loginproperties, "p3_end_time", "10:40:AM");
		Thread.sleep(1000);
		Common.clickPos(driver, loginproperties, "clk_isBreak1");
		Thread.sleep(2000);
		Common.setText("xpath", loginproperties, "p4_end_time", "11:20:AM");
		Thread.sleep(1000);
		Common.setText("xpath", loginproperties, "p5_end_time", "12:00:PM");
		Thread.sleep(1000);
		Common.setText("xpath", loginproperties, "p6_end_time", "1:30:PM");
		Thread.sleep(1000);
		Common.clickPos(driver, loginproperties, "clk_isBreak2");
		Thread.sleep(2000);
		Common.setText("xpath", loginproperties, "p7_end_time", "2:10:PM");
		Thread.sleep(1000);
		Common.setText("xpath", loginproperties, "p8_end_time", "2:50:PM");
		Thread.sleep(1000);
		Common.setText("xpath", loginproperties, "p9_end_time", "3:00:PM");
		Thread.sleep(1000);
		Common.clickPos(driver, loginproperties, "clk_isBreak3");
		Thread.sleep(2000);
		Common.clickScrollDown("xpath", loginproperties, "scrll_dwn");
		Thread.sleep(3000);
		Common.setText("xpath", loginproperties, "p10_end_time", "3:40:PM");
		Thread.sleep(1000);
		Common.setText("xpath", loginproperties, "p11_end_time", "4:20:PM");
		Thread.sleep(1000);
		/*Common.click(driver, loginproperties, "closebtn"); Thread.sleep(2000); */
		Common.clickPos(driver, loginproperties, "save_config");
		Thread.sleep(3000);
	}

}

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

public class ExamSchedule extends Browser {

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
	@Parameters({ "nvtabmv", "exmname", "setexmclss", "setexmsec", "selsubexm", "selsubexm1", "selsubexm2"})
	public void examschedule (@Optional String nvtabmv, @Optional String exmname, @Optional String setexmclss, @Optional String setexmsec, @Optional String selsubexm, @Optional String selsubexm1, @Optional String selsubexm2)
			throws ParserConfigurationException, SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" + driver);
		
		Common.click(driver, loginproperties, "click_school_management");
		Common.click(driver, loginproperties, "navigate_ExamSettings");
		Common.click(driver, loginproperties, "navigate_ExamSchedule");
		Common.clickValue("xpath", loginproperties, "nvtabsch", nvtabmv);
		Thread.sleep(5000);
		Common.click(driver, loginproperties, "click_ScheduleExam");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "selexm", exmname);
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "setexmsel_cls",setexmclss);
		Common.click(driver, loginproperties, "setexmsecns");
		Common.clickValues("xpath", loginproperties, "setexmulsec", setexmsec);
		Thread.sleep(2000);
		Common.clicksValue("xpath", loginproperties, "setsubexm", selsubexm);
		Thread.sleep(7000);
		Common.clear("xpath", loginproperties, "setdt");
		Thread.sleep(2000);
		Common.setDate("xpath", loginproperties, "setdt", "03-Jun-2018");
		Thread.sleep(8000);
		Common.setText("id", loginproperties, "setsrttme", "9:00:AM");
		Common.clear("id", loginproperties, "setendtme");
		Thread.sleep(8000);
		Common.setText("id", loginproperties, "setendtme", "12:00:PM");
		Thread.sleep(8000);	
		Common.clear("id", loginproperties, "setmrk");	
		Common.setText("xpath", loginproperties, "setmrk", "100");
		Thread.sleep(7000);
		Common.click(driver, loginproperties, "nxtexam");
		Thread.sleep(7000);
		
		Common.clicksValue("xpath", loginproperties, "setsubexm1", selsubexm1);
		Thread.sleep(7000);
		Common.clear("xpath", loginproperties, "setdt1");
		Common.setDate("xpath", loginproperties, "setdt1", "04-Jun-2018");
		Thread.sleep(8000);
		Common.clear("xpath", loginproperties, "setsrttme1");
		Thread.sleep(8000);
		Common.setText("id", loginproperties, "setsrttme1", "9:00:AM");
		Common.clear("id", loginproperties, "setendtme1");
		Thread.sleep(8000);
		Common.setText("id", loginproperties, "setendtme1", "12:00:PM");
		Thread.sleep(8000);
		Common.clear("id", loginproperties, "setmrk");	
		Common.setText("xpath", loginproperties, "setmrk", "100");
		Common.click(driver, loginproperties, "tabswitchptns");
		Common.sendKeys(driver, loginproperties, "desc", "ALL CHAPTER MUST BE COMPLETED");
		Thread.sleep(4000);
		Common.click(driver, loginproperties, "portionupload");
		Common.uploadFile("sampledoc.doc");
		Thread.sleep(5000);
		Common.click(driver, loginproperties, "portionupload");
		Common.uploadFile("samplepdf.pdf");
		Thread.sleep(5000);
		Common.clickScrollDown("xpath", loginproperties, "portionscrl");
		Thread.sleep(5000);
		//Common.click(driver, loginproperties, "exmsvdft");
		//Thread.sleep(2000);
		//Common.click(driver, loginproperties, "editexam");

		Common.click(driver, loginproperties, "publish");
		
	}
}
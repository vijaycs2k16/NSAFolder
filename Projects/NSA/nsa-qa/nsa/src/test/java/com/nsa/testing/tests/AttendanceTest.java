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

public class AttendanceTest extends Browser {

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
	public void allPresent() throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" +driver);
		Common.clickPos(driver, loginproperties, "school_management");
		Common.clickPos(driver, loginproperties, "attendance_information");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "record_Attendance");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "sele_Class", "Class 1");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "select_Section", "Section A");
		Thread.sleep(5000);
		Common.setDate("xpath", loginproperties, "select_Date", "07-Jun-2018");
		Common.clickPos(driver, loginproperties, "search_Btn");
		Common.clickScrollDown("xpath", loginproperties, "attscrl1");
		Thread.sleep(2000);
		//Common.clickPos(driver, loginproperties, "present");
		Common.clickPos(driver, loginproperties, "sav_atten");
		Thread.sleep(2000);
	}
	/*@Test
	
	public void aabsent() throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" +driver);
		Common.clickPos(driver, loginproperties, "school_management");
		Common.clickPos(driver, loginproperties, "attendance_information");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "record_Attendance");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "sele_Class", "Class 2");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "select_Section", "Section A");
		Thread.sleep(5000);
		Common.setDate("xpath", loginproperties, "sel_Date2", "28-May-2018");
		Common.clickPos(driver, loginproperties, "search_Btn");
		Common.clickPos(driver, loginproperties, "student1");
		Common.clickPos(driver, loginproperties, "student2");
		Common.clickPos(driver, loginproperties, "student3");
		Common.clickPos(driver, loginproperties, "student4");
		Common.clickScrollDown("xpath", loginproperties, "attscrl1");
		Common.clickPos(driver, loginproperties, "student5");
		Common.clickPos(driver, loginproperties, "student6");
		Common.clickScrollDown("xpath", loginproperties, "attscrl");
		
		Common.clickPos(driver, loginproperties, "present");
		//Common.clickPos(driver, loginproperties, "sav_atten");
		
	}	
		
	@Test
	public void pre() throws ParserConfigurationException, SAXException, IOException,
	InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" +driver);
		Common.clickPos(driver, loginproperties, "school_management");
		Common.clickPos(driver, loginproperties, "attendance_information");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "record_Attendance");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "sele_Class", "Class 3");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "select_Section", "Section A");
		Thread.sleep(5000);
		Common.setDate("xpath", loginproperties, "sel_Date2", "31-May-2018");
		Common.clickPos(driver, loginproperties, "search_Btn");
		Common.clickScrollDown("xpath", loginproperties, "attscrl");
		Common.clickPos(driver, loginproperties, "present");
		Common.clickPos(driver, loginproperties, "absent");
		Common.clickPos(driver, loginproperties, "sav_atten");
			}
	@Test
	public void abs() throws ParserConfigurationException, SAXException, IOException,
	InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		
		Common.clickPos(driver, loginproperties, "school_management");
		Common.clickPos(driver, loginproperties, "attendance_information");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "record_Attendance");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "sele_Class", "Class 4");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "select_Section", "Section A");
		Thread.sleep(5000);
		Common.setDate("xpath", loginproperties, "sel_Date2", "31-May-2018");
		Common.clickPos(driver, loginproperties, "search_Btn");
		
		Common.clickPos(driver, loginproperties, "student1");
		Common.clickPos(driver, loginproperties, "student2");
		Common.clickPos(driver, loginproperties, "student3");
		Common.clickPos(driver, loginproperties, "student4");
		Common.clickScrollDown("xpath", loginproperties, "attscrl1");
		Common.clickPos(driver, loginproperties, "student5");
		Common.clickPos(driver, loginproperties, "student6");
		Common.clickScrollDown("xpath", loginproperties, "attscrl");
		Common.clickPos(driver, loginproperties, "sav_atten");
		
			}
	
	@Test
	public void presnotifyabs() throws ParserConfigurationException, SAXException, IOException,
	InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" +driver);
		Common.clickPos(driver, loginproperties, "school_management");
		Common.clickPos(driver, loginproperties, "attendance_information");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "record_Attendance");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "sele_Class", "Class 5");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "select_Section", "Section A");
		Thread.sleep(5000);
		Common.setDate("xpath", loginproperties, "sel_Date2", "31-May-2018");
		Common.clickPos(driver, loginproperties, "search_Btn");
		Common.clickScrollDown("xpath", loginproperties, "attscrl");
		Common.clickPos(driver, loginproperties, "sav_atten");
		
	}
	@Test
	public void absnotifypre() throws ParserConfigurationException, SAXException, IOException,
	InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" +driver);
		Common.clickPos(driver, loginproperties, "school_management");
		Common.clickPos(driver, loginproperties, "attendance_information");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "record_Attendance");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "sele_Class", "L.K.G");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "select_Section", "Section A");
		Thread.sleep(5000);
		Common.setDate("xpath", loginproperties, "sel_Date2", "31-May-2018");
		Common.clickPos(driver, loginproperties, "search_Btn");
		Common.clickPos(driver, loginproperties, "student1");
		Common.clickPos(driver, loginproperties, "student2");
		Common.clickPos(driver, loginproperties, "student3");
		Common.clickPos(driver, loginproperties, "student4");
		Common.clickScrollDown("xpath", loginproperties, "attscrl1");
		Common.clickPos(driver, loginproperties, "student5");
		Common.clickPos(driver, loginproperties, "student6");
		Common.clickScrollDown("xpath", loginproperties, "attscrl");
		Common.clickPos(driver, loginproperties, "present");
		Common.clickPos(driver, loginproperties, "absent");
		Common.clickPos(driver, loginproperties, "sav_atten");
		}
	@Test
	public void notifynone() throws ParserConfigurationException, SAXException, IOException,
	InterruptedException {
		WebDriver driver = openBrowser(properties);
		LoginTest.loginSingle();
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss" +driver);
		Common.clickPos(driver, loginproperties, "school_management");
		Common.clickPos(driver, loginproperties, "attendance_information");
		Thread.sleep(5000);
		Common.clickPos(driver, loginproperties, "record_Attendance");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "sele_Class", "U.K.G");
		Thread.sleep(5000);
		Common.clicksValue("xpath", loginproperties, "select_Section", "Section A");
		Thread.sleep(5000);
		Common.setDate("xpath", loginproperties, "sel_Date2", "31-May-2018");
		Common.clickPos(driver, loginproperties, "search_Btn");
		Common.clickPos(driver, loginproperties, "student1");
		Common.clickPos(driver, loginproperties, "student2");
		Common.clickScrollDown("xpath", loginproperties, "attscrl1");
		Common.clickPos(driver, loginproperties, "present");
		Common.clickPos(driver, loginproperties, "absent");
		Common.clickPos(driver, loginproperties, "sms");
		Common.clickPos(driver, loginproperties, "app");
		Common.clickPos(driver, loginproperties, "sav_atten");
		
		}
*/	
}

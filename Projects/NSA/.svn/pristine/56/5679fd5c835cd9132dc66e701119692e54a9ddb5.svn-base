package com.nsa.testing.tests;

import java.io.File;
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
public class AssignFeeTest extends Browser {
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
	@Parameters({"feeName", "langName", "status", "feeAmt" })
	public void createHomework(
			@Optional String feeName, @Optional String langName,
			@Optional String feeAmt, @Optional String dueDate)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
	/*	 File file = new File("E:/nsa1/nsa/src/main/resources/xml");
	        File[] files = file.listFiles();
	        for(File f: files){
	        	String filePath = "<suite-file path=" + "'src/main/resources/xml/" + f.getName() + "' />";
	        	filePath = filePath.replace('\'', '\"');
	            System.out.println(filePath);
	        }*/
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "click_school_management");
		Common.clickPos(driver, properties, "assin_Fees");
		Thread.sleep(7000);
		Common.clickPos(driver, properties, "add_Fees_btn");
		Thread.sleep(2000);
		Common.clicksValue("xpath", properties, "select_fee", feeName);
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "lang_dw");
		Thread.sleep(1000);
		Common.clickValues("xpath", properties, "select_Ben_lang", langName);
		Thread.sleep(1000);
		Common.clickPos(driver, properties, "lang_dw");
		Common.clickPos(driver, properties, "select_class");
		Thread.sleep(2000);
		Common.sendKeysPos(driver, properties, "fee_amtbox1", "1000");
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "fee_amtbox2", "2000");
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "fee_amtbox3", "500");
		Thread.sleep(1000);
		Common.clickPos(driver, properties, "due_Date");
		Thread.sleep(2000);
		Common.clickScrollDown("xpath", properties, "click_ScrollDown");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "saveFee");
		Thread.sleep(7000);
		Common.clickPos(driver, properties, "add_Scholrsp_btn");
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "eligbl_Student_dw");
		Thread.sleep(3000);
		Common.clickValues("xpath", properties, "select_Student", "Dhivya");
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "eligbl_Student_dw");
		Thread.sleep(5000);
		Common.clickPos(driver, properties, "scholrsp_Name_dw");
		Thread.sleep(2000);
		Common.clickValues("xpath", properties, "select_Scholarship", "Student Scholarship");
		Thread.sleep(2000);
		Common.sendKeysPos(driver, properties, "discount_Name", "Automation Test Discount");
		Thread.sleep(2000);
		Common.sendKeysPos(driver, properties, "discount_Amt", "500");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "save_Scholarship");
		Thread.sleep(9000);
	}
}
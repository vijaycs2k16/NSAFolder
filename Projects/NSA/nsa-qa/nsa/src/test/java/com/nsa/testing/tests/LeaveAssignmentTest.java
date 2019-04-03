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
public class LeaveAssignmentTest extends Browser {
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
	@Parameters({ "DeptName", "ReportManagerName", "selectEmpName" })
	public void addLeaveType(@Optional String DeptName,
			@Optional String ReportManagerName, @Optional String selectEmpName)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(5000);
		Common.clickPos(driver, properties, "click_user_manmt");
		Common.clickPos(driver, properties, "leave_Assignment_Nav");
		Common.clickPos(driver, properties, "assin_leaves_btn");
		Thread.sleep(3000);
		Common.clicksValue("xpath", properties, "select_Dept", DeptName);
		Thread.sleep(2000);
		Common.clicksValue("xpath", properties, "select_Reptng_manager",
				ReportManagerName);
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "clk_emp_dw");
		Common.clickValues("xpath", properties, "select_Emp", selectEmpName);
		Common.clickPos(driver, properties, "clk_emp_dw");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "click_Search");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "check_LeaveType");
		Thread.sleep(2000);
		//Common.clickPos(driver, properties, "leave_Assign_close");
		Thread.sleep(2000);
		
		 Common.clickPos(driver, properties, "savebtn"); 
		 //Thread.sleep(2000);
		 
	}
}
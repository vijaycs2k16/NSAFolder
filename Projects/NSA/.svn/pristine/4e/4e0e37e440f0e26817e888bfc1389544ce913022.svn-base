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
public class EmployeeTest extends Browser {
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
	@Parameters({ "fName", "mName", "lName", "shortName", "empDob",
			"empGender", "empNation", "empDept", "empDesign", "empUserCode",
			"empDoJ", "empEmail", "empPhone", "empPassword" })
	public void addEmployee(@Optional String fName, @Optional String mName,
			@Optional String lName, @Optional String shortName,
			@Optional String empDob, @Optional String empGender,
			@Optional String empNation, @Optional String empDept,
			@Optional String empDesign, @Optional String empUserCode,
			@Optional String empDoJ, @Optional String empEmail,
			@Optional String empPhone, @Optional String empPassword)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "click_user_manmt");
		Common.clickPos(driver, properties, "employee_Nav");
		Thread.sleep(7000);
		Common.clickPos(driver, properties, "add_Employee_btn");
		Thread.sleep(3000);
		Common.sendKeysPos(driver, properties, "emp_FName", fName);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "emp_MName", mName);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "emp_LName", lName);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "short_Name", shortName);
		Thread.sleep(1000);
		Common.setDate("xpath", properties, "emp_Dob", empDob);
		Thread.sleep(1000);
		Common.clicksValue("xpath", properties, "emp_Gender", empGender);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "emp_Nationality", empNation);
		Thread.sleep(1000);
		Common.clickPos(driver, properties, "emp_Dept");
		Thread.sleep(1000);
		Common.clicksValue("xpath", properties, "select_Design", "Clerk");
		Thread.sleep(3000);
		Common.sendKeysPos(driver, properties, "emp_User_Code", empUserCode);
		Common.setDate("xpath", properties, "emp_DoJ", empDoJ);
		Common.sendKeysPos(driver, properties, "emp_Email", empEmail);
		Common.sendKeysPos(driver, properties, "emp_Phone", empPhone);
		Common.sendKeysPos(driver, properties, "emp_Password", empPassword);
		Thread.sleep(3000);
		/*
		 * Common.clickPos(driver, properties, "emp_close"); Thread.sleep(2000);
		 */
		Common.clickPos(driver, properties, "close_Desig");
		Thread.sleep(2000);
		/*
		 * Common.clickPos(driver, properties, "savebtn"); Thread.sleep(2000);
		 */
	}
}
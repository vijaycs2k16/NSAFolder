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
public class StudentTest extends Browser {
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
	@Parameters({ "fName", "mName", "lName", "shortName", "stdStay",
			"stdGender", "motherTong", "stdComty", "stNation", "stdDoB",
			"stdPoB", "stdAdminNo", "stdAdminDate", "stdPwsd", "stdClass",
			"stdSection", "lang1", "lang2", "lang3", "fatherName",
			"fatherPhone", "motherName", "motherPhone" })
	public void addStudent(@Optional String fName, @Optional String mName,
			@Optional String lName, @Optional String shortName,
			@Optional String stdStay, @Optional String stdGender,
			@Optional String motherTong, @Optional String stdComty,
			@Optional String stNation, @Optional String stdDoB,
			@Optional String stdPoB, @Optional String stdAdminNo,
			@Optional String stdAdminDate, @Optional String stdPwsd,
			@Optional String stdClass, @Optional String stdSection,
			@Optional String lang1, @Optional String lang2,
			@Optional String lang3, @Optional String fatherName,
			@Optional String fatherPhone, @Optional String motherName,
			@Optional String motherPhone) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "click_user_manmt");
		Common.clickPos(driver, properties, "student_Nav");
		Thread.sleep(7000);
		Common.clickPos(driver, properties, "add_Std_btn");
		Thread.sleep(3000);
		Common.sendKeysPos(driver, properties, "std_Fname", fName);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Mname", mName);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Lname", lName);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Shortname", shortName);
		Thread.sleep(1000);
		Common.clicksValue("xpath", properties, "std_Stay", stdStay);
		Thread.sleep(1000);
		Common.clicksValue("xpath", properties, "std_Gender", stdGender);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Mothertg", motherTong);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Community", stdComty);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Nationality", stNation);
		Thread.sleep(1000);
		Common.setDate("xpath", properties, "std_DoB", stdDoB);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_PoB", stdPoB);
		Thread.sleep(1000);
		Common.clickPos(driver, properties, "std_TransReq");
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Admn_No", stdAdminNo);
		Thread.sleep(1000);
		Common.setDate("xpath", properties, "std_Admn_Date", stdAdminDate);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Pwsd", stdPwsd);
		Thread.sleep(1000);
		Common.clickScrollDown("xpath", properties, "std_Pwsd");
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "std_Next_btn");
		Thread.sleep(2000);
		Common.clicksValue("xpath", properties, "slct_Class", stdClass);
		Thread.sleep(1000);
		Common.clicksValue("xpath", properties, "slct_Section", stdSection);
		Thread.sleep(1000);
		Common.clicksValue("xpath", properties, "slct_Lang1", lang1);
		Thread.sleep(1000);
		Common.clicksValue("xpath", properties, "slct_Lang2", lang2);
		Thread.sleep(1000);
		Common.clicksValue("xpath", properties, "slct_Lang3", lang3);
		Thread.sleep(1000);
		Common.clickPos(driver, properties, "std_Next_btn");
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Father_Name", fatherName);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Father_Phone", fatherPhone);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Mother_name", motherName);
		Thread.sleep(1000);
		Common.sendKeysPos(driver, properties, "std_Mother_Phone", motherPhone);
		Thread.sleep(1000);
		Common.clickPos(driver, properties, "std_Next_btn");
		Common.clickPos(driver, properties, "clk_check_SasFather");
		Thread.sleep(1000);
		Common.clickPos(driver, properties, "clk_check_SasMother");
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "std_Next_btn");
		Thread.sleep(1000);
		Common.clickPos(driver, properties, "upload_Profile");
		Common.uploadFile("flower.jpg");
		Thread.sleep(1000);
		Common.clickPos(driver, properties, "upload_Attach");
		Common.uploadFile("bird.jpg");
		Thread.sleep(3000);
		// Common.click(driver, properties, "std_Close");
		Common.clickScrollDown("xpath", properties, "upload_Attach");
		Common.clickPos(driver, properties, "promote_btn");
		Thread.sleep(2000);

	}
}
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

public class LoginTest extends Browser {

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
	@Parameters({ "validusername", "validpassword" })
	public void loginWithCorrectMobileNumberAndCorrectPassword(
			@Optional String validusername, @Optional String validpassword)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		System.out.println("sucesss");
		LoginPage.loginMobileNumberTxtbox(driver, loginproperties).sendKeys(
				validusername);
		LoginPage.passwordTxtbox(driver, loginproperties).sendKeys(validpassword);
		LoginPage.loginNow(driver, loginproperties).click();
		Thread.sleep(2000);
	}

	
/*	@Test
	@Parameters({ "Invalidusername", "validpassword" })
	public void loginWithInCorrectMobileNumberAndCorrectPassword(
			@Optional String Invalidusername, @Optional String validpassword)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		RegisterPage.regPopupClose(driver, loginproperties).click();
		Thread.sleep(2000);
		WebElement value = LoginPage.loginTxtClick(driver, loginproperties);

		value.click();
		LoginPage.loginMobileNumberTxtbox(driver, loginproperties).sendKeys(
				Invalidusername);
		LoginPage.passwordTxtbox(driver, loginproperties).sendKeys(validpassword);
		LoginPage.loginNow(driver, loginproperties).click();
		Thread.sleep(1000);
		String Actualtext = driver.findElement(
				By.xpath(loginproperties.getProperty("InvalidPassword_txt")))
				.getText();
		System.out.println(Actualtext);
		String ExceptedText = "Invalid Username And Password";
		Assert.assertEquals(Actualtext.equalsIgnoreCase(ExceptedText),
				ExceptedText.equalsIgnoreCase(Actualtext));
		Reporter.log("ExceptedText : " + ExceptedText + "Actualtext : "
				+ Actualtext);
		Thread.sleep(2000);}

	@Test
	@Parameters({ "validusername", "Invalidpassword" })
	public void loginWithCorrectMobileNumberAndInCorrectPassword(
			@Optional String validusername, @Optional String Invalidpassword)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		RegisterPage.regPopupClose(driver, loginproperties).click();
		Thread.sleep(2000);
		WebElement value = LoginPage.loginTxtClick(driver, loginproperties);

		value.click();
		LoginPage.loginMobileNumberTxtbox(driver, loginproperties).sendKeys(
				validusername);
		LoginPage.passwordTxtbox(driver, loginproperties).sendKeys(
				Invalidpassword);
		LoginPage.loginNow(driver, loginproperties).click();
		String Actualtext = driver.findElement(
				By.xpath(loginproperties.getProperty("InvalidPassword_txt")))
				.getText();
		System.out.println(Actualtext);
		String ExceptedText = "Invalid Username And Password";
		Assert.assertEquals(Actualtext.equalsIgnoreCase(ExceptedText),
				ExceptedText.equalsIgnoreCase(Actualtext));
		Reporter.log("ExceptedText:" + ExceptedText + "Actualtext:"
				+ Actualtext);
	}

	@Test
	@Parameters({ "Invalidusername", "Invalidpassword" })
	public void loginWithMobileNumberStartingWithZeroAndCorrectPassword(
			@Optional String Invalidusername,
			@Optional String Invalidpassword) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		RegisterPage.regPopupClose(driver, loginproperties).click();
		Thread.sleep(2000);
		WebElement value = LoginPage.loginTxtClick(driver, loginproperties);

		value.click();
		LoginPage.loginMobileNumberTxtbox(driver, loginproperties).sendKeys(
				Invalidusername);
		LoginPage.passwordTxtbox(driver, loginproperties).sendKeys(Invalidpassword);
		LoginPage.loginNow(driver, loginproperties).click();
		String Actualtext = driver.findElement(
				By.xpath(loginproperties.getProperty("InvalidPassword_txt")))
				.getText();
		System.out.println(Actualtext);
		String ExceptedText = "Invalid Username And Password";
		Assert.assertEquals(Actualtext.equalsIgnoreCase(ExceptedText),
				ExceptedText.equalsIgnoreCase(Actualtext));
		Reporter.log("ExceptedText:" + ExceptedText + "Actualtext:"
				+ Actualtext);
	}

	@Test
	@Parameters({ "emptyusername", "validpassword" })
	public void loginWithMobileNumberIncludingCharacterAndCorrectPassword(
			@Optional String emptyusername,
			@Optional String validpassword) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		/*RegisterPage.regPopupClose(driver, loginproperties).click();
		Thread.sleep(2000);
		WebElement value = LoginPage.loginTxtClick(driver, loginproperties);

		value.click();
		LoginPage.loginMobileNumberTxtbox(driver, loginproperties).sendKeys(
				emptyusername);
		LoginPage.passwordTxtbox(driver, loginproperties).sendKeys(validpassword);
		LoginPage.loginNow(driver, loginproperties).click();
		String Actualtext = driver.findElement(
				By.xpath(loginproperties.getProperty("InvalidPassword_txt")))
				.getText();
		System.out.println(Actualtext);
		String ExceptedText = "Invalid Username And Password";
		Assert.assertEquals(Actualtext.equalsIgnoreCase(ExceptedText),
				ExceptedText.equalsIgnoreCase(Actualtext));
		Reporter.log("ExceptedText:" + ExceptedText + "Actualtext:"
				+ Actualtext);
	}

/*@Test
	@Parameters({ "validusername", "emptypassword" })
	public void loginWithMobileNumberincludingSymbolAndCorrectPassword(
			@Optional String validusername,
			@Optional String emptypassword) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		RegisterPage.regPopupClose(driver, loginproperties).click();
		Thread.sleep(2000);
		WebElement value = LoginPage.loginTxtClick(driver, loginproperties);
		value.click();
		LoginPage.loginMobileNumberTxtbox(driver, loginproperties).sendKeys(
				validusername);
		LoginPage.passwordTxtbox(driver, loginproperties).sendKeys(emptypassword);
		LoginPage.loginNow(driver, loginproperties).click();
		String Actualtext = driver.findElement(
				By.xpath(loginproperties.getProperty("InvalidPassword_txt")))
				.getText();
		System.out.println(Actualtext);
		String ExceptedText = "Invalid Username And Password";
		Assert.assertEquals(Actualtext.equalsIgnoreCase(ExceptedText),
				ExceptedText.equalsIgnoreCase(Actualtext));
		Reporter.log("ExceptedText:" + ExceptedText + "Actualtext:"
				+ Actualtext);
	}

	@Test
	@Parameters({ "emptyusername", "emptypassword" })
	public void loginWithMobileNumberLessThanTenDigitsAndCorrectPassword(
			@Optional String emptyusername,
			@Optional String emptypassword) throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties loginproperties = readData(PROP_OR_PROPERTIES);
		RegisterPage.regPopupClose(driver, loginproperties).click();
		Thread.sleep(2000);
		WebElement value = LoginPage.loginTxtClick(driver, loginproperties);

		value.click();
		LoginPage.loginMobileNumberTxtbox(driver, loginproperties).sendKeys(
				emptyusername);
		LoginPage.passwordTxtbox(driver, loginproperties).sendKeys(emptypassword);
		LoginPage.loginNow(driver, loginproperties).click();
		String Actualtext = driver.findElement(
				By.xpath(loginproperties.getProperty("InvalidPassword_txt")))
				.getText();
		System.out.println(Actualtext);
		String ExceptedText = "Invalid Username And Password";
		Assert.assertEquals(Actualtext.equalsIgnoreCase(ExceptedText),
				ExceptedText.equalsIgnoreCase(Actualtext));
		Reporter.log("ExceptedText:" + ExceptedText + "Actualtext:"
				+ Actualtext);
	}*/
	public static void loginSingle() throws ParserConfigurationException,
			SAXException, IOException, InterruptedException {

		Properties properties = readData(PROP_OR_PROPERTIES);
		Document document = readFileName(PATH_URL_SINGLEUSER_LOGIN);
		String username = document.getElementsByTagName("user").item(0)
				.getTextContent();
		String password = document.getElementsByTagName("pass").item(0)
				.getTextContent();
		LoginPage.loginMobileNumberTxtbox(driver, properties)
				.sendKeys(username);
		LoginPage.passwordTxtbox(driver, properties).sendKeys(password);
		LoginPage.loginNow(driver, properties).click();
	}
}

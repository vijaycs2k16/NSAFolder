package com.nsa.testing.pageObjects;

import java.io.IOException;
import java.util.Properties;

import javax.xml.parsers.ParserConfigurationException;

import org.jfree.util.Log;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.xml.sax.SAXException;

import com.nsa.testing.commons.Browser;
import com.nsa.testing.commons.Constants;

public class LoginPage extends Browser implements Constants {

	private static WebElement element;
	static String pass;
	static String user;

	public static WebElement loginTxtClick(WebDriver driver,
			Properties pathValue) throws ParserConfigurationException,
			SAXException, IOException {
		element = driver.findElement(By.xpath(pathValue
				.getProperty("login_text_click")));

		return element;

	}

	public static WebElement loginMobileNumberTxtbox(WebDriver driver,
			Properties pathValue) throws ParserConfigurationException,
			SAXException, IOException {
		System.out.println("sucess in");
		element = driver.findElement(By.xpath(pathValue
				.getProperty("login_mobilenumber")));
		System.out.println("sucess in" + element);
		return element;

	}

	public static WebElement passwordTxtbox(WebDriver driver,
			Properties pathValue) throws ParserConfigurationException,
			SAXException, IOException {
		element = driver.findElement(By.xpath(pathValue
				.getProperty("login_password")));

		return element;

	}

	public static WebElement loginNow(WebDriver driver, Properties pathValue)
			throws ParserConfigurationException, SAXException, IOException {
		element = driver.findElement(By.xpath(pathValue
				.getProperty("login_btn_click")));

		return element;

	}

	public static WebElement loginPopupClose(WebDriver driver,
			Properties pathValue) throws ParserConfigurationException,
			SAXException, IOException {
		element = driver.findElement(By.xpath(pathValue
				.getProperty("login_popup_close")));

		return element;

	}

	public static void clicksValue(WebDriver driver, Properties pathValue,
			String prty, String testData) {
		try {
			JavascriptExecutor jse = (JavascriptExecutor) driver;
			System.out.println("testData------------"+testData);
			WebElement we = driver.findElement(By.xpath(prty));
			System.out.println("testData------------"+we);
			String text = jse.executeScript(
					"return arguments[0].getAttribute(\"class\");", we)
					.toString();
			jse.executeScript("arguments[0].removeAttribute(\"class\");", we);
			Select select = new Select(we);
			// System.out.println("testData------------"+testData);
			select.selectByVisibleText(testData);
			jse.executeScript("arguments[0].setAttribute(\"class\",\"" + text
					+ "\");", we);

		} catch (Exception e) {
			Log.error(e);
		}
	}

}

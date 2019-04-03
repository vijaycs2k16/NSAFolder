package com.nsa.testing.commons;

import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.io.IOException;
import java.util.List;
import java.util.Properties;

import javax.xml.parsers.ParserConfigurationException;

import org.jfree.util.Log;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.Select;
import org.xml.sax.SAXException;

import com.nsa.testing.commons.Browser;
import com.nsa.testing.commons.Constants;

public class Common extends Browser implements Constants {

	private static WebElement element;
	static String pass;
	static String user;

	public static WebElement click(WebDriver driver, Properties pathValue,
			String xpath) throws ParserConfigurationException, SAXException,
			IOException {
		try {
			Actions mouseOver = new Actions(driver);
			element = driver.findElement(By.xpath(pathValue.getProperty(xpath)));
			System.out.println("element"+element);
			mouseOver.moveToElement(element).click().build().perform();
			System.out.println("perd"+element);
		} catch (Exception e) {
			System.out.println("eror......................."+e);
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return element;
	}
	
	public static void clickPos(WebDriver driver, Properties pathValue,
			String xpath) throws ParserConfigurationException, SAXException,
			IOException {
		try {
			Actions mouseOver = new Actions(driver);
			element = driver.findElement(By.xpath(pathValue.getProperty(xpath)));
			System.out.println("element"+element);
			mouseOver.moveToElement(element).click().build().perform();
			System.out.println("perd"+element);
		} catch (Exception e) {
			System.out.println("eror......................."+e);
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static WebElement sendKeys(WebDriver driver, Properties pathValue,
			String xpath, String value) throws ParserConfigurationException,
			SAXException, IOException {
		try {
			Actions mouseOver = new Actions(driver);
			element = driver.findElement(By.xpath(pathValue.getProperty(xpath)));
			System.out.println("sendKeysPos"+element);
			mouseOver.moveToElement(element).sendKeys(value);
			System.out.println("sendKeysPos"+element);
		} catch (Exception e) {
			System.out.println("eror......................."+e);
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return element;
	}
	
	public static void sendKeysPos(WebDriver driver, Properties pathValue,
			String xpath, String value) throws ParserConfigurationException,
			SAXException, IOException {
		try {
			Actions mouseOver = new Actions(driver);
			element = driver.findElement(By.xpath(pathValue.getProperty(xpath)));
			System.out.println("sendKeysPos"+element);
			mouseOver.moveToElement(element).sendKeys(value);
			System.out.println("sendKeysPos"+element);
		} catch (Exception e) {
			System.out.println("eror......................."+e);
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public static WebElement getWebElement(WebDriver driver,
			Properties pathValue, String xpath)
			throws ParserConfigurationException, SAXException, IOException {
		element = driver.findElement(By.xpath(pathValue.getProperty(xpath)));
		return element;

	}

	public static void clickValues(String loc, Properties pathvalue,
			String prty, String testData) {
		WebElement clkElments = null;
		try {
			Actions mouseOver = new Actions(driver);
			
			clkElments = selectMutipleValue(loc, pathvalue.getProperty(prty),
					testData);
			mouseOver.moveToElement(clkElments).click().build().perform();
			
		} catch (Exception e) {
			System.out.println("error"+e);
			Log.error(e);
		}
	}

	public static void clickValue(String loc, Properties pathvalue,
			String prty, String testData) {
		WebElement clkElment = null;
		try {
			Actions mouseOver = new Actions(driver);
			clkElment = selectSingleValue(loc, pathvalue.getProperty(prty),
					testData);
			mouseOver.moveToElement(clkElment).click().build().perform();
			System.out.println("perd"+element);
		} catch (Exception e) {
			System.out.println("SMS Clicked"+e);
			Log.error(e);
			
		}
	}

	public static WebElement selectSingleValue(String loc, String prty,
			String testData) {
		WebElement we = null;
		List<WebElement> elementList = null;
		try {
			elementList = getWebElements(loc, prty);
			 System.out.println("Count of Element List - " +
		 elementList.size());
			for (int i = 0; i < elementList.size(); i++) {
				String elementListValue = elementList.get(i).getText();
				 System.out.println("Value List " + i + " - "
				 +elementListValue);
				System.out.println("Test Data - " + testData);
				if (elementListValue.contains(testData)) {
					int value = i;
					// System.out.println("value - " + value);
					// elementList.get(value).click();
					we = elementList.get(value);
					// we.click();
					// System.out.println(testData +
					// " has been checked successfully using " + loc +
					// " locator");
					break;
				} else {
					System.out.println(testData
							+ " has not been checked successfully using " + loc
							+ "locator");
				}
			}
		} catch (Exception e) {
			Log.error(e);
		}

		return we;
	}

	public static List<WebElement> getWebElements(String loc, String prty) {
		List<WebElement> webElements = null;
		try {
			if (loc.equals("id")) {
				webElements = driver.findElements(By.id(prty));
			}
			if (loc.equals("xpath")) {
				webElements = driver.findElements(By.xpath(prty));
			}
			if (loc.equals("linkText")) {
				webElements = driver.findElements(By.linkText(prty));
			}
		} catch (Exception e) {
			Log.error(e);
		}
		return webElements;
	}

	public static WebElement selectMutipleValue(String loc, String prty,
			String testData) {
		WebElement we = null;
		List<WebElement> elementList = null;
		try {
			System.out.println("Values of drop down - " + prty + loc);
			elementList = getListOfWebElement(loc, prty);
			System.out.println("Values of drop down - " + elementList);
			for (int i = 0; i < elementList.size(); i++) {
				String elementListValue = elementList.get(i).getText();
				 System.out.println("Value List : " + i + " - "
				 +elementList.get(i));
				System.out.println("Test Data - " + testData);
				if (elementListValue.contains(testData)) {
					int value = i;
					System.out.println("value - " + value);
					// elementList.get(value).click();
					we = elementList.get(value);
					// we.click();
					System.out.println(testData
							+ " has been checked successfully using " + loc
							+ " locator");
					break;
				} else {
					System.out.println(testData
							+ " has not been checked successfully using " + loc
							+ "locator");
				}
			}
		} catch (Exception e) {
			Log.error(e);
		}
		return we;
	}

	public static void unCheckValue(String loc, Properties pathValue, String prty) {
		WebElement clkElment = null;
		try {
			clkElment = driver.findElement(By.xpath(pathValue
					.getProperty(prty)));
			if (!clkElment.isEnabled()) {
				String item = clkElment.getText();
				// System.out.println(item + " remains same");
				// LogFile.info(item + " remains same");
			} else {
				String item = clkElment.getText();
				// System.out.println(item + " has got unselected");
				// LogFile.info(item + " has got unselected");
				
				Actions mouseOver = new Actions(driver);
				System.out.println("element"+element);
				mouseOver.moveToElement(clkElment).click().build().perform();
				System.out.println("perd"+element);
			}
		} catch (Exception e) {
			Log.error(e);
		}
	}

	public static List<WebElement> getListOfWebElement(String loc, String prty) {
		WebElement webElement = null;
		List<WebElement> listOfWebElement = null;
		try {
			if (loc.equals("id")) {
				webElement = getWebElement(loc, prty);
				listOfWebElement = webElement.findElements(By.id(prty));
			}
			if (loc.equals("xpath")) {
				webElement = getWebElement(loc, prty);
				listOfWebElement = webElement.findElements(By.xpath(prty));
			}
			if (loc.equals("tagname")) {
				webElement = getWebElement(loc, prty);
				listOfWebElement = webElement.findElements(By.tagName(prty));
			}
		} catch (Exception e) {
			Log.error(e);
		}
		return listOfWebElement;
	}

	public static WebElement getWebElement(String loc, String prty) {
		WebElement webElement = null;
		try {
			if (loc.equals("id")) {
				webElement = driver.findElement(By.id(prty));
			}
			if (loc.equals("xpath")) {
				webElement = driver.findElement(By.xpath(prty));
			}
			if (loc.equals("linkText")) {
				webElement = driver.findElement(By.linkText(prty));
			}
		} catch (Exception e) {
			Log.error(e);
		}

		return webElement;
	}

	public static void uploadFile(String testData) {
		try {
			Robot uploadIt = new Robot();

			uploadIt.setAutoDelay(2000);
			String pathDir = System.getProperty("user.dir").concat(UPLOADPATH);
			System.out.println(pathDir);

			StringSelection selectString = new StringSelection(pathDir + testData);
			Toolkit.getDefaultToolkit().getSystemClipboard()
					.setContents(selectString, null);

			uploadIt.setAutoDelay(2000);

			uploadIt.keyPress(java.awt.event.KeyEvent.VK_CONTROL);
			uploadIt.keyPress(java.awt.event.KeyEvent.VK_V);
			uploadIt.keyPress(java.awt.event.KeyEvent.VK_TAB);
			uploadIt.keyPress(java.awt.event.KeyEvent.VK_TAB);
			// uploadIt.keyPress(java.awt.event.KeyEvent.VK_ENTER);
			uploadIt.setAutoDelay(2000);
			// uploadIt.keyRelease(java.awt.event.KeyEvent.VK_ENTER);
			uploadIt.keyRelease(java.awt.event.KeyEvent.VK_TAB);
			uploadIt.keyRelease(java.awt.event.KeyEvent.VK_TAB);
			uploadIt.keyRelease(java.awt.event.KeyEvent.VK_V);
			uploadIt.keyRelease(java.awt.event.KeyEvent.VK_CONTROL);

			uploadIt.setAutoDelay(2000);

			uploadIt.keyPress(java.awt.event.KeyEvent.VK_ENTER);
			uploadIt.keyRelease(java.awt.event.KeyEvent.VK_ENTER);
		} catch (Exception e) {
			Log.error(e);
		}

	}

	public static void clicksValue(String loc, Properties pathValue,
			String prty, String testData) {
		try {
			JavascriptExecutor jse = (JavascriptExecutor) driver;
			System.out.println("testData------------" + testData);
			WebElement we = driver.findElement(By.xpath(pathValue
					.getProperty(prty)));
			System.out.println("testData------------" + we);
			String text = jse.executeScript(
					"return arguments[0].getAttribute(\"class\");", we)
					.toString();
			jse.executeScript("arguments[0].removeAttribute(\"class\");", we);
			Select select = new Select(we);
			System.out.println("testData------------" + testData);
			select.selectByVisibleText(testData);
			jse.executeScript("arguments[0].setAttribute(\"class\",\"" + text
					+ "\");", we);

		} catch (Exception e) {
			System.out.println("eroor"+e);
			Log.error(e);
		}
	}

	public static void setDate(String loc, Properties pathValue, String prty,
			String testData) {
		try {
			JavascriptExecutor jse = (JavascriptExecutor) driver;
			jse.executeScript("arguments[0].removeAttribute(\"readOnly\");",
					getWebElement(loc, pathValue.getProperty(prty)));
			WebElement we = driver.findElement(By.xpath(pathValue
					.getProperty(prty)));
			we.clear();
			Actions mouseOver = new Actions(driver);
			System.out.println("sendKeysPos"+element);
			mouseOver.moveToElement(we).sendKeys(testData);
			System.out.println("sendKeysPos"+element);
			jse.executeScript(
					"arguments[0].setAttribute(\"readOnly\",\"true\");", we);
		} catch (Exception e) {
			System.out.println("dateerrpr------------" + e);
			Log.error(e);
		}
	}

	public static void clickSubMenu(String loc, Properties pathValue,
			String prty1, String prty2) {
		WebElement link = null;
		WebElement subLink = null;
		Actions mouseOver = null;
		try {
			System.out.println("sucess submenu");
			link = driver.findElement(By.linkText(pathValue.getProperty(prty1)));
			mouseOver = new Actions(driver);
			mouseOver.moveToElement(link).build().perform();
			subLink = driver.findElement(By.linkText(pathValue.getProperty(prty2)));
			mouseOver.moveToElement(subLink).click().perform();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println("error submenu"+e);
			e.printStackTrace();
		}
	}

	public static void clickScrollDown(String loc, Properties pathValue,
			String prty) {
		WebElement scrollDown = null;
		// System.out.println(sd.getAttribute("data-title"));
		try {
			scrollDown = driver.findElement(By.xpath(pathValue
					.getProperty(prty)));
			JavascriptExecutor jse = (JavascriptExecutor) driver;
			jse.executeScript("arguments[0].scrollIntoView();", scrollDown);
		} catch (Exception e) {
			Log.error(e);
		}
	}
	
	public static void clear(String loc, Properties pathValue, String prty) {
		WebElement clrObj = null;
		
		try {
			if (loc.equals("id"))
			{
			clrObj = driver.findElement(By.id(pathValue
					.getProperty(prty)));
			clrObj.clear();
			System.out.println("Data Clearrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
			}
			if (loc.equals("xpath"))
			{
			clrObj = driver.findElement(By.xpath(pathValue
					.getProperty(prty)));
			clrObj.clear();
			System.out.println("Data Clearrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
			}
			if (loc.equals("linkText"))
			{
			clrObj = driver.findElement(By.linkText(pathValue
					.getProperty(prty)));
			clrObj.clear();
			}
			} catch(Exception e) {
			Log.error(e);
		}
	}
	
	public static void setText(String loc, Properties pathValue, String prty, String testData) {
		WebElement setTxt;
		try	{
			Actions mouseOver = new Actions(driver);
			if (loc.equals("xpath"))
			{
				setTxt = driver.findElement(By.xpath(pathValue
						.getProperty(prty)));
				clear(loc,pathValue, prty);
				System.out.println("testDataaaa"+testData+loc+prty);
				mouseOver.moveToElement(setTxt).sendKeys(testData);
				System.out.println("sendKeysPos"+setTxt);
			}
			if (loc.equals("id"))
			{
				setTxt = driver.findElement(By.id(pathValue
						.getProperty(prty)));
				clear(loc,pathValue, prty);
				System.out.println("testDataaaa"+testData+loc+prty);
				mouseOver.moveToElement(setTxt).sendKeys(testData);
				System.out.println("setTxt1"+setTxt);	
			}
		} catch(Exception e){
			System.out.println("e"+e);
			Log.error(e);
		}
	}

}

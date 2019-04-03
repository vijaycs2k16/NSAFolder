package com.nsaweb.functions;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.events.EventFiringWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.nsaweb.reports.LogFile;
import com.nsaweb.reports.Reports;

public class UtilFunctions extends LogFile{
	static WebDriver driver;
	static Reports reports = new Reports();

	public static void browserLaunch(String brw) {
		try	{
			if(brw.equals("FireFox")) {
				System.setProperty(Envi.FF, Envi.FFdriverpath);
				driver = new FirefoxDriver();
				info(brw + " launched successfully");
			} else if(brw.equals("GoogleChrome")) {
				System.setProperty(Envi.GC, Envi.GCdriverpath);
				driver = new ChromeDriver();
				driver.manage().window().maximize();
				info(brw + " launched successfully");
			} else if(brw.equals("InternetExplorer")) {
				System.setProperty(Envi.IE, Envi.IEdriverpath);
				driver = new InternetExplorerDriver();
				info(brw + " launched successfully");
			} else {
				error("browser is not launched due to internal issue");
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static String getOSUsed() {
		String platformName = System.getProperty("os.name").replaceAll("[0-9, ]", "");
		String platformVersion = System.getProperty("os.name").replaceAll("[a-z,A-Z, ]", "").replace(".1", "");
		String OSArch = System.getProperty("os.arch").replaceAll("[a-z,A-Z, ]", "");
		if(OSArch.equals("86"))
			OSArch="32";
		return (platformName.substring(0, 3).toUpperCase()+platformVersion+OSArch);
	}
	
	public static void getURL(String appAddress){
		try	{
			driver.get(appAddress);
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void getTitle() {
		try	{
			String getTitle = driver.getTitle();
			System.out.println("Page title - " + getTitle);
		} catch(Exception e){
			error(e.getMessage());
		}
	}

	public static void chkrdoBtn(String loc, String prty, String testData) {
		
		WebElement webElement = null;
		try {
			webElement = getWebElement(loc, prty);
			Select selectItem = new Select(webElement);
						
			List<WebElement> oSize = selectItem.getOptions();
			int iListSize = oSize.size();

			// Setting up the loop to print all the options
			for(int i =0; i < iListSize ; i++){
				// Storing the value of the option	
				String sValue = selectItem.getOptions().get(i).getText();
				// Printing the stored value
				System.out.println(sValue);
				// Putting a check on each option that if any of the option is equal to 'Africa" then select it 
				if(sValue.equals(testData)) {
					selectItem.selectByIndex(i);
					break;
					}
				}	    
			
		} catch(Exception e) {
			
		}
		
	}
	
	public static WebElement getWebElement(String loc, String prty)	{
		WebElement webElement = null;
		try	{
			if(loc.equals("id")) {
				webElement = driver.findElement(By.id(prty));
			}
			if(loc.equals("xpath"))	{
				webElement = driver.findElement(By.xpath(prty));
			}
			if(loc.equals("linkText")) {
				webElement = driver.findElement(By.linkText(prty));
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
		
		return webElement;
	}

	public static List<WebElement> getWebElements(String loc, String prty) {
		List<WebElement> webElements = null;
		try	{
			if(loc.equals("id")) {
				webElements = driver.findElements(By.id(prty));
			}			
			if(loc.equals("xpath"))	{
				webElements = driver.findElements(By.xpath(prty));
			}
			if(loc.equals("linkText")) {
				webElements = driver.findElements(By.linkText(prty));
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
		return webElements;
	}
	
	public static WebElement selectSingleValue(String loc, String prty, String testData) {
		WebElement we = null;
		List<WebElement> elementList = null;
		try	{
			elementList = getWebElements(loc, prty);
//			System.out.println("Count of Element List - " + elementList.size());
			for(int i=0; i<elementList.size(); i++)	{
				String elementListValue =  elementList.get(i).getText();
//				System.out.println("Value List " + i + " - " +elementListValue);
				System.out.println("Test Data - " + testData);
				if(elementListValue.contains(testData))	{
					int value = i;
//					System.out.println("value - " + value);
//					elementList.get(value).click();
					we = elementList.get(value);
//					we.click();
//					System.out.println(testData + " has been checked successfully using " + loc + " locator");
					break;
				} else {
					System.out.println(testData + " has not been checked successfully using " + loc + "locator");
				}
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
		
		return we;
	}
	
	public static List<WebElement> getListOfWebElement(String loc, String prty)	{
		WebElement webElement = null;
		List<WebElement> listOfWebElement = null;
		try	{
			if(loc.equals("id")) {
				webElement = getWebElement(loc, prty);
				listOfWebElement =	webElement.findElements(By.id(prty));
			}
			if(loc.equals("xpath"))	{
				webElement = getWebElement(loc, prty);
				listOfWebElement = webElement.findElements(By.xpath(prty));
			}
			if(loc.equals("tagname")){
				webElement = getWebElement(loc, prty);
				listOfWebElement = webElement.findElements(By.tagName(prty));
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
		return listOfWebElement;
	}
		
	public static WebElement selectMutipleValue(String loc, String prty, String testData) {
		WebElement we = null;
		List<WebElement> elementList = null;
		try	{
			elementList = getListOfWebElement(loc, prty);
			System.out.println("Values of drop down - " + elementList.size());
			for(int i=0; i<elementList.size(); i++)	{
				String elementListValue =  elementList.get(i).getText();
//				System.out.println("Value List : " + i + " - " +elementListValue);
//				System.out.println("Test Data - " + testData);
				if(elementListValue.contains(testData))	{
					int value = i;
					System.out.println("value - " + value);
//					elementList.get(value).click();
					we = elementList.get(value);
//					we.click();
					System.out.println(testData + " has been checked successfully using " + loc + " locator");
					break;
				} else {
					System.out.println(testData + " has not been checked successfully using " + loc + "locator");
				}
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
		return we;
	}
	
	public static String getText(String loc, String prty) {
		WebElement actionObject;
		String textValue = null;
		try	{
			actionObject = getWebElement(loc, prty);
			textValue = actionObject.getText();
			System.out.println("The text Value : " + textValue);
		} catch(Exception e) {
			error(e.getMessage());
		}
		return textValue;
	}
		
	public static void verifyText(String loc, String prty,  String testStepName) {
		WebElement actionObject;
		String textValue = null;
		try	{
			actionObject = getWebElement(loc, prty);
			textValue = actionObject.getText();
			System.out.println("The text Value : " + textValue);
			System.out.println("Envi.duplicateRecCnt:::"+Envi.duplicateRecCnt);
			if(textValue.toLowerCase().contains(Envi.login.toLowerCase())) {
				if(textValue.contains(Envi.loginSuccess)){
					reports.getStatus(testStepName, "pass");
				} else if(textValue.contains(Envi.loginError)){
					reports.getStatus(testStepName, "fail");
				} else {
					reports.getStatus(testStepName, "fail");
				}
			} else if(textValue.toLowerCase().contains(Envi.logout.toLowerCase())) {
				if(textValue.contains(Envi.logoutSuccess)){
					reports.getStatus(testStepName, "pass");
				} else {
					reports.getStatus(testStepName, "fail");
				}
			} else if(textValue.toLowerCase().contains(Envi.save.toLowerCase())) {
				if(textValue.contains(Envi.saveSuccess)){
					if(Envi.duplicateRecCnt == 0)
						reports.getStatus(testStepName, "pass");
					else
						reports.getStatus(testStepName, "fail");
				} else if(textValue.contains(Envi.saveDraftSuccess)){
					if(Envi.duplicateRecCnt == 0)
						reports.getStatus(testStepName, "pass");
					else
						reports.getStatus(testStepName, "fail");
				} else {
					if(Envi.duplicateRecCnt == 0)
						reports.getStatus(testStepName, "fail");
					else
						reports.getStatus(testStepName, "fail");
				}
			} else if(textValue.toLowerCase().contains(Envi.create.toLowerCase())) {
				if(textValue.contains(Envi.createSuccess)){
					if(Envi.duplicateRecCnt == 0)
						reports.getStatus(testStepName, "pass");
					else
						reports.getStatus(testStepName, "fail");
				} else {
					if(Envi.duplicateRecCnt == 0)
						reports.getStatus(testStepName, "fail");
					else
						reports.getStatus(testStepName, "fail");
				}
			} else if(textValue.toLowerCase().contains(Envi.assign.toLowerCase())){
				if(textValue.contains(Envi.assignSuccess)){
					reports.getStatus(testStepName, "pass");
				} else {
					reports.getStatus(testStepName, "fail");
				}
			} else if(textValue.toLowerCase().contains(Envi.approval.toLowerCase())){
				if(textValue.contains(Envi.approvalSuccess)){
					reports.getStatus(testStepName, "pass");
				} else {
					reports.getStatus(testStepName, "fail");
				}
			} else if(textValue.toLowerCase().contains(Envi.sent.toLowerCase())){
				if(textValue.contains(Envi.sentSuccess)){
					if(Envi.duplicateRecCnt == 0)
						reports.getStatus(testStepName, "pass");
					else
						reports.getStatus(testStepName, "fail");
				} else {
					if(Envi.duplicateRecCnt == 0)
						reports.getStatus(testStepName, "fail");
					else
						reports.getStatus(testStepName, "fail");
				}
			} else if(textValue.toLowerCase().contains(Envi.edit.toLowerCase())){
				if(textValue.contains(Envi.editSuccess)){
					reports.getStatus(testStepName, "pass");
				} else {
					reports.getStatus(testStepName, "fail");
				}
			} else if(textValue.toLowerCase().contains(Envi.recordSuccess.toLowerCase())){
				if(textValue.contains(Envi.recordSuccess)){
					reports.getStatus(testStepName, "pass");
				} else {
					reports.getStatus(testStepName, "fail");
				}
			} else if(textValue.toLowerCase().contains(Envi.saveErr.toLowerCase())){
				if(textValue.contains(Envi.saveError))
					reports.getStatus(testStepName, "pass");
				else if(textValue.contains(Envi.recordError))
					reports.getStatus(testStepName, "fail");
				else
					reports.getStatus(testStepName, "fail");
				wait1();
				clickButton(loc, "//a[@class='cd-panel-close']");
			} else if(textValue.contains(Envi.editError)){
				takesScreenShot(testStepName+"_EditFail");
				clickButton(loc, "//a[@class='cd-panel-close']");
			} else{
				reports.getStatus(testStepName, "fail");
			}
		} catch(Exception e) {
			reports.getStatus(testStepName, "fail");
			clickButton(loc, "//a[@class='cd-panel-close']");
			error(e.getMessage());
		}
		Envi.duplicateRecCnt = 0;
	}
	public static void setText(String loc, String prty, String testData) {
		WebElement setTxt;
		try	{
			setTxt = getWebElement(loc, prty);
			clear(loc, prty);
			setTxt.sendKeys(testData);
		} catch(Exception e){
			error(e.getMessage());
		}
	}
	
	public static void editText(String loc, String prty, String testData) {
		WebElement setTxt;
		try	{
			setTxt = getWebElement(loc, prty);
			clear(loc, prty);
			setTxt.sendKeys(testData);
		} catch(Exception e){
			error(e.getMessage());
		}
	}

	public static void setTextArea(String loc, String prty, String testData) {
		WebElement setTxtarea = null;
		try	{
			setTxtarea = getWebElement(loc, prty);
			setTxtarea.sendKeys(Keys.SPACE + testData + Keys.SEMICOLON);
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void editTextArea(String loc, String prty, String testData) {
		WebElement setTxtarea = null;
		try	{
			setTxtarea = getWebElement(loc, prty);
			clear(loc, prty);
			setTxtarea.sendKeys(Keys.SPACE + testData + Keys.SEMICOLON);
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void clickValue(String loc, String prty, String testData)	{
		WebElement clkElment = null;
		try	{
			clkElment = selectSingleValue(loc, prty, testData);
			clkElment.click();
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void clickValues(String loc, String prty, String testData) {
		WebElement clkElments = null;
		try	{
			clkElments = selectMutipleValue(loc, prty, testData);
			clkElments.click();
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void checkValue(String loc,String prty) {
		WebElement clkElment = null;
		try	{
			clkElment = getWebElement(loc, prty);
			if(clkElment.isEnabled()) {
				String item = clkElment.getText();
//				System.out.println(item + " remains same");
//				LogFile.info(item + " remains same");
			} else {
				String item = clkElment.getText();
//				System.out.println(item + " has got selected");
//				LogFile.info(item + " has got selected");
				clkElment.click();
			}
		} catch(Exception e){
			error(e.getMessage());
		}

	}
	
	public static void checkValue(String loc, String prty, String testData) {
		WebElement clkElment = null;
		try	{
			clkElment = selectSingleValue(loc, prty, testData);
			if(clkElment.isEnabled()) {
				String item = clkElment.getText();
//				System.out.println(item + " remains same");
			} else {
				String item = clkElment.getText();
//				System.out.println(item + " has got selected");
				clkElment.click();
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void unCheckValue(String loc,String prty)	{
		WebElement clkElment = null;
		try	{
			clkElment = getWebElement(loc, prty);
			if(!clkElment.isEnabled())	{
				String item = clkElment.getText();
//				System.out.println(item + " remains same");
//				LogFile.info(item + " remains same");
			} else {
				String item = clkElment.getText();
//				System.out.println(item + " has got unselected");
//				LogFile.info(item + " has got unselected");
				clkElment.click();
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void unCheckValue(String loc, String prty, String testData) {
		WebElement clkElment = null;
		try	{
			clkElment = selectSingleValue(loc, prty, testData);
			if(!clkElment.isEnabled()) {
				String item = clkElment.getText();
//				System.out.println(item + " remains same");
//				LogFile.info(item + " remains same");
			} else {
				String item = clkElment.getText();
//				System.out.println(item + " has got unselected");
//				LogFile.info(item + " has got unselected");
				clkElment.click();
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void clickButton(String loc, String prty)	{
		WebElement btnObj = null;
		try	{
			btnObj = getWebElement(loc, prty);
			if(btnObj.isEnabled()) {
				System.out.println("The button is enabled");
				btnObj.click();
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void mouseOver(String loc, String prty) {
		WebElement element = null;
		Actions mouseOver = null;
		
		element = getWebElement(loc, prty);
		mouseOver = new Actions(driver);
		mouseOver.moveToElement(element).perform();
	}
	
	public static void clickSubMenu(String loc, String prty1, String prty2) {
		WebElement link = null;
		WebElement subLink = null;
		Actions mouseOver = null;
		
		link = getWebElement(loc, prty1);
		mouseOver = new Actions(driver);
		mouseOver.moveToElement(link).build().perform();
		
		subLink = getWebElement(loc, prty2);
		mouseOver.moveToElement(subLink).click().perform();
	}
	
	public static void clicksValue(String loc,String prty,String testData) {//clkValueSelectBox
		try {
			if(loc.equals("xpath")) {
				JavascriptExecutor jse = (JavascriptExecutor)driver;
				WebElement we = UtilFunctions.getWebElement(loc, prty);
				wait2("0.50");
				String text = jse.executeScript("return arguments[0].getAttribute(\"class\");", we).toString();
				jse.executeScript("arguments[0].removeAttribute(\"class\");", we);
				Select select = new Select(we);
//				System.out.println("testData------------"+testData);
				select.selectByVisibleText(testData);
				jse.executeScript("arguments[0].setAttribute(\"class\",\""+text+"\");", we);
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void clicksValue(String loc,String prty) {//clkValueSelectBox
		try	{
			if(loc.equals("xpath")) {
				Select select = new Select(UtilFunctions.getWebElement(loc, prty));
//				System.out.println("Select--------"+select.getOptions().size());
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void setDate(String loc, String prty, String testData) {
		try {
			JavascriptExecutor jse = (JavascriptExecutor)driver;
			jse.executeScript("arguments[0].removeAttribute(\"readOnly\");", getWebElement(loc, prty));
			WebElement we = getWebElement(loc, prty);
			we.clear();
			we.sendKeys(testData);
			jse.executeScript("arguments[0].setAttribute(\"readOnly\",\"true\");", we);
		} catch (Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void clickScrollDown(String loc, String prty)	{
		WebElement scrollDown = null;
//		System.out.println(sd.getAttribute("data-title"));
		try {
			scrollDown = getWebElement(loc, prty);
			JavascriptExecutor jse = (JavascriptExecutor)driver;
			jse.executeScript("arguments[0].scrollIntoView();",scrollDown);
		} catch (Exception e) {
			error(e.getMessage());
		}
	}

	public static void clickScroll(String loc, String prty) {
		WebElement we = driver.findElement(By.xpath(prty));
		
		EventFiringWebDriver scroll = new EventFiringWebDriver(driver);
		scroll.executeScript("document.");
	}
	
	public static void clear(String loc, String prty) {
		WebElement clrObj = null;
		
		try {
			clrObj = getWebElement(loc, prty);
			clrObj.clear();
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void getHeaderValue(String loc,String prty,String testData) {
		try {
//			System.out.println("****************************getTableRecBasedOnGivenHeadVal");
			List<WebElement> headerObject;
			int count = 0;
			if(loc.equals("xpath"))	{
				headerObject = getWebElements(loc, prty);
				for(WebElement row:headerObject) {
					count++;
					if(row.getText().contains(testData)) {
						Envi.dynamicXpath = Envi.dynamicXpath+"["+count+"]/input[@type='text']";
						break;
					}
				}
			}
		} catch(Exception ex) {
			ex.printStackTrace();
		}
	}
	
	public static void getValue(String loc, String prty,String testData) {//getTableRecBasedOnGivenRowVal
		WebElement elementRowValue = null;
		
		List<WebElement> rowValues = null;
		List<WebElement> colValues = null;
		Envi.dynamicXpath = null;
		Envi.dynamicScrollXpath = null;
		try	{
			rowValues = getWebElements(loc, prty);
			System.out.println("Data Table Row Size - " + rowValues.size());
			int countRow;
			int countCol;
			
			for(int i=0; i<rowValues.size(); i++) {
				countRow=i+1;
//				System.out.println("Row Value : " + countRow); // + " - ");
				elementRowValue =  rowValues.get(i);
				colValues = elementRowValue.findElements(By.xpath(prty+"["+countRow+"]/td"));
//				System.out.println("Data Table column Size - "+ colValues.size());
				for(int j=0; j<colValues.size(); j++) {
					countCol = j+1;
//					System.out.println("Column Value : " + countCol);
					List<WebElement> colRowValue = driver.findElements(By.xpath(prty+"["+ countRow +"]/td["+ countCol +"]"));
//					System.out.println("No of tags inside td : "+colRowValue.size());
					for(int k=0;k<colRowValue.size();k++) {
						WebElement colDataValue = colRowValue.get(k);
						if(colDataValue.getText().equals(testData))	{
//							System.out.println("colDataValue------------->"+colDataValue.getText());
							Envi.dynamicXpath = prty+"["+ countRow +"]/td";
							int v = countRow-1;
							Envi.dynamicScrollXpath = prty+"["+ v +"]";
							break;
						}
					}
				}
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void searchValue(String loc, String prty,String testData)	{//searchDataTableItem
		WebElement elementRowValue = null;
		List<WebElement> rowValues = null;
		List<WebElement> colValues = null;
		String xpath = null;
		List<String> xpaths = new ArrayList<String>();
		Envi.listOfRecord = new ArrayList<String>();
		try	{
			rowValues = getWebElements(loc, prty);
//			System.out.println("Data Table Row Size - " + rowValues.size());
			int countRow;
			int countCol;
			for(int i=0; i<rowValues.size(); i++) {
				countRow=i+1;
//				System.out.println("Row Value : " + countRow); // + " - ");
				elementRowValue =  rowValues.get(i);
				colValues = elementRowValue.findElements(By.xpath(prty+"["+countRow+"]/td"));
//				System.out.println("Data Table column Size - "+ colValues.size());
				for(int j=0;j<colValues.size();j++) {
					countCol = j+1;
					if(colValues.get(j).getText().equals(testData)) {
						xpath = prty+"["+countRow+"]";
						xpaths.add(xpath);
//						System.out.println(colValues.get(j).getText()+"---->"+prty+"["+countRow+"]");
					}
				}
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
		Envi.listOfRecord = xpaths;
//		Envi.noOfRecords = xpaths.size();
	}

	public static void recordCounts(String loc,String prty) {//dropDownRecordsCount - used for count no of rec in dropdown(exam schedule)
		List<String> listOfRecord = null;
		try {
			listOfRecord = new ArrayList<String>();
			Envi.listOfRecord = new ArrayList<String>();
			Envi.noOfRecords = 0;
			JavascriptExecutor jse = (JavascriptExecutor)driver;
			String text = jse.executeScript("return arguments[0].getAttribute(\"class\");", getWebElement(loc, prty)).toString();
			jse.executeScript("arguments[0].removeAttribute(\"class\");", getWebElement(loc, prty));
			Select select = new Select(getWebElement(loc, prty));
			List<WebElement> elements = select.getOptions();
			for(int i=0;i<elements.size();i++) {
//				System.out.println(elements.get(i).getText());
				listOfRecord.add(elements.get(i).getText());
			}
			Envi.noOfRecords = select.getOptions().size();
			jse.executeScript("arguments[0].setAttribute(\"class\",\""+text+"\");", getWebElement(loc, prty));
			Envi.listOfRecord = listOfRecord;
		} catch (Exception e) {
			error(e.getMessage());
		}
//		System.out.println("noofrecords::::"+Envi.noOfRecords);
//		System.out.println("listOfRecord::::"+Envi.listOfRecord);
	}
	
	public static void recordCount(String loc,String prty) {
		try {
			Envi.duplicateRecCnt = 0;
			Envi.noOfRecords = 0;
			Envi.listOfRecord = new ArrayList<String>();
			List<WebElement> elements = getWebElements(loc, prty);
			for(int i=0;i<elements.size();i++) {
//				System.out.println(elements.get(i).getText());
				Envi.listOfRecord.add(elements.get(i).getText());
			}
			Envi.duplicateRecCnt = elements.size();
			Envi.noOfRecords = elements.size();
		} catch (Exception e) {
			error(e.getMessage());
		}
//		System.out.println("noofrecords::::"+Envi.noOfRecords);
//		System.out.println("listOfRecord::::"+Envi.listOfRecord);
	}
	
	public static String dateToString(Date d) {
		String reportDate = null;
		try {
		//DateFormat df = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
		DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
		Date date = d;        
		reportDate = df.format(date);
//		System.out.println("Report Date: " + reportDate);
		} catch (Exception e) {
			error(e.getMessage());
		}
		return reportDate;
	}
	
	public static String dateToString(String d,int count) {
		String reportDate = d;  // Start date
		SimpleDateFormat sdf = new SimpleDateFormat("d-MMM-yyyy");
		Calendar c = Calendar.getInstance();
		try {
			c.setTime(sdf.parse(reportDate));
			c.add(Calendar.DATE, count);  // number of days to add
			reportDate = sdf.format(c.getTime());
//			System.out.println("---------------->"+reportDate);
		} catch(Exception e) {
			error(e.getMessage());
		}
		return reportDate;
	}

	public static void wait1() {
		try {
			Thread.sleep(7000);
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void wait2(String seconds) {
		//we are using double because if i use float wait method od of object class will be called.
		try	{
//			System.out.println(seconds);
//			long waitTime = (long)seconds*1000;
			double waitTime = Double.parseDouble(seconds)*1000;
//			System.out.println((long) waitTime);
			Thread.sleep((long) waitTime);
		} catch (InterruptedException e) {
			error(e.getMessage());
		}
	}
	
	public static void waitForPageLoad(String loc, String prty)	{
		try	{
			wait2("0.05");
			WebDriverWait wait = new WebDriverWait(driver, 25);
			wait.until(ExpectedConditions.invisibilityOfElementLocated(By.xpath(prty)));
			wait2("0.25");
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void waitImplicitly()	{
		try	{
			driver.manage().timeouts().implicitlyWait(120, TimeUnit.SECONDS);
		} catch(Exception e) {
			error(e.getMessage());
		}
	}
	
	public static void uploadFile(String testData) {
		try {
			Robot uploadIt = new Robot();
	
			uploadIt.setAutoDelay(2000);
			
			StringSelection selectString = new StringSelection(Envi.uploadPath + testData);
			Toolkit.getDefaultToolkit().getSystemClipboard().setContents(selectString, null);
			
			uploadIt.setAutoDelay(2000);
			
			uploadIt.keyPress(java.awt.event.KeyEvent.VK_CONTROL);
			uploadIt.keyPress(java.awt.event.KeyEvent.VK_V);
			uploadIt.keyPress(java.awt.event.KeyEvent.VK_TAB);
			uploadIt.keyPress(java.awt.event.KeyEvent.VK_TAB);
//			uploadIt.keyPress(java.awt.event.KeyEvent.VK_ENTER);
			uploadIt.setAutoDelay(2000);
//			uploadIt.keyRelease(java.awt.event.KeyEvent.VK_ENTER);
			uploadIt.keyRelease(java.awt.event.KeyEvent.VK_TAB);
			uploadIt.keyRelease(java.awt.event.KeyEvent.VK_TAB);
			uploadIt.keyRelease(java.awt.event.KeyEvent.VK_V);
			uploadIt.keyRelease(java.awt.event.KeyEvent.VK_CONTROL);
			
			uploadIt.setAutoDelay(2000);
			
			uploadIt.keyPress(java.awt.event.KeyEvent.VK_ENTER);
			uploadIt.keyRelease(java.awt.event.KeyEvent.VK_ENTER);
		} catch (AWTException e) {
			e.printStackTrace();
		}
		
	}
	
	public static String takesScreenShot(String name) {
		try	{
			File sourceFile = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
			String screenshotPath = Envi.screehShotPath + "/" + name + "-" + getTimeStamp("hhmmssSSS") + "-.png";
			File destFile = new File(screenshotPath);
			FileUtils.copyFile(sourceFile, destFile);
			
			name = destFile.getName();
		} catch (Exception e) {
			error(e.getMessage());
		}
		return name;
	}
	
	public static void browserClose() {
		try	{
			System.out.println("Browser Closed successfully");
			info("Browser Closed successfully");
			if(driver != null){
				driver.close();
				info("Browser Closed successfully");
			}
		} catch(Exception e) {
			error(e.getMessage());
		}
	}

	public enum SupportedOSType {
		WINXP32, WINXP64, WIN732, WIN764, WIN832, WIN864, MAC107, MAC108, MAC109, MAC1010, WIN1032, WIN1064
	}
	
	public enum SupportedBrowserType {
		IE32, IE64, GC, OP, SA, FF, MGC, EDGE
	}
	
	public static String checkPlatform(String OSTorun) {
		SupportedOSType platformType = null;
		String returnValue = null;
		try {
			platformType = SupportedOSType.valueOf(OSTorun);
		} catch (IllegalArgumentException e) {
			System.out.println("'" + OSTorun + "' is invalid OS type. Stopping TestRun");
			System.exit(1);
		}
		returnValue = platformType.toString();
		return returnValue;
	}

	public static String checkBrowser(String browserName) {
		if (browserName.startsWith("IE32") && Envi.OSUsed.endsWith("64")) {
			System.out.println("Browser is Set IE32 for a 64Bit machine, continuing to use IE32 itself");
		}
		SupportedBrowserType browserType = null;
		try {
			browserType = SupportedBrowserType.valueOf(browserName);
		} catch (IllegalArgumentException e) {
			System.out.println("'" + browserName + "' is invalid Browser type. Stopping TestRun");
			System.exit(1);
		}
		return browserType.toString();
	}
	
	public static String getTimeStamp(String DateFormat){
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat(DateFormat,new Locale("en","GB"));
		String formattedDate = sdf.format(date);
		sdf = null;
		date = null;
		return formattedDate;
	}
	
	public static String getTimeStamp(){
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yyyy hh:mm:ss a",new Locale("en","GB"));
		String formattedDate = sdf.format(date);
		sdf = null;
		date = null;
		return formattedDate;
	}
	
}


//public static void takesScreenShot(String name) {
//try	{
//	File sourceFile = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
//	String screenshotPath = Envi.screehShotPath+ "/" + name + ".png";
//	File destFile = new File(screenshotPath);
//	FileUtils.copyFile(sourceFile, destFile);
//} catch (Exception e) {
//	error(e.getMessage());
//}
//}
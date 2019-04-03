package com.nsa.testing.commons;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.ie.InternetExplorerDriver;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.nsa.testing.pageObjects.ReadXmlFile;


public class Browser extends ReadXmlFile implements Constants {
	
	public static  WebDriver driver;
	public boolean browserAlreadyOpen = false;


	public static Properties readData(String value) throws IOException {
		Properties properties = new Properties();
		InputStream input = Browser.class.getClass().getResourceAsStream(value);
		System.out.println(input);
		properties.load(input);
		return properties ;
	}
	public WebDriver openBrowser(Properties properties) throws InterruptedException {
		if (!browserAlreadyOpen) {
			if (properties.getProperty(BROWSER).equals(HTML)) {
			driver = new HtmlUnitDriver(BrowserVersion.FIREFOX_38);
				((HtmlUnitDriver) driver).setJavascriptEnabled(true);
				/*File file = new File("D:/selenium notes/phantom/phantomjs-2.1.1-windows/bin/phantomjs.exe");             
				System.setProperty("phantomjs.binary.path", file.getAbsolutePath());        
				 driver = new PhantomJSDriver();*/ 
				
			} else if (properties.getProperty(BROWSER).equals(FIREFOX)){
				driver = new FirefoxDriver();
				
			} else if (properties.getProperty(BROWSER).equals(CHROME)) {
				String pathDir = System.getProperty("user.dir").concat(CHROME_PATH);
				System.out.println(pathDir);
				System.setProperty("webdriver.chrome.driver",pathDir);
				driver = new ChromeDriver();
				/*ChromeOptions options = new ChromeOptions();
				options.addExtensions(new File("C:/chrome/chromedriver"));
				 driver = new ChromeDriver(options);*/
				
			} else if (properties.getProperty(BROWSER).equals(IE)) {
				System.setProperty("webdriver.ie.driver",IE_PATH);
				driver = new InternetExplorerDriver();
			}
		}
		driver.get(properties.getProperty(URL));
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(50, TimeUnit.SECONDS);
		browserAlreadyOpen = true;
		
		return driver;
		
	}

	public void closeBrowser() {
		driver.close();
		browserAlreadyOpen = false;
	}

	public void quitBrowser() {
		driver.quit();
		browserAlreadyOpen = false;
	}

}



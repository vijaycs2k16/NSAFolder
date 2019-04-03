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
public class GalleryTest extends Browser {
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
	@Parameters({ "galleryName", "albumDesc", "catName" })
	public void addEmployee(@Optional String galleryName,
			@Optional String albumDesc, @Optional String catName)
			throws ParserConfigurationException, SAXException, IOException,
			InterruptedException {
		WebDriver driver = openBrowser(properties);
		Properties properties = readData(PROP_OR_PROPERTIES);
		Thread.sleep(2000);
		LoginTest.loginSingle();
		Thread.sleep(9000);
		Common.clickPos(driver, properties, "asset_mgmt");
		Common.clickPos(driver, properties, "gallery_nav");
		Thread.sleep(10000);
		Common.clickPos(driver, properties, "add_gallery_btn");
		Thread.sleep(3000);
		Common.sendKeysPos(driver, properties, "album_name", galleryName);
		Thread.sleep(3000);
		Common.sendKeysPos(driver, properties, "album_desc", albumDesc);
		Thread.sleep(3000);
		Common.clickPos(driver, properties, "clk_category_btn");
		Thread.sleep(5000);
		Common.clickValues("xpath", properties, "select_sub", catName);
		Common.clickPos(driver, properties, "clk_category_btn");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "upload_Link");
		Common.uploadFile("nature.jpg");
		Thread.sleep(2000);
		Common.clickPos(driver, properties, "save_gallery");
		Thread.sleep(2000);

	}
}
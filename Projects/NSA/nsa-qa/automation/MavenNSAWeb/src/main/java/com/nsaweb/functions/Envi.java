package com.nsaweb.functions;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;

import com.nsaweb.suite.ETestCase;

public class Envi extends ETestCase
{
	
	public static String OSUsed = getOSUsed();
	public static String currentTestName;
	public static String userID = System.getProperty("user.name").toLowerCase();
	
	public static String currentDir = System.getProperty("user.dir");
	public static String testDataPath = currentDir+"/src/main/java/inputfiles/testData";
	public static String uploadPath = currentDir + "/src/main/java/inputfiles/uploadFiles/";
	public static String screehShotPath = currentDir + "/src/main/java/outputfiles/screenShot";
	public static String reportPath = currentDir + "/src/main/java/outputfiles/reports";
	
	public static String FF = "webdriver.gecko.driver";
	public static String GC = "webdriver.chrome.driver";
	public static String IE = "webdriver.ie.driver";
	public static String FFdriverpath = currentDir + "/src/main/java/externalSoftware/browsers/FF/geckodriver.exe";
	public static String GCdriverpath = currentDir + "/src/main/java/externalSoftware/browsers/GC/chromedriver.exe";
	public static String IEdriverpath = currentDir + "/src/main/java/externalSoftware/browsers/IE/IEDriverServer.exe";
	
	public static Logger logger = null;
	public static Level logLevel = Level.DEBUG;	
	
	public static int noOfRecords;
	public static int duplicateRecCnt;
	public static int timeStartCnt = 2;
	public static int timeEndCnt = 4;
	public static int replaceIndex = 5;
	public static int periodStartCnt = 14;
	public static int periodEndCnt = 16;
	
	public static List<String> listOfRecord = new ArrayList<String>();
	public static String dateString;
	public static String dynamicXpath;
	public static String dynamicScrollXpath;
	public static String keyValue;

	public static String login = "logged";
	public static String logout = "logged";
	public static String loginError = "Errroooo";
	public static String loginSuccess = "logged in Successfully";
	public static String logoutSuccess = "logged out Successfully";
	
	public static String save = "Saved";
	public static String saveSuccess = "Details Saved";
	public static String saveDraftSuccess = "Saved as Draft";
	public static String assign = "assigned";
	public static String assignSuccess = "Assigned Successfully";
	public static String sent = "sent";
	public static String sentSuccess = "sent Successfully";
	public static String create = "Created";
	public static String createSuccess = "Details Created";
	public static String approval = "Approval";
	public static String approvalSuccess = "sent for Approval";
	public static String recordSuccess = "recorded for the day";
	public static String recordError = "already for this day";
	public static String saveErr = "already";
	public static String saveError = "Already Exits";
	public static String edit = "Updated";
	public static String editSuccess = "Details Updated";
	public static String editError = "Already Exits";
	
}
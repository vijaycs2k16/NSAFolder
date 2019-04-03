package com.nsaweb.reports;

import org.apache.log4j.Logger;

public class LogFile
{	
	 // Initialize Log4j logs
	 private static Logger Log = Logger.getLogger(LogFile.class.getName());
	 
	 // This is to print log for the beginning of the test case, as we usually run so many test cases as a test suite
	 public static void startTestCase(String testCaseName)
	 {
		 Log.info("***************          Execution of " + testCaseName + " starts          ***************");	 
	 } 
	 
	 //This is to print log for the ending of the test case
	 public static void endTestCase(String sTestCaseName)
	 {
		 Log.info("***************          Execution of " + sTestCaseName + " ends          ***************");
	 }
	  
	 // Need to create these methods, so that they can be called  
	 public static void info(String message)
	 {
		 Log.info(message);
	 }
	 
	 public static void warn(String message)
	 {
		 Log.warn(message);
	 }
	 
	 public static void error(String message)
	 {
		 Log.error(message);
	 }
	 
	 public static void fatal(String message)
	 {
		 Log.fatal(message); 
	 }
	 	 
	 public static void debug(String message) 
	 { 
		 Log.debug(message);
	 }

}
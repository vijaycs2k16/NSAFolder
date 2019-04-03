package com.nsaweb.suite;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.openqa.selenium.WebDriver;

import com.nsaweb.functions.Envi;
import com.nsaweb.functions.ReadExcel;
import com.nsaweb.functions.UtilFunctions;
import com.nsaweb.reports.LogFile;
import com.nsaweb.reports.Reports;

public class ETestCase extends UtilFunctions
{
	static WebDriver driver;
	
	public static void mainCall(List<String> params) {
		int firstIndex = 1;
		int startIndex = 3;
		int endIndex = 7;
		int cnt;
		List<String> subListValues = null;
		
		try {
			subListValues = new ArrayList<String>();

			for(int i=0;i<(params.size())/7;i++) {
				cnt = 0;
				if(i>0) {
					firstIndex = firstIndex+7;
					startIndex = startIndex+7;
					endIndex = endIndex+7;
				}
				LogFile.startTestCase(params.get(startIndex));
				if(Envi.keyValue.equals("set_DetailFee") || Envi.keyValue.equals("click_EditFee")) {
					if(params.get(startIndex).equals("setText")) {
						if(params.get(startIndex+2).equals("NA"))
							params.set(startIndex+2, Envi.dynamicXpath+"/input");
					}
				} else if(Envi.keyValue.equals("set_DetailAttendance")) {
					if(params.get(startIndex).equals("clickScrollDown")) {
						if(params.get(startIndex+2).equals("NA")) {
							System.out.println("Envi.dynamicScrollXpath::::"+Envi.dynamicScrollXpath);
							params.set(startIndex+2, Envi.dynamicScrollXpath);
						}
					} else if(params.get(startIndex).equals("unCheckValue") || params.get(startIndex).equals("checkValue")) {
						if(params.get(startIndex+2).equals("NA")) {
							String txt = getText("xpath", Envi.dynamicXpath+"[1]");
							params.set(startIndex+2, Envi.dynamicXpath + "/input[@value='" + txt + "']");
						}
					} else if(params.get(startIndex).equals("setText")) {
						if(params.get(startIndex+2).equals("NA")) {
							String txt = getText("xpath", Envi.dynamicXpath+"[1]");
							params.set(startIndex+2, Envi.dynamicXpath + "/input[@data-id='"+txt+"']");
						}
					} 
				} else if(Envi.keyValue.equals("set_DetailOfEM")) {
					if(params.get(startIndex).equals("clickScrollDown")) {
						if(params.get(startIndex+2).equals("NA")) {
							System.out.println("Envi.dynamicScrollXpath::::"+Envi.dynamicScrollXpath);
							params.set(startIndex+2, Envi.dynamicScrollXpath);
						}
					} else if(params.get(startIndex).equals("clickButton")) {
						if(params.get(startIndex+2).equals("NA")) {
							params.set(startIndex+2, Envi.dynamicXpath + "/button");
						}
					} else if(params.get(startIndex).equals("setText")) {
						if(params.get(startIndex+2).equals("NA")) {
							params.set(startIndex+2, Envi.dynamicXpath);
						}
					} 
				} else if(Envi.keyValue.equals("set_DetailOfLeave")) {
					if(params.get(startIndex).equals("clickScrollDown")) {
						if(params.get(startIndex+2).equals("NA")) {
							System.out.println("Envi.dynamicScrollXpath::::"+Envi.dynamicScrollXpath);
							params.set(startIndex+2, Envi.dynamicScrollXpath);
						}
					} else if(params.get(startIndex).equals("unCheckValue") || params.get(startIndex).equals("checkValue")) {
						if(params.get(startIndex+2).equals("NA")) {
							String txt = getText("xpath", Envi.dynamicXpath+"[2]");
							System.out.println("-------*****"+ Envi.dynamicXpath + "/input[@data-value='" + txt + "']");
							params.set(startIndex+2, Envi.dynamicXpath + "/input[@data-value='" + txt + "']");
						}
					} else if(params.get(startIndex).equals("editText")) {
						if(params.get(startIndex+2).equals("NA")) {
							String txt = getText("xpath", Envi.dynamicXpath+"[2]");
							params.set(startIndex+2, Envi.dynamicXpath + "/input[@data-name='"+txt+"']");
						}
					}
				}
				subListValues = params.subList(firstIndex, endIndex);
//				System.out.println(params.subList(startIndex, endIndex));
//				System.out.println("before::::"+subListValues);
				for(int j=0;j<subListValues.size();j++) {
					if(subListValues.get(j).equals("NA")) {
						cnt++;
					}
				}
//				System.out.println("after:::"+cnt);
				switchCall(cnt, subListValues);
				LogFile.endTestCase(params.get(firstIndex));
			}
		} catch(Exception e) {
			LogFile.error(e.getMessage());
		}
		
	}
	
	public static void switchCall(int size,List<String> subListValues) {
		Class<?> cls;
		switch(size) {
		case 0:
			try {
				cls = Class.forName("com.nsaweb.functions.UtilFunctions");
				Method meth = cls.getMethod(subListValues.get(2), String.class, String.class, String.class);
				String param1 = subListValues.get(3);
				String param2 = subListValues.get(4);
				String param3 = subListValues.get(5);
				meth.invoke(null, (Object) param1, (Object) param2, (Object) param3); 
				break;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				LogFile.error(e.getMessage());
			}
		case 1:
			try {
				cls = Class.forName("com.nsaweb.functions.UtilFunctions");
				if(subListValues.get(2).equals("verifyText")) {
					System.out.println("******************verifyText***************");
					Method meth = cls.getMethod(subListValues.get(2), String.class, String.class, String.class);
					String param1 = subListValues.get(3);
					String param2 = subListValues.get(4);
					String param3 = subListValues.get(0);
					meth.invoke(null, (Object) param1, (Object) param2, (Object) param3); // static method doesn't have an instance
				} else {
					Method meth = cls.getMethod(subListValues.get(2), String.class, String.class);
					String param1 = subListValues.get(3);
					String param2 = subListValues.get(4);
					meth.invoke(null, (Object) param1, (Object) param2); // static method doesn't have an instance
				}
			    break;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				LogFile.error(e.getMessage());
			}
		case 2:
			try {
				cls = Class.forName("com.nsaweb.functions.UtilFunctions");
				Method meth = cls.getMethod(subListValues.get(2), String.class);
				String param1 = subListValues.get(5);
				meth.invoke(null, (Object) param1); // static method doesn't have an instance
				break;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				LogFile.error(e.getMessage());
			}
		case 3:
			try {
				cls = Class.forName("com.nsaweb.functions.UtilFunctions");
				Method meth = cls.getMethod(subListValues.get(2));
				meth.invoke(null); // static method doesn't have an instance
				break;
			} catch (Exception e) {
				// TODO Auto-generated catch block
				LogFile.error(e.getMessage());
			}
		}
	}
	
	public static void initialize() {
//		System.out.println("Working Directory:::"+Envi.workingDir);
		List<String> sheets = new ArrayList<String>(); 
		List<String> executebleSheets = new ArrayList<String>();
//		String packageName = "com.nsaweb.testcases.";
		char rep = Envi.currentDir.charAt(0);
		if(rep=='\\') {
		Envi.currentDir = Envi.currentDir.substring(1);
		System.out.println("current path - " + Envi.currentDir);
		}
		
		String packageName = "com.nsaweb.testexecution.";
		Map<String,List<String>> rowListMap = new LinkedHashMap<String,List<String>>();
		sheets = ReadExcel.getSheets("testData1.xlsx");
		for(int i=0;i<sheets.size();i++) {
			if(sheets.get(i).equals("Execution Sheet")) {
				executebleSheets = ReadExcel.getPrimarySheetData(sheets.get(i));
				break;
			}
		}
		LogFile.info("No of sheets needs to be executed ::::" + executebleSheets.size());
		Reports reports = new Reports();
		reports.setReport();
		for(int i=0;i<executebleSheets.size();i++) {
			System.out.println(executebleSheets.get(i));
			Envi.currentTestName = executebleSheets.get(i);
			rowListMap = ReadExcel.getSecondarySheetData(executebleSheets.get(i));
			try {
				Class<?> cls = Class.forName(packageName + Envi.currentTestName);
				LogFile.info("Executing Sheet Starts...  "+cls.getName());
				System.out.println(rowListMap.entrySet().size());
				for(Map.Entry<String, List<String>> entry : rowListMap.entrySet()) {
					LogFile.info(entry.getKey()+"------------"+entry.getValue());
//					System.out.println("No of records:::::"+Envi.noOfRecords);
					Envi.keyValue = entry.getKey();
					if(Envi.noOfRecords>0) {
						for(int j=0;j<Envi.noOfRecords;j++) {
							Method meth = cls.getMethod(entry.getKey(), List.class, int.class);
							List<String> params = entry.getValue();
						    meth.invoke(null, (Object) params, (Object) j); // static method doesn't have an instance
						}
						Envi.noOfRecords = 0;
				    } else {
						Method meth = cls.getMethod(entry.getKey(), List.class);
						List<String> params = entry.getValue();
					    meth.invoke(null, (Object) params); // static method doesn't have an instance
					}			
				}
//				logger.info("Running Test...  "+cls.getName());
				LogFile.info("Executing Sheet Ends...  "+cls.getName());
			} catch(Exception e) {
	    		LogFile.error(e.getMessage());
	    		e.printStackTrace();
	    	} finally {
//	    		report.stopTest();
//	    		reports.closeReport();
	    	}
		}
		reports.closeReport();
	}
	
	public static void main(String args[]) throws InterruptedException {
		
//		System.out.println("Path - " + Envi.currentDir);
//		System.out.println("Hi");
		ETestCase testCase = new ETestCase();
		testCase.initialize();
		
	}
	
}
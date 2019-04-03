package com.nsaweb.testexecution;

import java.util.List;

import com.nsaweb.functions.Envi;
import com.nsaweb.suite.ETestCase;

public class AttendanceInformation extends ETestCase
{
	
	public static void navigate_AttendanceInfo(List<String> params)
	{
		mainCall(params);
	}
	public static void click_RecordAttendance(List<String> params)
	{
		mainCall(params);
	}
	public static void set_DetailOfClass(List<String> params)
	{
		mainCall(params);
	}
	public static void click_Search(List<String> params)
	{
		mainCall(params);
	}
	public static void compareSearchText(List<String> params)
	{
		mainCall(params);
	}
	public static void click_countRecord(List<String> params)
	{
		mainCall(params);
		Envi.noOfRecords = 0;
	}
	public static void click_closeButton(List<String> params)
	{
		System.out.println("-------------------->"+Envi.duplicateRecCnt);
		if(Envi.duplicateRecCnt==1)
			mainCall(params);
	}
	public static void set_DetailAttendance(List<String> params)
	{
		if(Envi.duplicateRecCnt>1)
			mainCall(params);
	}
	public static void click_SaveAttendance(List<String> params)
	{
		if(Envi.duplicateRecCnt>1)
			mainCall(params);
	}
	public static void compareRecordText(List<String> params)
	{
		if(Envi.duplicateRecCnt>1)
			mainCall(params);
	}
	
}
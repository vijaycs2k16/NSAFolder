package com.nsaweb.testexecution;

import java.util.List;

import com.nsaweb.functions.Envi;
import com.nsaweb.suite.ETestCase;

public class OnBoardNotification extends ETestCase
{
	
	public static void navigate_OnBoard(List<String> params)
	{
		mainCall(params);
	}
	
	public static void click_SearchRecord(List<String> params)
	{
		mainCall(params);
		Envi.noOfRecords = 0;
	}
	
	public static void click_AddOnboard(List<String> params)
	{
		mainCall(params);
	}
	
	public static void set_Detail(List<String> params)
	{
		mainCall(params);
	}
	
	public static void click_Send(List<String> params)
	{
		mainCall(params);
	}
	
	public static void compareText(List<String> params)
	{
		mainCall(params);
	}
	
	public static void click_View(List<String> params)
	{
		mainCall(params);
	}
	
	public static void click_CloseBtn(List<String> params)
	{
		mainCall(params);
	}
		
}
package com.nsaweb.testexecution;

import java.util.List;

import com.nsaweb.functions.Envi;
import com.nsaweb.suite.ETestCase;

public class NotificationsSend  extends ETestCase
{
	
	public static void navigate_Notifications(List<String> params)
	{
		mainCall(params);
	}
	
	public static void click_SearchRecord(List<String> params)
	{
		mainCall(params);
		Envi.noOfRecords = 0;
	}
	
	public static void navigate_AllNotifications(List<String> params)
	{
		mainCall(params);
	}
	
	public static void click_AddNotificaitons(List<String> params)
	{
		mainCall(params);
	}
	
	public static void set_Detail(List<String> params)
	{
		mainCall(params);
	}
	
	public static void click_Save(List<String> params)
	{
		mainCall(params);
	}
	
	public static void compareText(List<String> params)
	{
		mainCall(params);
	}

	public static void navigate_Suggestions(List<String> params)
	{
		mainCall(params);
	}

}
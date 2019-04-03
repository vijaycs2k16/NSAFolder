package com.nsaweb.testexecution;

import java.util.List;

import com.nsaweb.functions.Envi;
import com.nsaweb.suite.ETestCase;

public class FeeType extends ETestCase
{

	public static void navigate_FeeConfiguration(List<String> params)
	{
		mainCall(params);
	}
	
	public static void navigate_FeeType(List<String> params)
	{
		mainCall(params);
	}
	
	public static void click_SearchRecord(List<String> params)
	{
		mainCall(params);
		Envi.noOfRecords = 0;
	}
	
	public static void click_AddFeeType(List<String> params)
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
	
	public static void click_Back(List<String> params)
	{
		mainCall(params);
	}

}
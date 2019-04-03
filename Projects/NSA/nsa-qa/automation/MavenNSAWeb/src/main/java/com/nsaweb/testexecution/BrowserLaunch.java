package com.nsaweb.testexecution;

import java.util.List;

import com.nsaweb.suite.ETestCase;

public class BrowserLaunch extends ETestCase
{

	public static void launchBrowser(List<String> params)
	{
		mainCall(params);
	}

	public static void launchApplication(List<String> params)
	{
		mainCall(params);
	}

}
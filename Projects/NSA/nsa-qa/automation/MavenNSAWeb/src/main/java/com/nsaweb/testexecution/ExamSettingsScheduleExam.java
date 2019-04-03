package com.nsaweb.testexecution;

import java.util.List;

import com.nsaweb.functions.Envi;
import com.nsaweb.functions.UtilFunctions;
import com.nsaweb.suite.ETestCase;

public class ExamSettingsScheduleExam extends ETestCase {

	public static void navigate_ExamSettings(List<String> params)
	{
		mainCall(params);
	}
	
	public static void navigate_ExamSchedule(List<String> params)
	{
		mainCall(params);
	}
	
	public static void click_ScheduleExam(List<String> params)
	{
		mainCall(params);
	}
	
	public static void navigate_Schedule(List<String> params)
	{
		mainCall(params);
	}
	
	public static void set_DetailOfExam(List<String> params)
	{
		mainCall(params);
	}
	
	public static void set_NoOfSubject(List<String> params)
	{
		mainCall(params);
	}
	
	public static void set_Detail(List<String> params,int count)
	{
//		System.out.println("******************************************************************");
		if(count<Envi.noOfRecords-1)
		{
			click_Subject(params.subList(0, 7), count);
			Envi.dateString = params.get(13);
			click_ExamDate(params.subList(7, 14), count);
			click_ExamStartTime(params.subList(14, 21), count);
			click_ExamEndTime(params.subList(21, 28), count);
			click_EnterMark(params.subList(28, 35), count);
		}
		if(count<Envi.noOfRecords-2) 
		{
			click_AddSymbol(params.subList(35, 42), count);
		}
	}
	
	public static void click_SaveAsDraft(List<String> params)
	{
		mainCall(params);
	}
	
	public static void compareTextSaveScheduleExam(List<String> params)
	{
		mainCall(params);
	}
	
	public static void click_Subject(List<String> params,int count)
	{
		String value = null;
		value = params.get(Envi.replaceIndex);
		params.set(Envi.replaceIndex+1, Envi.listOfRecord.get(count+1));
		if(count>0)	{
			value = value.replace(String.valueOf((count-1)), String.valueOf(count));
			params.set(Envi.replaceIndex, value);
		}
		System.out.println("after:::"+params.get(Envi.replaceIndex));
		mainCall(params);
	}
	
	public static void click_ExamDate(List<String> params,int count)
	{
		String value = null;
		Envi.dateString = UtilFunctions.dateToString(Envi.dateString, 1);
		value = params.get(Envi.replaceIndex);
		params.set(Envi.replaceIndex+1, Envi.dateString);
		if(count>0)	{
			value = value.replace(String.valueOf((count-1)), String.valueOf(count));
			params.set(Envi.replaceIndex, value);
		}
		System.out.println("after:::"+params.get(Envi.replaceIndex));
		mainCall(params);
	}
	
	public static void click_ExamStartTime(List<String> params,int count)
	{
		String value = null;
		value = params.get(Envi.replaceIndex);
		if(count>0)	{
			Envi.timeStartCnt = Envi.timeStartCnt+4; 
			value = value.replace(String.valueOf((Envi.timeStartCnt-4)), String.valueOf(Envi.timeStartCnt));
			params.set(Envi.replaceIndex, value);
		}else{
			value = value.replace(String.valueOf((Envi.timeStartCnt-2)), String.valueOf(Envi.timeStartCnt));
			params.set(Envi.replaceIndex, value);
		}
		System.out.println("after:::"+params.get(Envi.replaceIndex));
		mainCall(params);
	}
	
	public static void click_ExamEndTime(List<String> params,int count)
	{
		String value = null;
		value = params.get(Envi.replaceIndex);
		if(count>0)	{
			Envi.timeEndCnt = Envi.timeEndCnt+4;
			value = value.replace(String.valueOf((Envi.timeEndCnt-4)), String.valueOf(Envi.timeEndCnt));
			params.set(Envi.replaceIndex, value);
		}else{
			value = value.replace(String.valueOf((Envi.timeEndCnt-2)), String.valueOf(Envi.timeStartCnt));
			params.set(Envi.replaceIndex, value);
		}
		System.out.println("after:::"+params.get(Envi.replaceIndex));
		mainCall(params);
	}
	
	public static void click_EnterMark(List<String> params,int count)
	{
		String value = null;
		value = params.get(Envi.replaceIndex);
		if(count>0)	{
			value = value.replace(String.valueOf((count-1)), String.valueOf(count));
			params.set(Envi.replaceIndex, value);
		}
		System.out.println("after:::"+params.get(Envi.replaceIndex));
		mainCall(params);
	}
	
	public static void click_AddSymbol(List<String> params,int count)
	{
		String value = null;
		value = params.get(Envi.replaceIndex);
//		if(count>0)	{
			value = value.replace("["+String.valueOf((count))+"]", "["+String.valueOf(count+1)+"]");
			params.set(Envi.replaceIndex, value);
//		}
		System.out.println("after:::"+params.get(Envi.replaceIndex));
		mainCall(params);
	}
	
	public static void click_Back(List<String> params)
	{	
		mainCall(params);
	}
	
}
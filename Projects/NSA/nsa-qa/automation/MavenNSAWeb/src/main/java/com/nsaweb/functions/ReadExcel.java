package com.nsaweb.functions;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ReadExcel 
{
	static XSSFWorkbook xWorkBook;
	static XSSFSheet xExcelSheet;
	static XSSFRow xRow;
	static XSSFCell xCell;
	
	static int xSRowIndex = 0;
	static int xLRowIndex = 0;
	static short xSCellIndex = 0;
	static short xLCellIndex = 0;
	
	int rowIndex = 0;
	int cellIndex = 0;
	
	public static String actionValue;
	
	public static int value1, value2, value3, value4, value5;
	public static String cellValue;
//	public static String primarySheetName;
	public static List<String> sheetNames = new ArrayList<String>();
	public static Map<String, List<String>> rowListMap = new LinkedHashMap<String,List<String>>();
	
	public static String getWorkBook(String wBName)
	{
		System.out.println("Verifying Work Book begins");
		String bookName = null;
		File filePath = new File(Envi.testDataPath);
		System.out.println("Excel File Location - " +filePath.getPath());    // print the path's folder
		File[] fileNames = filePath.listFiles();		
		System.out.println("File Count ::"+fileNames.length);
		for(File file : fileNames)
		{
			bookName = file.getName();
//			System.out.println(bookName + "  ");
			if(bookName.equals(wBName))
			{
				System.out.println("Work Book Name  - "+bookName);
				System.out.println("Verifying Work Book ends");
				return bookName;
			}
		}
		System.out.println("first method ends");
		return "File does not exists";
	}

	public static List<String> getSheets(String wBName)
	{
		String bookName = getWorkBook(wBName);
		System.out.println("Get WorkBook with argument begins");
		System.out.println("Work Book Name  - "+bookName);
		if(bookName.equals(wBName))
		{
			FileInputStream fis;
			try 
			{
				fis = new FileInputStream(Envi.testDataPath + "/" + bookName);
				xWorkBook = new XSSFWorkbook(fis);	
			} 
			catch (Exception e)
			{
				e.printStackTrace();
			}		

			int sheetno = xWorkBook.getNumberOfSheets();
//			System.out.println("Number Of Sheets - "+sheetno);
			for(int i = 0; i < sheetno; i++)
			{
//				System.out.println(xWorkBook.getSheetName(i));
				sheetNames.add(xWorkBook.getSheetName(i));
			}
		}
		else
		{
			System.out.println("Workbook does not exists in this folder");
		}
		System.out.println(sheetNames.size());
		return sheetNames;
	}

	public static List<String> getPrimarySheetData(String sName)
	{
//		System.out.println();
//		System.out.println("Get Primary Sheet data function begins");

		String result = new String();
		List<String> results = new ArrayList<String>();
		xExcelSheet = xWorkBook.getSheet(sName);
//		System.out.println("Sheet name - " + sName);

		int xSRowIndex = xExcelSheet.getFirstRowNum();
		int xLRowIndex = xExcelSheet.getLastRowNum();

//		System.out.println("for loop starts");
		ArrayList<ArrayList<String>> node = new ArrayList<ArrayList<String>>();
		System.out.println("Count of i - " + xLRowIndex);
		for(int i = xSRowIndex; i<=xLRowIndex ; i++)
		{
			System.out.println("i - " + i);
			xRow = xExcelSheet.getRow(i);
			System.out.println("xRow - " + xRow);
			int xSCellIndex = xRow.getFirstCellNum();
			int xLCellIndex = xRow.getLastCellNum();

			ArrayList<String> nodeLists = new ArrayList<String>();
			for(int j = xSCellIndex; j<xLCellIndex; j++)
			{
				xCell = xRow.getCell(j);
				if(xCell!=null)
				{
					if (xCell.getCellType() == Cell.CELL_TYPE_NUMERIC)
					{
						double celValue = xCell.getNumericCellValue();
						int cellValueI = (int)celValue;
						cellValue = String.valueOf(true);
						cellValue = String.valueOf(cellValueI);
					}
					if(xCell.getCellType() == Cell.CELL_TYPE_STRING)
					{
						cellValue = xCell.getStringCellValue();
					}
				}					
				else
				{
					cellValue = "";
				}						

				if(cellValue.equalsIgnoreCase("Scenario Name"))
				{
					value1 = j;
				}

				if(cellValue.equalsIgnoreCase("Test Scenario"))
				{
					value2 = j;
				}					

				if(cellValue.equalsIgnoreCase("Run Flag"))
				{
					value3 = j;
				}
				nodeLists.add(cellValue);
			}
			if(cellValue.equalsIgnoreCase("y"))
			{
				node.add(nodeLists);
//				System.out.println(node);
			}
		}  
//		System.out.println("for loop ends");
//		System.out.println(sName+" - data");

		ArrayList<String> iterList1 = new ArrayList<String>();
		Iterator<ArrayList<String>> nodeListIterator1 = node.iterator();
		String scenario1 = " ";
		String scenario2 = " ";
		String runFlag1 = " ";
		
		while(nodeListIterator1.hasNext())
		{
			iterList1 = nodeListIterator1.next();
			scenario1 = iterList1.get(value1);
			scenario2 = iterList1.get(value2);
			runFlag1 = iterList1.get(value3);
			if(runFlag1.equalsIgnoreCase("y"))
			{
//				System.out.println("Scenario Name - " + scenario1 + " | Scenario Description - " + scenario2 );
//				System.out.println(scenario1);
				results.add(scenario1);
			}
		}
		
//		System.out.println(sName+ " - data");
//		System.out.println("Get Primary Sheet data function ends");
		return results;
	}

	public static Map<String,List<String>> getSecondarySheetData(String sName)
	{
		rowListMap = new LinkedHashMap<String, List<String>>();
//		System.out.println("Get Secondary Sheet data function begins");
		
//		System.out.println("Sheet name - " + sName);
		try
		{
			xExcelSheet = xWorkBook.getSheet(sName);
//			System.out.println("sheetname---"+xExcelSheet.getSheetName());
			int xSRowIndex = xExcelSheet.getFirstRowNum();
			int xLRowIndex = xExcelSheet.getLastRowNum();
			XSSFRow xHRow = xExcelSheet.getRow(xSRowIndex);

			System.out.println("loop starts");

			List<String> node = new ArrayList<String>();
			for(int i = 1 ; i<=xLRowIndex ; i++) {
				xRow = xExcelSheet.getRow(i);
				int xSCellIndex = xRow.getFirstCellNum();
				int xLCellIndex = xHRow.getLastCellNum();

				ArrayList<String> nodeLists = new ArrayList<String>();
				
				for(int j = xSCellIndex ; j < xLCellIndex; j++)	{
					xCell = xRow.getCell(j);
					if((xRow.getCell(2)!=null) && (xRow.getCell(2).getCellType() != Cell.CELL_TYPE_BLANK))
						actionValue = xRow.getCell(2).getStringCellValue();
					cellValue = null;
					if(actionValue!=null && rowListMap.containsKey(actionValue)) {
						node = rowListMap.get(actionValue);
						if(xCell!=null)	{
							
							if (xCell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
								double celValue = xCell.getNumericCellValue();
								int cellValueI = (int)celValue;
								cellValue = String.valueOf(true);
								cellValue = String.valueOf(cellValueI);
							}
							if(xCell.getCellType() == Cell.CELL_TYPE_STRING) {
								cellValue = xCell.getStringCellValue();
							}
							if(xCell.getCellType() == Cell.CELL_TYPE_BLANK){
								cellValue = "NA";
							}
						} else {
							cellValue = "NA";
						}	
						nodeLists.add(cellValue);
//						System.out.println("-------------------------->"+nodeLists);
					}else{
//						System.out.println("inside else");
						node = new ArrayList<String>();
						if(xCell!=null)	{
							if (xCell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
								double celValue = xCell.getNumericCellValue();
								int cellValueI = (int)celValue;
								cellValue = String.valueOf(true);
								cellValue = String.valueOf(cellValueI);
							}
							if(xCell.getCellType() == Cell.CELL_TYPE_STRING) {
								cellValue = xCell.getStringCellValue();
							}
							if(xCell.getCellType() == Cell.CELL_TYPE_BLANK){
								cellValue = "NA";
							}
						} else {
							cellValue = "NA";
						}						
//						System.out.println("****************"+cellValue);
						nodeLists.add(cellValue);
					}
				}
				node.addAll(nodeLists);
//				System.out.println("********************************"+node);
				rowListMap.put(actionValue, node);
			}
		} catch(Exception e){
			e.printStackTrace();
		}
		
//		System.out.println("loop ends");
//		System.out.println(sName+" Sheet data");
//		System.out.println("Get Secondary Sheet data function ends");
		return rowListMap;
	}

}
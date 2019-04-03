package com.nsa.testing.pageObjects;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.testng.IReporter;
import org.testng.ISuite;
import org.testng.ISuiteResult;
import org.testng.ITestContext;
import org.testng.xml.XmlSuite;

import com.nsa.pdfngreport.common.ConstantsEmail;
import com.nsa.testing.commons.Browser;
import com.nsa.testing.tests.SendReportMailTest;
import com.uttesh.pdfngreport.PDFGenerator;
import com.uttesh.pdfngreport.model.ResultMeta;
import com.uttesh.pdfngreport.util.PDFCache;
import com.uttesh.pdfngreport.util.PdfngUtil;

public class PDFReportListener extends Browser implements IReporter {

	public static Map<String, ResultMeta> result = new HashMap<String, ResultMeta>();

	/**
	 * This will be called from IReporter
	 *
	 * @param list
	 * @param suites
	 * @param outputFolder
	 */
	public void generateReport(List<XmlSuite> list, List<ISuite> suites,
			String outputFolder) {
		ResultMeta resultMeta = null;
		for (ISuite suite : suites) {
			String suiteName = suite.getName();
			String configPath = suite.getParameter("pdfngreport-properties");
			PdfngUtil pdfngUtil = new PdfngUtil();
			pdfngUtil.loadProperties(configPath);
			Map<String, ISuiteResult> suiteResults = suite.getResults();
			for (ISuiteResult sr : suiteResults.values()) {
				if (result.get(suiteName) != null) {
					resultMeta = result.get(suiteName);
				} else {
					resultMeta = new ResultMeta();
					resultMeta.setSuiteName(suiteName);
				}
				ITestContext tc = sr.getTestContext();
				if (tc.getFailedTests().getAllResults() != null
						&& tc.getFailedTests().getAllResults().size() > 0) {
					resultMeta.getFailedList().add(
							tc.getFailedTests().getAllResults());
				}
				if (tc.getPassedTests().getAllResults() != null
						&& tc.getPassedTests().getAllResults().size() > 0) {
					resultMeta.getPassedList().add(
							tc.getPassedTests().getAllResults());
				}
				if (tc.getSkippedTests().getAllResults() != null
						&& tc.getSkippedTests().getAllResults().size() > 0) {
					resultMeta.getSkippedList().add(
							tc.getSkippedTests().getAllResults());
				}
				result.put(suiteName, resultMeta);
			}
			if (result.size() > 0) {
				PDFGenerator generator = new PDFGenerator();
				String outpurDir = System
						.getProperty(ConstantsEmail.SystemProps.REPORT_OUPUT_DIR);
				if (outpurDir == null || outpurDir.trim().length() == 0) {
					outpurDir = (String) PDFCache
							.getConfig(ConstantsEmail.SystemProps.REPORT_OUPUT_DIR);
				}
				generator.generateReport(outpurDir + "/"
						+ ConstantsEmail.PDF_REPORT_FILE_NAME, result);
			}
		}
		Properties prop = null;
		try {
			prop = readData(PROP_COMMON_PROPERTIES);
		} catch (IOException e) {
			
			e.printStackTrace();
		}
		SendReportMailTest.execute(prop);
	}
}

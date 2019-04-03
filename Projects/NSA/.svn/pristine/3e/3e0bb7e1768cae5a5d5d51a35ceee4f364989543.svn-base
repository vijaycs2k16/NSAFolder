
package com.nsa.pdfngreport.common;


import java.text.SimpleDateFormat;
import java.util.Date;

public interface ConstantsEmail {

    String COLUMN_CLASS = "Test";
    String COLUMN_PACKAGE = "Package";
    String COLUMN_METHOD = "Case";
    String COLUMN_TIME = "Time(ms)";
    String COLUMN_STATUS = "Status";
    String DATE_FORMAT = "MMMM dd YYYY hh:MM:ss";

    public enum TestCaseStatus {

        PASS("PASS"), FAILED("FAILED"), SKIPPED("SKIPPED");

        private String statusCode;

        private TestCaseStatus(String s) {
            statusCode = s;
        }

        public String getStatusCode() {
            return statusCode;
        }

    }

    String[] STATISTIC_TABLE_COLUMS = {ConstantsEmail.STATISTIC_TABLE_PASSED_HEADER,
        ConstantsEmail.STATISTIC_TABLE_FAILED_HEADER,ConstantsEmail.STATISTIC_TABLE_SKIPPED_HEADER,
        ConstantsEmail.STATISTIC_TABLE_PERCENT_HEADER};

    String[] STATUS_TABLE_COLUMS = {
        //Constants.COLUMN_PACKAGE,
        ConstantsEmail.COLUMN_CLASS,
        ConstantsEmail.COLUMN_METHOD,
        "",
        ConstantsEmail.COLUMN_TIME};

    String[] FAILED_STATUS_TABLE_COLUMS = {
        //Constants.COLUMN_PACKAGE,
        ConstantsEmail.COLUMN_CLASS,
        ConstantsEmail.COLUMN_METHOD,
        "",
        ConstantsEmail.COLUMN_TIME,
        ConstantsEmail.STATUS_EXCEPTION};

    String STATUS_FAILED = "FAILED";
    String STATUS_PASSED = "PASSED";
    String STATUS_SKIPPED = "SKIPPED";
    String STATUS_EXCEPTION = "Exception";

    String HEADER_FAILED = "Failed";
    String HEADER_PASSED = "Passed";
    String HEADER_SKIPPED = "Skipped";
    String HEADER_STATSTICS = "Statistic's";

    String PDF_REPORT_FILE_NAME = "pdf-report-"+new SimpleDateFormat("dd-MMM-yyyy").format(new Date())+".pdf";

    String STATISTIC_TABLE_PASSED_HEADER = "Passed";
    String STATISTIC_TABLE_FAILED_HEADER = "Failed";
    String STATISTIC_TABLE_SKIPPED_HEADER = "Skipped";
    String STATISTIC_TABLE_PERCENT_HEADER = "Percent";
    String STATISTIC_TABLE_TOTAL_TIME_HEADER = "Total Time";
    String STATISTIC_TABLE_HEADER_COLOR = "#5BC0DE";
    String SUCCESS_TABLE_HEADER_COLOR = "#5CB85C";
    String FAILED_TABLE_HEADER_COLOR = "#D9534F";
    String SKIPPED_TABLE_HEADER_COLOR = "#F0AD4E";
    String REPORT_XSL_TEMPLATE = "com/uttesh/config/report.xsl";
    String XML_EXTENSION = ".xml";
    String REPORT_CHART_FILE = "chart.png";
    String FORWARD_SLASH = "/";

    public interface SystemProps {

        String REPORT_TITLE_PROP = "pdfreport.title";
        String REPORT_CHART_PROP = "pdfreport.chart";
        String REPORT_LOGGER_PROP = "pdfreport.logger";
        String REPORT_OUPUT_DIR = "pdfreport.outputdir";
    }
}







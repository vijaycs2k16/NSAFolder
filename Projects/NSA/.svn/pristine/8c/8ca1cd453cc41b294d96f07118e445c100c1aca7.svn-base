package com.nsa.testing.pageObjects;

import java.io.IOException;
import java.io.InputStream;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;

public class ReadXmlFile {

	public static Document readFileName(String pathurl)
			throws ParserConfigurationException, SAXException, IOException {

		Document doc = null;
		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();
			InputStream istream = ReadXmlFile.class.getClass()
					.getResourceAsStream(pathurl);
			if (istream.markSupported()) {
				doc = db.parse(istream);
			}

		} catch (Exception e) {
			System.out.println(e);
		}
		return doc;
	}
}

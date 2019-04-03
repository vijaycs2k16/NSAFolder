package com.nsa.testing.tests;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;



import com.nsa.testing.commons.Constants;

public class SendReportMailTest implements Constants {
	
	
	public static void execute(Properties value) {
		String path = "report/pdf-report-"
				+ new SimpleDateFormat("dd-MMM-yyyy").format(new Date())
				+ ".pdf";
		;
		String reportFileName = "Automation-Testing-Report.pdf";
		String toEmailAddress = value.getProperty("to.emailAddress");
		String[] to = toEmailAddress.split(",");
		String ccEmailAddress = value.getProperty("cc.emailAddress");
		String[] cc = ccEmailAddress.split(",");
		String bcEmailAddress = value.getProperty("bcc.emailAddress");
		String[] bcc= bcEmailAddress.split(",");
		
		

		SendReportMailTest.sendMail("kamala@intellishine.com",
				"karpagam@123", "smtp.zoho.com", "465", "true", "true", true,
				"javax.net.ssl.SSLSocketFactory", "false", to, cc, bcc,
				"Automation Testing Report", "Test Message", path, reportFileName);
	}

	public static boolean sendMail(String userName, String passWord,
			String host, String port, String starttls, String auth,
			boolean debug, String socketFactoryClass, String fallback,
			String[] to, String[] cc, String[] bcc, String subject,
			String text, String attachmentPath, String attachmentName) {

		// Object Instantiation of a properties file.
		Properties props = new Properties();

		props.put("mail.smtp.user", userName);

		props.put("mail.smtp.host", host);

		props.put("mail.smtp.password", passWord);

		props.put("mail.smtps.auth", "true");

		if (!"".equals(port)) {
			props.put("mail.smtp.port", port);
		}

		if (!"".equals(starttls)) {
			props.put("mail.smtp.starttls.enable", starttls);
			props.put("mail.smtp.auth", auth);
		}

		if (debug) {

			props.put("mail.smtp.debug", "true");

		} else {

			props.put("mail.smtp.debug", "false");

		}

		if (!"".equals(port)) {
			props.put("mail.smtp.socketFactory.port", port);
		}
		if (!"".equals(socketFactoryClass)) {
			props.put("mail.smtp.socketFactory.class", socketFactoryClass);
		}
		if (!"".equals(fallback)) {
			props.put("mail.smtp.socketFactory.fallback", fallback);
		}

		try {
			props.put("mail.smtp.isSSL", "false");

			Session session = Session.getDefaultInstance(props, null);

			session.setDebug(debug);

			MimeMessage msg = new MimeMessage(session);

			msg.setText(text);

			msg.setSubject(subject);

			Multipart multipart = new MimeMultipart();
			MimeBodyPart messageBodyPart = new MimeBodyPart();
			DataSource source = new FileDataSource(attachmentPath);
			messageBodyPart.setDataHandler(new DataHandler(source));
			messageBodyPart.setFileName(attachmentName);
			multipart.addBodyPart(messageBodyPart);

			msg.setContent(multipart);
			msg.setFrom(new InternetAddress(userName));

			for (int i = 0; i < to.length; i++) {
				msg.addRecipient(Message.RecipientType.TO, new
				InternetAddress(to[i]));
			}

			for (int i = 0; i < cc.length; i++) {
				msg.addRecipient(Message.RecipientType.CC, new InternetAddress(
						cc[i]));
			}

			for (int i = 0; i < bcc.length; i++) {
				msg.addRecipient(Message.RecipientType.BCC,
						new InternetAddress(bcc[i]));
			}

			msg.saveChanges();

			Transport transport = session.getTransport("smtps");

			transport.connect("smtp.zoho.com", "kamala@intellishine.com",
					"karpagam@123");

			transport.sendMessage(msg, msg.getAllRecipients());

			transport.close();

			return true;

		} catch (Exception mex) {
			mex.printStackTrace();
			return false;
		}
	}

}
	
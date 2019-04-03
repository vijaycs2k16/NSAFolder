package nexrise.publication.in.nexrise.Utils;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.NotificationManager;
import android.content.ContentUris;
import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.preference.PreferenceManager;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.style.ForegroundColorSpan;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferUtility;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3Client;
import com.michael.easydialog.EasyDialog;

import org.apache.http.message.BasicHeader;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.File;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import me.leolin.shortcutbadger.ShortcutBadgeException;
import me.leolin.shortcutbadger.ShortcutBadger;
import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.Common.DatabaseHelper;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.PushNotification.MessageReceivingService;
import nexrise.publication.in.nexrise.R;

public class StringUtils implements Constants {
	public static String userRole;
	public static JSONArray taxanomy = null;
	public static JSONArray taxanomyWithourEmployees = null;
	public static ArrayList <Classes> classList = null;
	public static String subject = null;
	public static String assignmentId = "";
	public static String studentId = "";

	private static StringUtils stringUtils = new StringUtils();

	public static StringUtils getInstance() {
		return stringUtils;
	}

	public static boolean isEmpty(String s) {
		if (s == null) {
			return true;
		}
		return s.length() < 1;
	}

	public static boolean isBlank(String s) {
		if (isEmpty(s)) {
			return true;
		}
		return isEmpty(s.trim());
	}

	public String Dateset(String data) {
		String datefinal = "";
		if(data != null && !data.equals("null")) {
			String[] words = data.split("\\s");
			datefinal = words[0] + " " + words[1] + " " + words[2];
		}
		return datefinal;
	}

	public String dateAndMonth(String data) {
		String datefinal = "";
		if(data != null && !data.equals("null")) {
			String[] words = data.split("\\s");
			datefinal = words[0] + " " + words[1]+ " "+words[2];
		}
		return datefinal;
	}

	public String timeSet(String data) {
		try {
			String[] words = data.split("\\s");
			return words[3] + " " + words[4];
		} catch (ArrayIndexOutOfBoundsException e) {
			return " ";
		}
	}

	public String monthDate(String data) {
		String datefinal = "";
		if(data != null && !data.equals("null")) {
			String[] words = data.split("\\s");
			datefinal = words[0] + " " + words[1];
		}
		return datefinal;
	}

	public String monthSet(String data){
		String[] words = data.split("\\s");
		return words[0];
	}
	public String dateSeperate(String data){
		String[] words;
		if(data.contains("T")) {
			 words = data.split("T");
		} else {
			 words = new String[]{data};
		}
		return words[0];
	}
	public Date convertStringToDate(String dateString)
	{
		Date date = null;
		DateFormat df = new SimpleDateFormat("MMM dd yyyy");
		try{
			date = df.parse(dateString);
		}
		catch ( Exception ex ){
			ex.printStackTrace();
		}
		return date;
	}


	public Date dateCompare(String dateString)
	{
		Date date = null;
		DateFormat df = new SimpleDateFormat("MMM dd yyyy");
		try{
			date = df.parse(dateString);
		}
		catch ( Exception ex ){
			ex.printStackTrace();
		}
		return date;
	}

	public Date updatedateCompare(String dateString)
	{
		Date date = null;
		DateFormat df = new SimpleDateFormat("MMM dd yyyy hh:mm a", Locale.ENGLISH);
		try{
			date = df.parse(dateString);
		}
		catch ( Exception ex ){
			ex.printStackTrace();
		}
		return date;
	}

	public Date dateCompare1(String dateString)
	{
		Date date = null;
		DateFormat df = new SimpleDateFormat("dd/MM/yyyy");
		try{
			date = df.parse(dateString);
		}
		catch ( Exception ex ){
			ex.printStackTrace();
		}
		return date;
	}

	public SpannableStringBuilder mandatory(String data){
		String colored = " *";
		SpannableStringBuilder builder1 = new SpannableStringBuilder();
		builder1.append(data);
		int start1 = builder1.length();
		builder1.append(colored);
		int end1 = builder1.length();
		builder1.setSpan(new ForegroundColorSpan(Color.RED), start1, end1,
				Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
		return  builder1;
	}

	public String imageName(String image) {
		String[] imageArray = image.split("/");
		return imageArray[5];
	}
	public String DateFormat(String dateAndTime) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yy-MM-dd'T'HH:mm:ss.SSS");
		Date date = null;
		try {
			date = simpleDateFormat.parse(dateAndTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		SimpleDateFormat postFormater = new SimpleDateFormat("dd/MM/yyyy");
		String formattedDate = postFormater.format(date);

		return formattedDate;
	}

	public Date schoolsActivityDate(String activityDate) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
		Date dateFormat = null;

		try {
			Date date = simpleDateFormat.parse(activityDate);
			SimpleDateFormat postFormatter = new SimpleDateFormat("dd-MM-yyyy", Locale.ENGLISH);
			String formattedDate = postFormatter.format(date);
			dateFormat = new SimpleDateFormat("dd-MM-yyyy", Locale.ENGLISH).parse(formattedDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return dateFormat;
	}

	public String DateFormat1(String dateAndTime) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("MMMdd,yyyy");
		Date date = null;
		try {
			date = simpleDateFormat.parse(dateAndTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		SimpleDateFormat postFormater = new SimpleDateFormat("dd/MM/yyyy");
		String formattedDate = postFormater.format(date);

		return formattedDate;
	}
	public String dobFormat(String dateAndTime) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date date = null;
		try {
			date = simpleDateFormat.parse(dateAndTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		SimpleDateFormat postFormater = new SimpleDateFormat("MMM dd");
		String formattedDate = postFormater.format(date);

		return formattedDate;
	}
	public String periodTime(String periodTime) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("HH:mm:ss");
		Date date = null;
		try {
			date = simpleDateFormat.parse(periodTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		SimpleDateFormat postFormater = new SimpleDateFormat("hh:mm a");
		String formattedTime = postFormater.format(date);

		return formattedTime;
	}

	public String DisplayDate(String dates) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
		Date date = null;
		try {
			date = simpleDateFormat.parse(dates);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		SimpleDateFormat postFormater = new SimpleDateFormat("MMM dd yyyy");
		String formattedDate = postFormater.format(date);
		return formattedDate;
	}

	public String TimeFormat(String dateAndTime) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
		Date date = null;
		try {
			date = simpleDateFormat.parse(dateAndTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		SimpleDateFormat postFormatter = new SimpleDateFormat("HH:MM");
		String formattedTime = postFormatter.format(date);
		return formattedTime;
	}

	public String examDate(String dateAndTime) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS", Locale.getDefault());
		Date date = null;
		try {
			date = simpleDateFormat.parse(dateAndTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		SimpleDateFormat postFormatter = new SimpleDateFormat("dd MMM, yyyy", Locale.getDefault());
		return postFormatter.format(date);
	}

	public String durationTime(String dateAndTime) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy - hh:mm");
		Date date = null;
		try {
			date = simpleDateFormat.parse(dateAndTime);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		SimpleDateFormat postFormatter = new SimpleDateFormat("hh:mm a");
		String formattedTime = postFormatter.format(date);
		return formattedTime;
	}


	public String time12HrFormat (String time) {
		SimpleDateFormat timeFormat = new SimpleDateFormat("hh:mm:ss");
		Date date = null;
		try {
			date = timeFormat.parse(time);

		} catch (ParseException e) {
			e.printStackTrace();
		}
		SimpleDateFormat postFormatter = new SimpleDateFormat("hh:mm a");
		String formattedTime = postFormatter.format(date);
		return formattedTime;
	}
	public HashMap < String, String > stringToMap(String input) {
		HashMap < String, String > castedMap = new HashMap < String, String > ();
		if (!input.equals("null")) {
			input = input.substring(1, input.length() - 1);

			List < String > keyValueList = new ArrayList < > ();
			if (input.contains(",")) {
				String[] split = input.split(",");
				for (String aSplit: split) {
					try {
						String[] token = aSplit.split(":", 2);
						keyValueList.add(token[0]);
						keyValueList.add(token[1]);
					} catch (ArrayIndexOutOfBoundsException e) {
						keyValueList.add(null);
					}
				}
			} else {
				String[] token = input.split(":", 2);
				keyValueList.add(token[0]);
				keyValueList.add(token[1]);
			}
			for (int i = 0; i < keyValueList.size(); i++) {
				try {
					String key = keyValueList.get(i).substring(1, keyValueList.get(i).length() - 1);
					++i;
					String value = keyValueList.get(i).substring(1, keyValueList.get(i).length() - 1);
					castedMap.put(key, value);
				} catch (ArrayIndexOutOfBoundsException e) {
					castedMap.put(null, null);
				}
			}
			return castedMap;
		}
		return castedMap;
	}

	public void setTextColorRed(Context context, TextView textView, String text) {
		if(text.equalsIgnoreCase("Verify selected"))
			textView.setTextColor(context.getResources().getColor(R.color.colorRed));
		else
			textView.setTextColor(context.getResources().getColor(R.color.colorBlack));
	}

	private String id = null;
	public String dayId(String name) {
		switch (name) {
			case "Monday":
				id = "1";
				break;
			case "Tuesday":
				id = "2";
				break;
			case "Wednesday":
				id = "3";
				break;
			case "Thursday":
				id = "4";
				break;
			case "Friday":
				id = "5";
				break;
			case "Saturday":
				id = "6";
				break;
			case "Sunday":
				id = "0";
				break;
		}
		return id;
	}


	public String getCurrentDate() {
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormatter = new SimpleDateFormat("dd/MM/yyyy");
		return dateFormatter.format(calendar.getTime());
	}

	public String getCurrentDate1() {
		Calendar calendar = Calendar.getInstance();
		SimpleDateFormat dateFormatter = new SimpleDateFormat("MMM dd,yyyy");
		return dateFormatter.format(calendar.getTime());

	}


	public static String addToPostParams(String paramKey, String paramValue) {
		if (paramValue != null)
			return paramKey.concat(Constants.PARAMETER_EQUALS).concat(paramValue)
					.concat(Constants.PARAMETER_SEP);
		return "";
	}

	public String getUserRole(Context context) {
		SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
		return preferences.getString(USER_ROLE, null);
	}

	public String getPermission(Context context, String feature) {
		StringBuilder builder = new StringBuilder();
		Log.v("Builder "," "+builder.toString());
		try {
			List<String> permissions = MessageReceivingService.permissions;
			if (permissions != null && permissions.size() != 0) {
				for (int i = 0; i < permissions.size(); i++) {
					if (permissions.get(i).contains(feature))
						builder.append(permissions.get(i)).append(" , ");
				}
			} else {
				SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
				String perm = preferences.getString(PERMISSIONS, null);
				JSONArray permissionAry = new JSONArray(perm);
				for (int i=0; i<permissionAry.length(); i++) {
					MessageReceivingService.permissions.add(permissionAry.getString(i));
					if(MessageReceivingService.permissions.get(i).contains(feature))
						builder.append(MessageReceivingService.permissions.get(i)).append(" , ");
				}
			}
		} catch (JSONException | NullPointerException e) {
			e.printStackTrace();
		}
		return builder.toString();
	}

	public int getPriority(String priorityStr) {
		int priority = 2;
		if (priorityStr.equalsIgnoreCase("high"))
			priority = 1;
		else if (priorityStr.equalsIgnoreCase("medium"))
			priority = 2;
		else if (priorityStr.equalsIgnoreCase("low"))
			priority = 3;

		return priority;
	}
	public String setPriority(int priorityStr) {
		String priority = "";
		if (priorityStr == 1)
			priority = "High";
		else if (priorityStr == 2)
			priority = "Medium";
		else if (priorityStr == 3)
			priority = "Low";

		return priority;
	}

	public void customTooltip(final Activity context, final ImageView help, final String text){
		help.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {

				View view =context.getLayoutInflater().inflate(R.layout.tooltip_layout, null);
				TextView tooltip = (TextView)view.findViewById(R.id.textView53);
				tooltip.setText(text);

				tooltip.setTextColor(context.getResources().getColor(R.color.colorWhite));
				new EasyDialog(context).setLayout(view)
						.setLocationByAttachedView(help)
						.setGravity(EasyDialog.GRAVITY_BOTTOM)
						.setTouchOutsideDismiss(true)
						.setMatchParent(false)
						.setBackgroundColor(context.getResources().getColor(R.color.colorGreen))
						.setMarginLeftAndRight(44,34)
						.show();
			}
		});
	}

	@SuppressLint("NewApi")
	public String getPath(Uri uri, Context context) throws URISyntaxException {
		final boolean checkUri = Build.VERSION.SDK_INT >= 19;
		String selection = null;
		String[] selectionArgs = null;
		if (checkUri && DocumentsContract.isDocumentUri(context, uri)) {
			if (isExternalStorageDocument(uri)) {
				final String docId = DocumentsContract.getDocumentId(uri);
				final String[] split = docId.split(":");
				return Environment.getExternalStorageDirectory() + "/" + split[1];
			} else if (isDownloadsDocument(uri)) {
				final String id = DocumentsContract.getDocumentId(uri);
				uri = ContentUris.withAppendedId(
						Uri.parse("content://downloads/public_downloads"), Long.valueOf(id));
			} else if (isMediaDocument(uri)) {
				final String docId = DocumentsContract.getDocumentId(uri);
				final String[] split = docId.split(":");
				final String type = split[0];
				if ("image".equals(type)) {
					uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
				} else if ("video".equals(type)) {
					uri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
				} else if ("audio".equals(type)) {
					uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
				}
				selection = "_id=?";
				selectionArgs = new String[] {
						split[1]
				};
			}
		}
		if ("content".equalsIgnoreCase(uri.getScheme())) {
			String[] projection = {
					MediaStore.Images.Media.DATA
			};
			Cursor cursor = null;
			try {
				cursor = context.getContentResolver()
						.query(uri, projection, selection, selectionArgs, null);
				assert cursor != null;
				int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
				if (cursor.moveToFirst()) {
					String columnIndex = cursor.getString(column_index);
					cursor.close();
					return columnIndex;
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else if ("file".equalsIgnoreCase(uri.getScheme())) {
			return uri.getPath();
		}
		return null;
	}

	/**
	 * @param uri The Uri to check.
	 * @return Whether the Uri authority is ExternalStorageProvider.
	 */
	private static boolean isExternalStorageDocument(Uri uri) {
		return "com.android.externalstorage.documents".equals(uri.getAuthority());
	}

	/**
	 * @param uri The Uri to check.
	 * @return Whether the Uri authority is DownloadsProvider.
	 */
	private static boolean isDownloadsDocument(Uri uri) {
		return "com.android.providers.downloads.documents".equals(uri.getAuthority());
	}

	/**
	 * @param uri The Uri to check.
	 * @return Whether the Uri authority is MediaProvider.
	 */
	private static boolean isMediaDocument(Uri uri) {
		return "com.android.providers.media.documents".equals(uri.getAuthority());
	}

	public TransferUtility getTransferUtility(Context context) {
		AWSCredentials credentials = new AWSCredentials() {
			@Override
			public String getAWSAccessKeyId() {
				return ACCESS_KEY;
			}

			@Override
			public String getAWSSecretKey() {
				return SECRET_ACCESS_KEY;
			}
		};
		AmazonS3Client s3Client = new AmazonS3Client(credentials);
		s3Client.setRegion(Region.getRegion(Regions.AP_SOUTH_1));
		return new TransferUtility(s3Client, context);
	}

	public String getAppname(Context context) {
		return context.getResources().getString(R.string.app_name);
	}

	public void createDirectory(Context context) {
		SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
		String appName = getAppname(context);
		File directory = new File(Environment.getExternalStoragePublicDirectory(appName), "Media");
		if(!directory.exists())
			directory.mkdirs();

		File images = new File(directory, "Images");
		if (!images.exists())
			images.mkdir();
		Log.v("Images", " path " + images);

		File docs = new File(directory, "Documents");
		if (!docs.exists())
			docs.mkdir();
		Log.v("docs", " path " + docs);
		File videos = new File(directory, "Videos");
		if (!videos.exists())
			videos.mkdir();

		File audios = new File(directory, "Audios");
		if (!audios.exists())
			audios.mkdir();

		SharedPreferences.Editor editor = preferences.edit();
		editor.putString(IMAGES_PATH, images.getAbsolutePath());
		editor.putString(DOCUMENTS_PATH, docs.getAbsolutePath());
		editor.putString(VIDEO_PATH, videos.getAbsolutePath());
		editor.putString(AUDIO_PATH, audios.getAbsolutePath());
		editor.apply();

	}

	public String millsecondToDuration(int milliseconds) {
		int seconds = (int) ((milliseconds / 1000) % 60);
		int minutes = (int) ((milliseconds / 1000) / 60);

		return minutes + " : " + seconds;
	}

	public BasicHeader[] getHeaders(Context context) {
		SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
		return new BasicHeader[]{
				new BasicHeader("Accept","application/json")
				,new BasicHeader("Content-Type","application/json")
				,new BasicHeader("academic_year",preferences.getString(CURRENT_ACADEMIC_YEAR, null))
				,new BasicHeader("session-id", preferences.getString(SESSION_TOKEN, null))
		};
	}

	public BasicHeader[] getHeadersWithoutSession(Context context) {
		SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
		return new BasicHeader[]{
				new BasicHeader("Accept","application/json")
				,new BasicHeader("Content-Type","application/json")
				,new BasicHeader("academic_year",preferences.getString(CURRENT_ACADEMIC_YEAR, null))
		};
	}

	public BasicHeader[] headers(Context context, String id) {
		SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
		return new BasicHeader[]{
				new BasicHeader("Accept","application/json")
				,new BasicHeader("Content-Type","application/json")
				,new BasicHeader("academic_year",preferences.getString(CURRENT_ACADEMIC_YEAR, null))
				,new BasicHeader("session-id", preferences.getString(SESSION_TOKEN, null))
				,new BasicHeader("id", id)
		};
	}

	public BasicHeader[] fileUploadHeader(Context context, String id, String uploadId) {
		SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
		if (uploadId != null && uploadId.isEmpty()) {
			return new BasicHeader[]{
					new BasicHeader("academic_year",preferences.getString(CURRENT_ACADEMIC_YEAR, null))
					, new BasicHeader("session-id", preferences.getString(SESSION_TOKEN, null))
					, new BasicHeader(ID, id)
			};
		} else {
			return new BasicHeader[]{
					new BasicHeader("academic_year",preferences.getString(CURRENT_ACADEMIC_YEAR, null))
					, new BasicHeader("session-id", preferences.getString(SESSION_TOKEN, null))
					, new BasicHeader(ID, id)
					, new BasicHeader(UPLOAD_ID, uploadId)
			};
		}
	}

	public List<Classes> insertNoneIntoClassSectionSpinner(List<Classes> classesList) {
		try {
			if (classesList.size() > 0 && !classesList.get(0).getLabel().equalsIgnoreCase("None")) {
				Classes classes = new Classes();
				classes.setLabel("None");
				Classes section = new Classes();
				section.setLabel("None");
				ArrayList<Classes> sectionList = new ArrayList<>();
				sectionList.add(section);
				classes.setSections(sectionList);
				classesList.add(0, classes);
			}
		} catch (NullPointerException e) {
			e.getMessage();
		}
		return classesList;
	}

	public void checkSession(String response) {
		if(response != null && response.contains("Not Valid Session"))
			throw SessionExpiredException.getInstance();
	}

	public void appIconNotificationCount(Context context, int count) {
		try {
			ShortcutBadger.applyCountOrThrow(context, count);
		} catch (ShortcutBadgeException e) {
			Log.i("SHORTCUT","BADGER EXCEPTION");
		}
	}

	public boolean isNetworkConnected(Context context) {
		ConnectivityManager cm = (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
		NetworkInfo ni = cm.getActiveNetworkInfo();
		if (ni == null) {
			// There are no active networks.
			Toast.makeText(context,R.string.please_check_internet_connection,Toast.LENGTH_LONG).show();
		}
		return false;
	}

	public void cancelAllNotification(Context context) {
		try {
			NotificationManager notificationManager = (NotificationManager) context.getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
			notificationManager.cancelAll();
		} catch (NullPointerException e) {
			e.printStackTrace();
		}
	}

	public Date today(){
		DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		Date todayWithZeroTime = null;
		try {
			Date today = new Date();
			todayWithZeroTime = formatter.parse(formatter.format(today));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return todayWithZeroTime;
	}

	public void reduceNotificationCount(Context context, String featureId) {
		SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
		DatabaseHelper helper = new DatabaseHelper(context);
		String classId = preferences.getString(CLASS_ID, null);
		String sectionId = preferences.getString(SECTION_ID, null);
		String schoolId = preferences.getString(SCHOOL_ID, null);
		String userId = preferences.getString(CURRENT_USERNAME, null);

		helper.reduceNotificationCount(classId, sectionId, featureId, schoolId, userId);
	}

	public boolean notificationForActiveUser(Context context, String classId, String sectionId, String schoolId, String userId) {
		SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
		boolean status = false;
		String classid = preferences.getString(CLASS_ID, null);
		String sectionid = preferences.getString(SECTION_ID, null);
		String schoolid = preferences.getString(SCHOOL_ID, null);
		String userid = preferences.getString(CURRENT_USERNAME, null);
		// For employee login no classId and sectionId will be there so it is considered as " - "
		if(classId == null && sectionId == null) {
			return true;
		}
		if(classId.equals(classid) && sectionId.equals(sectionid) && schoolId.equals(schoolid) && userId.equals(userid))
			status = true;

		return status;
	}

	public int getNotificationCount(Context context, String featureId) {
		SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
		String classid = preferences.getString(CLASS_ID, null);
		String sectionid = preferences.getString(SECTION_ID, null);
		String schoolid = preferences.getString(SCHOOL_ID, null);
		String userid = preferences.getString(CURRENT_USERNAME, null);

		return new DatabaseHelper(context).getCount(classid, sectionid, featureId, schoolid, userid);
	}
}
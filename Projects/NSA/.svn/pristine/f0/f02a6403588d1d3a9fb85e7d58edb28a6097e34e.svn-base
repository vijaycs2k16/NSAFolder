package nexrise.publication.in.nexrise.PushNotification;

/*
 * Copyright 2014 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import android.content.Context;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.os.AsyncTask;
import android.preference.PreferenceManager;
import android.util.Log;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClient;
import com.amazonaws.services.sns.model.MessageAttributeValue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import nexrise.publication.in.nexrise.Common.AwsProperties;
import nexrise.publication.in.nexrise.Common.DatabaseHelper;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.URLConnection.UPDATEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

class SNSMobilePush extends AsyncTask<String, String, String> implements Constants{

	private nexrise.publication.in.nexrise.PushNotification.AmazonSNSClientWrapper snsClientWrapper;
	private Context context;

	SNSMobilePush(Context context) {
		this.context = context;
	}

	private SNSMobilePush(AmazonSNS snsClient, Context context) {
		this.snsClientWrapper = new AmazonSNSClientWrapper(snsClient);
		this.context = context;
	}

	@Override
	protected String doInBackground(String... params) {
		AmazonSNS sns = new AmazonSNSClient(new AwsProperties(ACCESS_KEY, SECRET_ACCESS_KEY));

		sns.setEndpoint("https://sns.us-west-2.amazonaws.com");
		Log.v("=====","");
		Log.v("Getting"," Started with Amazon SNS");

		try {
			SNSMobilePush sample = new SNSMobilePush(sns, context);
			//params[0] contains registration id
			sample.saveEndpointArn(params[0], context);

		} catch (AmazonServiceException ase) {
			SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
			SharedPreferences.Editor editor = preferences.edit();
			editor.putString(ENDPOINT_ARN, " ");
			editor.apply();

			saveAWSCredentialsCloud(context);

			System.out
					.println("Caught an AmazonServiceException, which means your request made it "
							+ "to Amazon SNS, but was rejected with an error response for some reason.");
			System.out.println("Error Message:    " + ase.getMessage());
			System.out.println("HTTP Status Code: " + ase.getStatusCode());
			System.out.println("AWS Error Code:   " + ase.getErrorCode());
			System.out.println("Error Type:       " + ase.getErrorType());
			System.out.println("Request ID:       " + ase.getRequestId());
		} catch (AmazonClientException ace) {
			SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
			SharedPreferences.Editor editor = preferences.edit();
			editor.putString(ENDPOINT_ARN, " ");
			editor.apply();

			saveAWSCredentialsCloud(context);

			System.out
					.println("Caught an AmazonClientException, which means the client encountered "
							+ "a serious internal problem while trying to communicate with SNS, such as not "
							+ "being able to access the network.");
			System.out.println("Error Message: " + ace.getMessage());
		}
		return null;
	}

	private static final Map<SampleMessageGenerator.Platform, Map<String, MessageAttributeValue>> attributesMap = new HashMap<SampleMessageGenerator.Platform, Map<String, MessageAttributeValue>>();
	static {
		attributesMap.put(SampleMessageGenerator.Platform.ADM, null);
		attributesMap.put(SampleMessageGenerator.Platform.GCM, null);
		attributesMap.put(SampleMessageGenerator.Platform.APNS, null);
		attributesMap.put(SampleMessageGenerator.Platform.APNS_SANDBOX, null);
	}

	private void saveEndpointArn(String regId, Context messageReceivingServiceContext) {
		String serverAPIKey = SERVER_APIKEY;
		String applicationName = "nexschoolapp";

		String endpointArn = snsClientWrapper.generateEndpointARN(SampleMessageGenerator.Platform.GCM, "", serverAPIKey,
				regId, applicationName, attributesMap);
		SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(messageReceivingServiceContext);
		SharedPreferences.Editor editor = preferences.edit();
		editor.putString(ENDPOINT_ARN, endpointArn);
		editor.apply();

		saveAWSCredentialsCloud(messageReceivingServiceContext);
	}

	private void saveAWSCredentialsCloud(Context messageReceivingServiceContext) {
		SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(messageReceivingServiceContext);

		String currentUserId = preferences.getString(CURRENT_USER_ID, null);
		String current_userName = preferences.getString(CURRENT_USERNAME, null);
		String regId = preferences.getString(REGISTRATION_ID, null);
		String endpointArn = preferences.getString(ENDPOINT_ARN, null);

		DatabaseHelper helper = new DatabaseHelper(messageReceivingServiceContext);
		Cursor cursor = helper.getPreferenceValues();

		if(StringUtils.getInstance().getUserRole(messageReceivingServiceContext).equalsIgnoreCase("employee") || cursor.getCount() == 0) {
			JSONObject updateJson = new JSONObject();

			try {
				updateJson.put("id", currentUserId);
				updateJson.put("username", current_userName);
				updateJson.put("registrationId", regId);
				updateJson.put("endpointARN", endpointArn);
				Log.v("User ", "update json " + updateJson);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			String url = BASE_URL + API_VERSION_ONE + USER;
			UPDATEUrlConnection updateUser = new UPDATEUrlConnection(context, url, null, updateJson) {
				@Override
				protected void onPostExecute(String s) {
					super.onPostExecute(s);
					Log.v("update", "response" + s);
					try {
						JSONObject jsonObject = new JSONObject(s);
						boolean sucess = jsonObject.getBoolean(SUCCESS);
					/*if(sucess)
						Toast.makeText(context, "User updated", Toast.LENGTH_SHORT).show();
					else
						Toast.makeText(context, "User update failed", Toast.LENGTH_SHORT).show();*/
					} catch (JSONException | NullPointerException e) {
						e.printStackTrace();
					}
				}
			};
			updateUser.execute();
		} else {
			cursor.moveToFirst();
			String json = cursor.getString(cursor.getColumnIndex(helper.VALUE));
			cursor.close();
			JSONObject updateJson = new JSONObject();
			try {
				JSONArray dataAry = new JSONArray(json);
				JSONArray usernames = new JSONArray();

				for (int i=0; i<dataAry.length(); i++) {
					JSONObject obj = dataAry.getJSONObject(i);
					String userName = obj.getString("user_name");
					usernames.put(userName);
				}
				updateJson.putOpt("username", usernames);
				updateJson.put("registrationId", regId);
				updateJson.put("endpointARN", endpointArn);
				Log.v("User ", "update json DB " + updateJson);
			} catch (JSONException e) {
				e.printStackTrace();
				return;
			}

			String url = BASE_URL + API_VERSION_ONE + USER + SIBLINGS;
			UPDATEUrlConnection updateUser = new UPDATEUrlConnection(context, url, null, updateJson) {
				@Override
				protected void onPostExecute(String s) {
					super.onPostExecute(s);
					Log.v("update", "response" + s);
					try {
						JSONObject jsonObject = new JSONObject(s);
						boolean sucess = jsonObject.getBoolean(SUCCESS);
					/*if(sucess)
						Toast.makeText(context, "User updated", Toast.LENGTH_SHORT).show();
					else
						Toast.makeText(context, "User update failed", Toast.LENGTH_SHORT).show();*/
					} catch (JSONException | NullPointerException e) {
						e.printStackTrace();
					}
				}
			};
			updateUser.execute();
		}
	}
}

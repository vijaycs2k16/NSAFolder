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

import android.util.Log;

import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.model.CreatePlatformApplicationRequest;
import com.amazonaws.services.sns.model.CreatePlatformApplicationResult;
import com.amazonaws.services.sns.model.CreatePlatformEndpointRequest;
import com.amazonaws.services.sns.model.CreatePlatformEndpointResult;
import com.amazonaws.services.sns.model.DeletePlatformApplicationRequest;
import com.amazonaws.services.sns.model.MessageAttributeValue;
import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.PublishResult;

import java.util.HashMap;
import java.util.Map;

import nexrise.publication.in.nexrise.Utils.StringUtils;

public class AmazonSNSClientWrapper {

	private final AmazonSNS snsClient;

	public AmazonSNSClientWrapper(AmazonSNS client) {
		this.snsClient = client;
	}

	private CreatePlatformApplicationResult createPlatformApplication(
			String applicationName, SampleMessageGenerator.Platform platform, String principal,
			String credential) {
		CreatePlatformApplicationRequest platformApplicationRequest = new CreatePlatformApplicationRequest();
		Map<String, String> attributes = new HashMap<String, String>();
		attributes.put("PlatformPrincipal", principal);
		attributes.put("PlatformCredential", credential);
		platformApplicationRequest.setAttributes(attributes);
		platformApplicationRequest.setName(applicationName);
		platformApplicationRequest.setPlatform(platform.name());

		return snsClient.createPlatformApplication(platformApplicationRequest);
	}

	private CreatePlatformEndpointResult createPlatformEndpoint(
			SampleMessageGenerator.Platform platform, String customData, String platformToken,
			String applicationArn) {
		CreatePlatformEndpointRequest platformEndpointRequest = new CreatePlatformEndpointRequest();
		platformEndpointRequest.setCustomUserData(customData);
		String token = platformToken;
		String userId = null;
		if (platform == SampleMessageGenerator.Platform.BAIDU) {
			String[] tokenBits = platformToken.split("\\|");
			token = tokenBits[0];
			userId = tokenBits[1];
			Map<String, String> endpointAttributes = new HashMap<String, String>();
			endpointAttributes.put("UserId", userId);
			endpointAttributes.put("ChannelId", token);
			platformEndpointRequest.setAttributes(endpointAttributes);
		}
		platformEndpointRequest.setToken(token);
		platformEndpointRequest.setPlatformApplicationArn(applicationArn);
		return snsClient.createPlatformEndpoint(platformEndpointRequest);
	}

	private void deletePlatformApplication(String applicationArn) {
		DeletePlatformApplicationRequest request = new DeletePlatformApplicationRequest();
		request.setPlatformApplicationArn(applicationArn);
		snsClient.deletePlatformApplication(request);
	}

	private PublishResult publish(String endpointArn, SampleMessageGenerator.Platform platform,
			Map<SampleMessageGenerator.Platform, Map<String, MessageAttributeValue>> attributesMap, int roomNumber) {
		PublishRequest publishRequest = new PublishRequest();
		Map<String, MessageAttributeValue> notificationAttributes = getValidNotificationAttributes(attributesMap
				.get(platform));
		if (notificationAttributes != null && !notificationAttributes.isEmpty()) {
			publishRequest.setMessageAttributes(notificationAttributes);
		}
		publishRequest.setMessageStructure("json");

		if(roomNumber != 0) {
			Log.v("Room ","number "+roomNumber);
		}
		// If the message attributes are not set in the requisite method,
		// notification is sent with default attributes
		String message = getPlatformSampleMessage(platform);
		Map<String, String> messageMap = new HashMap<String, String>();
		messageMap.put(platform.name(), message);
		message = SampleMessageGenerator.jsonify(messageMap);
		// For direct publish to mobile end points, topicArn is not relevant.
		publishRequest.setTargetArn(endpointArn);

		// Display the message that will be sent to the endpoint/
		System.out.println("{Message Body: " + message + "}");
		StringBuilder builder = new StringBuilder();
		builder.append("{Message Attributes: ");
		for (Map.Entry<String, MessageAttributeValue> entry : notificationAttributes
				.entrySet()) {
			builder.append("(\"" + entry.getKey() + "\": \""
					+ entry.getValue().getStringValue() + "\"),");
		}
		builder.deleteCharAt(builder.length() - 1);
		builder.append("}");
		System.out.println(builder.toString());

		publishRequest.setMessage(message);
		return snsClient.publish(publishRequest);
	}

	public String generateEndpointARN(SampleMessageGenerator.Platform platform, String principal,
									  String credential, String platformToken, String applicationName,
									  Map<SampleMessageGenerator.Platform, Map<String, MessageAttributeValue>> attrsMap) {
		// Create Platform Application. This corresponds to an app on a
		// platform.
		CreatePlatformApplicationResult platformApplicationResult = createPlatformApplication(
				applicationName, platform, principal, credential);
		Log.v("platform endpoint "," "+platformApplicationResult);

		// The Platform Application Arn can be used to uniquely identify the
		// Platform Application.
		String platformApplicationArn = platformApplicationResult
				.getPlatformApplicationArn();

		// Create an Endpoint. This corresponds to an app on a device.
		CreatePlatformEndpointResult platformEndpointResult = createPlatformEndpoint(
				platform,
				"CustomData - Useful to store endpoint specific data",
				platformToken, platformApplicationArn);
		System.out.println(platformEndpointResult);
		Log.v("Endpoint ","Arn "+platformEndpointResult.getEndpointArn());
		/*PublishResult publishResult = publish(
				platformEndpointResult.getEndpointArn(),
				platform, attrsMap, 0);*/
		
		return platformEndpointResult.getEndpointArn();
	}

	public void demoNotification(SampleMessageGenerator.Platform platform, String principal,
								 String credential, String platformToken, String applicationName,
								 Map<SampleMessageGenerator.Platform, Map<String, MessageAttributeValue>> attrsMap) {
		// Create Platform Application. This corresponds to an app on a
		// platform.
		CreatePlatformApplicationResult platformApplicationResult = createPlatformApplication(
				applicationName, platform, principal, credential);
		Log.v("platform endpoint "," "+platformApplicationResult);

		// The Platform Application Arn can be used to uniquely identify the
		// Platform Application.
		String platformApplicationArn = platformApplicationResult
				.getPlatformApplicationArn();

		// Create an Endpoint. This corresponds to an app on a device.
		CreatePlatformEndpointResult platformEndpointResult = createPlatformEndpoint(
				platform,
				"CustomData - Useful to store endpoint specific data",
				platformToken, platformApplicationArn);
		System.out.println(platformEndpointResult);
		Log.v("Endpoint ","Arn "+platformEndpointResult.getEndpointArn());

		// Publish a push notification to an Endpoint.
		/*PublishResult publishResult = publish(
				platformEndpointResult.getEndpointArn(), platform, attrsMap);
		System.out.println("Published! \n{MessageId="
				+ publishResult.getMessageId() + "}");*/
		// Delete the Platform Application since we will no longer be using it.
	//	deletePlatformApplication(platformApplicationArn);

		/*AmazonSQS sqs = new AmazonSQSClient(new AwsProperties("AKIAIH4L2MHZT5OOYA7Q", "rwHFHAbgz4qwEVHfzoRdPJU/jpn9j5AmxLdsjU8m"));
		AmazonSNS sns = new AmazonSNSClient(new AwsProperties("AKIAIH4L2MHZT5OOYA7Q", "rwHFHAbgz4qwEVHfzoRdPJU/jpn9j5AmxLdsjU8m"));
		sqs.setRegion(Region.getRegion(Regions.US_WEST_2));
		sns.setRegion(Region.getRegion(Regions.US_WEST_2));

		String topicARN = sns.createTopic(new CreateTopicRequest("Test")).getTopicArn();
		String sqsTopic = sqs.createQueue(new CreateQueueRequest("TestQueue")).getQueueUrl();
		Topics.subscribeQueue(sns, sqs, topicARN, sqsTopic);*/

	//	sns.publish(new PublishRequest(topicARN, "This message is to check whether push notification is working correctly or not"));
		/*List<Message> messages 	= sqs.receiveMessage(new ReceiveMessageRequest(sqsTopic)).getMessages();
		if(messages.size()>0){
			byte[] decoded =messages.get(0).getBody().getBytes();
			Log.v("Decoded ","bytes "+ new String(decoded));
		}*/
		/*SubscribeRequest subscribeRequest = new SubscribeRequest(topicARN, "application","arn:aws:sns:us-west-2:806468344192:endpoint/GCM/nnexrise/510313db-db05-3cd1-99f3-93ef847822c0");
		snsClient.subscribe(subscribeRequest);*/

	/*	String endpoinrARN[] = {"arn:aws:sns:us-west-2:806468344192:endpoint/GCM/NexSchoolApp/57405582-3d4e-37da-8ac1-d8afbc962c84",
				"arn:aws:sns:us-west-2:806468344192:endpoint/GCM/NexSchoolApp/ea5306f6-afd8-3ddf-9650-b8475b1f8f73",
				"arn:aws:sns:us-west-2:806468344192:endpoint/GCM/NexSchoolApp/6a2242f0-a1f6-3112-bea4-6d969879ba59"};


		SubscribeRequest subscribeRequest1 = new SubscribeRequest(topicARN, "application", platformEndpointResult.getEndpointArn());
		snsClient.subscribe(subscribeRequest1);*/

	/*	PublishRequest publishRequest = new PublishRequest(topicARN,"HAI this this the message published via topic");
		PublishResult publishResult = snsClient.publish(publishRequest);*/

	//	Log.v("Published"," message "+publishResult.getMessageId());

	//	publishToTopic(topicARN);

	}

	public void demo(SampleMessageGenerator.Platform platform, String principal,
					 String credential, String platformToken, String applicationName,
					 Map<SampleMessageGenerator.Platform, Map<String, MessageAttributeValue>> attrsMap, int roomNumber){

		// This endpoint belongs to poojitha's mobile
		//arn:aws:sns:us-west-2:806468344192:endpoint/GCM/NexSchoolApp/b2c60795-c9f3-3f97-ae9a-0f130b51207e

		// Pragadeesh mobile endpoint
		// arn:aws:sns:us-west-2:806468344192:endpoint/GCM/NexSchoolApp/c75937fc-8c1f-3cc2-9077-45349dfa132f
		Log.v("Given arn ","triggered");
		PublishResult publishResult = publish(
				platformToken,
				platform, attrsMap, roomNumber);
		System.out.println("Published! \n{MessageId="
				+ publishResult.getMessageId() + "}");


	}

	public void publishToTopic(String topicARN){
		PublishRequest publishRequest = new PublishRequest(topicARN,"HAI this this the message published via topic");
		PublishResult publishResult = snsClient.publish(publishRequest);

		Log.v("Published"," message "+publishResult.getMessageId());

	}

	private String getPlatformSampleMessage(SampleMessageGenerator.Platform platform) {
		switch (platform) {
		case APNS:
			return SampleMessageGenerator.getSampleAppleMessage();
		case APNS_SANDBOX:
			return SampleMessageGenerator.getSampleAppleMessage();
		case GCM:
			return SampleMessageGenerator.getSampleAndroidMessage();
		case ADM:
			return SampleMessageGenerator.getSampleKindleMessage();
		case BAIDU:
			return SampleMessageGenerator.getSampleBaiduMessage();
		case WNS:
			return SampleMessageGenerator.getSampleWNSMessage();
		case MPNS:
			return SampleMessageGenerator.getSampleMPNSMessage();
		default:
			throw new IllegalArgumentException("Platform not supported : "
					+ platform.name());
		}
	}

	private String videoCallSampleMessage(SampleMessageGenerator.Platform platform, int roomNo){
		switch (platform) {
			case APNS:
				return SampleMessageGenerator.getSampleAppleMessage();
			case APNS_SANDBOX:
				return SampleMessageGenerator.getSampleAppleMessage();
			case GCM:
				return SampleMessageGenerator.videoCallSampleMessage(roomNo);
			case ADM:
				return SampleMessageGenerator.getSampleKindleMessage();
			case BAIDU:
				return SampleMessageGenerator.getSampleBaiduMessage();
			case WNS:
				return SampleMessageGenerator.getSampleWNSMessage();
			case MPNS:
				return SampleMessageGenerator.getSampleMPNSMessage();
			default:
				throw new IllegalArgumentException("Platform not supported : "
						+ platform.name());
		}
	}

	public static Map<String, MessageAttributeValue> getValidNotificationAttributes(
			Map<String, MessageAttributeValue> notificationAttributes) {
		Map<String, MessageAttributeValue> validAttributes = new HashMap<String, MessageAttributeValue>();

		if (notificationAttributes == null) return validAttributes;

		for (Map.Entry<String, MessageAttributeValue> entry : notificationAttributes
				.entrySet()) {
			if (!StringUtils.isBlank(entry.getValue().getStringValue())) {
				validAttributes.put(entry.getKey(), entry.getValue());
			}
		}
		return validAttributes;
	}
}

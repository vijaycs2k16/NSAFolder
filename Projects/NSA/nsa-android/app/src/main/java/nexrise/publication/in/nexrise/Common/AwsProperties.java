package nexrise.publication.in.nexrise.Common;

import com.amazonaws.auth.AWSCredentials;

/**
 * created by karthik on 16-11-2016.
 */

public class AwsProperties implements AWSCredentials {
    private final String accessKey;
    private final String secretAccessKey;

    public AwsProperties(String accessKey, String secretAccessKey) {
        this.accessKey = accessKey;
        this.secretAccessKey = secretAccessKey;
    }

    @Override
    public String getAWSAccessKeyId() {
        return accessKey;
    }

    @Override
    public String getAWSSecretKey() {
        return secretAccessKey;
    }
}

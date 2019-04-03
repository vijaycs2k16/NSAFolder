package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by karthik on 16-03-2017.
 */

public class Conversation implements Serializable{
    public static final int TYPE_MESSAGE = 0;
    public static final int TYPE_LOG = 1;
    public static final int TYPE_ACTION = 2;

    private int mType;
    private String conversation_id;
    private String feature_id;
    private String feature_detail_id;
    private String admission_no;
    private String user_name;
    private String name;
    private String class_id;
    private String class_name;
    private String section_id;
    private String section_name;
    private String message;
    private Boolean message_read;
    private String message_date;
    private String roomId;

    public int getType() {
        return mType;
    }

    public String getConversation_id() {
        return conversation_id;
    }

    public String getFeature_id() {
        return feature_id;
    }

    public String getFeature_detail_id() {
        return feature_detail_id;
    }

    public String getAdmission_no() {
        return admission_no;
    }

    public String getUser_name() {
        return user_name;
    }

    public String getName() {
        return name;
    }

    public String getClass_id() {
        return class_id;
    }

    public String getClass_name() {
        return class_name;
    }

    public String getSection_id() {
        return section_id;
    }

    public String getSection_name() {
        return section_name;
    }

    public String getMessage() {
        return message;
    }

    public Boolean getMessage_read() {
        return message_read;
    }

    public String getMessage_date() {
        return message_date;
    }

    public String getRoomId() {
        return roomId;
    }

    public static class Builder {

        private int mType;
        private String mConversation_id;
        private String mFeature_id;
        private String mFeature_detail_id;
        private String mAdmission_no;
        private String mUser_name;
        private String mName;
        private String mClass_id;
        private String mClass_name;
        private String mSection_id;
        private String mSection_name;
        private String mMssage;
        private Boolean mMessage_read;
        private String mMessage_date;
        private String mRoomId;

        public Builder (int type) {
            mType = type;
        }

        public Builder conversation_id(String conversation_id) {
            mConversation_id = conversation_id;
            return this;
        }

        public Builder feature_id(String feature_id) {
            mFeature_id = feature_id;
            return this;
        }

        public Builder feature_detail_id(String feature_detail_id) {
            mFeature_detail_id = feature_detail_id;
            return this;
        }

        public Builder admission_no(String admission_no) {
            mAdmission_no = admission_no;
            return this;
        }

        public Builder username(String username) {
            mUser_name = username;
            return this;
        }

        public Builder name(String name) {
            mName = name;
            return this;
        }

        public Builder class_id(String class_id) {
            mClass_id = class_id;
            return this;
        }

        public Builder class_name(String class_name) {
            mClass_name = class_name;
            return this;
        }

        public Builder section_id(String section_id) {
            mSection_id = section_id;
            return this;
        }

        public Builder section_name(String section_name) {
            mSection_name = section_name;
            return this;
        }

        public Builder message(String message) {
            mMssage = message;
            return this;
        }

        public Builder message_read(Boolean message_read) {
            mMessage_read = message_read;
            return this;
        }

        public Builder message_date(String message_date) {
            mMessage_date = message_date;
            return this;
        }

        public Builder roomId(String roomId) {
            mRoomId = roomId;
            return this;
        }

        public Conversation build() {
            Conversation conversation = new Conversation();
            conversation.conversation_id = mConversation_id;
            conversation.feature_id = mFeature_id;
            conversation.feature_detail_id = mFeature_detail_id;
            conversation.admission_no = mAdmission_no;
            conversation.user_name = mUser_name;
            conversation.name = mName;
            conversation.class_id = mClass_id;
            conversation.class_name = mClass_name;
            conversation.section_id = mSection_id;
            conversation.section_name = mSection_name;
            conversation.message = mMssage;
            conversation.message_date = mMessage_date;
            conversation.message_read = mMessage_read;
            conversation.roomId = mRoomId;
            return conversation;
        }
    }
}

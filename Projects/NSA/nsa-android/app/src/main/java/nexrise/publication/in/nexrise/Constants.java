package nexrise.publication.in.nexrise;

/**
 * Created by Sai Deepak on 25-Oct-16.
 */

public interface Constants {

    String TEACHER = "teacher";
    String STUDENT = "student";
    String PARENT = "parent";
    String COMPLETED = "Completed";
    String CURRENT_USERNAME = "current username";  // current username indicates user's login id
    String CURRENT_USER_ID = "current userId";
    String CLASS_NAME = "Class Name";
    String SECTION_NAME ="Section Name";
    String FIRST_NAME = "first name";
    String FEATURE = "feature/";
    String UPLOAD_ID = "uploadid";
    String ID = "id";
    String ACCESS_ID = "8eb846a0-4549-11e7-9543-276f818a8422";
    Double LATITUDE = 13.100125;
    Double LONGITUDE =  80.170255;
    String SCHOOL_NAME = "Nexrise Technologies";
    String BHASHYAM_ACCESS_ID = "85834430-5d87-11e7-8234-4be92e1eb721";
    String SERVICE_DESTROYED = "service destroyed";


    //Shared preference keys
    //ENDPOINT ARN & REGISTRATION ID corressponds to the current user who is in the session
    String ENDPOINT_ARN = "EndpointARN";
    String REGISTRATION_ID = "registration ID";
    String TENANT_ID = "tenant_id";
    String SCHOOL_ID = "school_id";
    String SESSION_TOKEN = "session token";
    String PERMISSIONS = "permissions";
    String PREV_USERNAME = "prev username";
    String CURRENT_CLASS_ID = "current classId";
    String CURRENT_SECTION_ID = "current sectionId";
    String FROM = "From";
    String HOMEWORKFEATURE = "HomeWorActivity";
    String PASTEVENT = "pastEvent";
    String USER_ROLE = "user role";
    String PREV_USER_ID = "prev userId";
    String APP ="app";
    String ACTIVE = "active";
    String LOGGED_OUT = "logged out";
    String PROJECT_NUMBER = "project number";
    String SERVER_API_KEY = "server api key";
    String TAXANOMY_SELECTION = "Taxanomy selection";
    String NOTIFICATION_OBJECT = "notification";
    String MMS_OBJECT = "mms";
    String PAST_EVENT_DETAILS = "Past Event details";
    String EVENT_DETAILS = "Event Details";
    String CHANGE_PASSWORD = "/changepwd/";
    String BUNDLE = "bundle";
    String SUCCESS = "success";
    String FROM_ACTIVITY = "From activity";
    String ACTIONBAR_TITLE = "Actionbar title";
    String DRAFT = "Draft";
    String STATUS = "status";
    String EMPLOYEE ="Employee";
    String SENT = "Sent";
    String CANCELLED = "Cancelled";
    String APPROVED = "Approved";
    String DENY = "Deny";
    String PENDING = "Pending";
    String DEVICE_TOKEN = "deviceToken";
    String DESTROYED = "Destroyed";
    String FEES = "fee";
    String MULTIPLE_USERS = "multiple users";
    String PARENT_USERNAME = "Parent username";
    //URLS

    String BASE_URL = "http://192.168.0.105:3333";
    String API_VERSION_ONE = "/rest/api/v1/nsa/";
    String AUTHENTICATE = "auth";
    String AUTHORIZE = "authorize";
    String ATTENDANCE = "attendance/";
    String ASSIGNMENT = "assignment/";
    String ASSIGN = "assign/";
    String GALLERY = "gallery/";
    String ALL = "all/";
    String ACTIVITY = "activity";
    String DASHBOARD = "dashboard/";
    String CONTACT = "contact/";
    String CONFIG = "config/";
    String CCAVENUE = "ccavenue";
    String CALENDAR = "calendar/";
    String CHANNEL= "channel/";
    String CLASSES = "classes/";
    String CLASS_ID = "classId";
    String SECTION_ID = "sectionId";
    String COMMENTS = "comments/";
    String COMMENT = "comment/";
    String CONVERSATION = "conversation/";
    String DETAILS = "details/";
    String DRIVER = "driver/";
    String EMPLOYEES = "employees/";
    String FEEDBACK = "feedback/";
    String ES = "es/";
    String EMP = "emp/";
    String EXAM = "exam/";
    String SCHEDULE = "schedule/";
    String REMAINING = "remainig/";
    String APPLY = "apply/";
    String TAKEN = "taken/";
    String FEE = "fee/";
    String LEAVE = "leave/";
    String LEAVES = "leaves/";
    String REAMINING = "remaining/";
    String APPROVAL = "approval/";
    String LEAVE_ASSIGN = "leaveassign/";
    String EMPLOYEE_URL = "employee/";
    String CLASS = "class/";
    String SECTION = "/section/";
    String USER = "user/";
    String SIBLINGS = "siblings";
    String PAST = "past/";
    String UPDATE = "update";
    String REQUESTED = "requested/";
    String CREDENTIALS = "/credentials";
    String ACADEMIC_YEAR = "2017-2018";
    String CURRENT_ACADEMIC_YEAR = "ACADEMIC_YEAR";
    String SMS = "sms/";
    String HISTORY = "history/";
    String LOG = "log/";
    String USERS = "users/";
    String SECTIONS = "sections/";
    String SUBJECT = "subject/";
    String MONTH = "month/";
    String YEAR = "year/";
    String ROUTE = "route/";
    String MARKS = "marks/";
    String NOTIFICATIONS = "notifications/";
    String NOTIFICATIONS_DRAFT = "notification/draft/";
    String NOTIFICATION = "notification/";
    String ATTACHMENTS = "attachments/";
    String OVERVIEW = "overview/";
    String TEMPLATES = "templates";
    String DATA = "data";
    String TAXANOMY = "taxanomy/";
    String TIMETABLE = "timetable/";
    String TYPES = "types/";
    String VALIDATE_SESSION = "/validatesession";
    String NOTES = "notes/";
    String EVENTS = "events/";
    String STATISTICS = "statistics/";
    String UPLOAD = "upload";
    String VENUES = "venues";
    String VOICE = "voice/";
    String MESSAGES = "messages/";
    String NOW = "now";
    String AUDIO = "audio/";
    String AUDIOS = "audios";
    String DEVICE = "device/";
    String AWS_BASE_URL = "https://s3.ap-south-1.amazonaws.com/";
    String VIDEO_BASE_URL = "https://player.vimeo.com/video/";
    String TRACKING = "tracking/";
    String VEHICLEALLOCATION = "vehicleallocation/";
    String HOLIDAYS ="holidays/";
    String SCHOOLS = "school";
    String WEEK = "week/";
    String DISABLE_NOTES = "disableNotes";
    String DISABLE_BUTTONS = "disableButtons";
    String DISABLE_SHORTCUT = "disableShortcut";
    String PAGINATION = "?fetchSize=5&pageState=";
    int LENGTH = 15;
    String HALL_OF_FAME = "hallOfFame";
    String PUBLISH = "publish";
    String LOGIN_BG = "loginBackground";
    String MOBILE = "mobile/";

    //CCAvenue
    String PARAMETER_SEP = "&";
    String PARAMETER_EQUALS = "=";
    String TRANS_URL = "http://test.ccavenue.com/transaction/initTrans";

    String COMMAND = "command";
    String WORKING_KEY = "working_key";
    String ACCESS_CODE = "access_code";
    String MERCHANT_ID = "merchant_id";
    String SUB_MERCHANT_ID = "sub merchant id";
    String ORDER_ID = "order_id";
    String AMOUNT = "amount";
    String CURRENCY = "currency";
    String ENC_VAL = "enc_val";
    String REDIRECT_URL = "redirect_url";
    String CANCEL_URL = "cancel_url";
    String RSA_KEY_URL = "http://test.ccavenue.com/transaction/getRSAKey";
    String JSON_URL = "http://test.ccavenue.com/transaction/transaction.do";
    String BILLING_NAME = "billing_name";
    String BILLING_ADDRESS = "billing_address";
    String BILLING_CITY = "billing_city";
    String BILLING_STATE = "billing_state";
    String BILLING_ZIP = "billing_zip";
    String BILLING_COUNTRY = "billing_country";
    String BILLING_TEL = "billing_tel";
    String BILLING_EMAIL = "billing_email";
    String DELIVERY_NAME = "delivery_name";
    String DELIVERY_ADDRESS = "delivery_address";
    String DELIVERY_CITY = "delivery_city";
    String DELIVERY_STATE = "delivery_state";
    String DELIVERY_ZIP = "delivery_zip";
    String DELIVERY_COUNTRY = "delivery_country";
    String DELIVERY_TEL = "delivery_tel";
    String MERCHANT_PARAM1 = "merchant_param1";
    String MERCHANT_PARAM2 = "merchant_param2";
    String MERCHANT_PARAM3 = "merchant_param3";
    String MERCHANT_PARAM4 = "merchant_param4";
    String PAYMENT_OPTION = "payment_option";
    String CARD_TYPE = "card_type";
    String CARD_NAME = "card_name";
    String DATA_ACCEPTED_AT = "data_accept";
    String CARD_NUMBER = "card_number";
    String EXPIRY_MONTH = "expiry_month";
    String EXPIRY_YEAR = "expiry_year";
    String CVV = "cvv_number";
    String LANGUAGE = "language";
    String ISSUING_BANK = "issuing_bank";
    String CUSTOMER_IDENTIFIER = "customer_identifier";
    String SAVE_CARD = "saveCard";
    String EMI_PLAN_ID = "emi_plan_id";
    String EMI_TENURE_ID = "emi_tenure_id";
    String TOTAL_MARKS ="Totalmarks";
    String TOTAL_OBTAINED = "Totalobtained";

    //AWS
    String ACCESS_KEY = "AKIAIJ34EBCU2FQBWG2A";
    String SECRET_ACCESS_KEY = "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";
    String SERVER_APIKEY = "AAAARIvA0-s:APA91bF5eOXD3C5sDmx8fuKNx0lEc4-eTFOdUAq0GpVjYxS33rfDFHwWcrbhIQg6io6W0GdumG5BZ1F36Dlc1mm6MQVSMjZMZPeoS1IwZIkUJ9YpQ8pPyC3dUe-Vl8blR3QYlUWF3Eg5";

    //Feature ID
    String DASHBOARD_FEATURE = "165b1b99-082b-4c44-850b-5f28b0869baf";
    String CALENDAR_FEATURE = "75fea512-5cb8-11e7-a0b7-03fd15564520";
    String ASSIGNMENT_FEATURE = "5d52542c-1361-401e-a25b-8946fed84042";
    String TIMETABLE_FEATURE = "a4afff4d-b478-4634-b4dc-cf1f804162ca";
    String EVENTS_FEATURE = "242f16e9-78a9-4059-bbf4-2fd41afd9f5a";
    String NOTIFICATION_FEATURE = "1";
    String ATTENDANCE_FEATURE = "d882ad48-a55c-4775-986e-56419f417dfe";
    String FEE_MANAGEMENT_FEATURE = "eb1b4177-9ae1-4859-b6e5-f629e60ab5a0";
    String PROGRESS_CARD_FEATURE = "7";
    String TRANSPORT_FEATURE = "7aaecf5e-828c-4819-ab59-1f2df7a58df6";
    String VEHICLE_TRACKING = "eebeb1e5-fb69-4b6f-be9b-c04f18b8cf72";
    String JOURNALS_FEATURE = "6525c4b4-bc26-4b0b-b287-e9177681f31a";
    String PHOTO_GALLERY_FEATURE = "a25005f0-c7d7-47cd-a747-c7227848343f";
    String DRAWER_FRAGMENT = "0";
    String EXAM_FEATURE = "dc1c8fb4-c39c-4972-8c01-36b8912b8c0b";
    String CREATE_ASSIGNMENT = "3172122c-c09d-4b05-ad49-430aacb48a0d";
    String CREATE_EVENT = "c0c8820e-07f9-4744-80df-e5a8fbca2f18";
    String CREATE_NOTIFICATION = "7c76c989-7f45-4724-88df-e59fdd546e2a";
    String CREATE_FEE_MANAGEMENT = "9876ac80-6410-440c-ad25-99d67be2c8fc";
    String CREATE_TIMETABLE = "2bbf5823-9384-4b26-bc45-aba1a11b36a0";
    String CREATE_ATTENDANCE = "05997f8d-e71e-4314-846d-88f353f5013e";
    String CREATE_TRANSPORT = "7aaecf5e-828c-4819-ab59-1f2df7a58df6";
    String CREATE_PHOTO_GALLERY = "6";
    String CREATE_JOURNAL = "564646";
    String CREATE_EXAM = "dc1c8fb4-c39c-4972-8c01-36b8912b8c0b";
    String EXAM_MARK = "91d07260-6c74-42d2-a9b4-1ec253f55ced";
    String LEAVE_APPROVAL_STATUS_ID = "a39c6dd1-fccb-45ff-9cfc-87001acc9d44";
    String APPLY_LEAVE = "73c60a5d-1e2a-46b3-b461-c2bf7927f0fa";
    String HALL_OF_FAME_FEATURE_ID = "5ff5e9c0-2bd6-49c2-84d5-102c5367dd6a";
    String VOICE_MMS_ID = "61beb5c0-20da-4dfe-8f04-98538b5a9153";
    //For channel rendering
    String ASSIGNMENT_FEATURE_ID = "213ec4a2-1b04-4894-9098-d4e7f079961c";
    String EVENTS_FEATURE_ID = "213ec4a2-1b04-4894-9098-d4e7f079961c";
    //For Taxonomy
    String CATEGORY_ID = "45c1e4e8-23b3-43cc-81e8-5999884d51f5";

    //File storage path
    String IMAGES_PATH = "Image path";
    String DOCUMENTS_PATH = "Document path";
    String VIDEO_PATH = "Video path";
    String AUDIO_PATH = "Audio path";
    //Callbacks
    String UPLOADED_IMAGES = "uploaded images";
    String UPLOADED_AUDIOS = "uploaded audios";
    String URL = "url";
    String JSON = "Json";
    String HEADER = "Header";

    //Intent
    String PAST_DATE_FREEZE = "pastDateFreeze";
    String FUTURE_DATE_FREEZE = "futureDateFreeze";
    String EXAM_NAME = "examName";
    String SCHEDULE_ID = "scheduleId";
    String CLASS_SECTION = "classSection";
}
package nexrise.publication.in.nexrise.Common;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.CustomHashMap.Initiater;

/**
 * Created by Karthik on 9/22/17.
 */

public class DatabaseHelper extends SQLiteOpenHelper implements Constants {
    public static String DATABASE_NAME = "NexSchoolApp";
    public String TABLE_NAME = "notification";
    private String ID = "Id";
    public String CLASS_ID = "Class_id";
    public String SECTION_ID = "Section_id";
    private String FEATURE_ID = "Feature_id";
    public String SCHOOL_ID = "School_id";
    public String USER_ID = "User_id";
    private String COUNT = "Notification_count";

    public String PREFERENCES_TABLE = "preferences";
    public String VALUE = "Json_data";

    public String CONFIG = "config";
    public String USER = "user";
    public String CLASS_NAME = "Class_name";
    public String SECTION_NAME = "Section_name";
    public String USER_NAME = "User_name";
    public String SESSION_TOKEN = "Session_token";
    public String FIRST_NAME = "First_name";
    public String PERMISSIONS = "Permissions";

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, 2);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("create table "+TABLE_NAME + " (Id INTEGER PRIMARY KEY AUTOINCREMENT, Class_id TEXT, Section_id TEXT, Feature_id TEXT, School_id TEXT, User_id TEXT, Notification_count INTEGER)");
        db.execSQL("create table "+ PREFERENCES_TABLE + "(Id INTEGER PRIMARY KEY AUTOINCREMENT, Json_data TEXT)" );
        db.execSQL("create table "+USER + "(User_name TEXT PRIMARY KEY, User_id TEXT, Class_id TEXT, Class_name TEXT, Section_id TEXT, Section_name TEXT, School_id TEXT, Session_token TEXT, First_name TEXT, Permissions TEXT)");
        db.execSQL("create table "+CONFIG + "(School_id TEXT PRIMARY KEY, Json_data TEXT)");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int i, int i1) {
        db.execSQL("DROP TABLE IF EXISTS "+TABLE_NAME);
        db.execSQL("DROP TABLE IF EXISTS "+PREFERENCES_TABLE);
        db.execSQL("DROP TABLE IF EXISTS "+USER);
        db.execSQL("DROP TABLE IF EXISTS "+CONFIG);
        onCreate(db);
    }

    public boolean incrementNotificationCount(String classId, String sectionId, String featureId, String schoolId, String userId) {
        SQLiteDatabase database = this.getWritableDatabase();
        Cursor cursor = database.rawQuery("select "+COUNT+ " from "+TABLE_NAME+ " where "+CLASS_ID + PARAMETER_EQUALS + "'"+classId +"'"+" AND "+
                SECTION_ID+ PARAMETER_EQUALS+ "'" + sectionId + "'" + " AND "+
                FEATURE_ID+ PARAMETER_EQUALS + "'" + featureId +"'" + " AND "+
                SCHOOL_ID+ PARAMETER_EQUALS+ "'"+schoolId+"'" + " AND "+ USER_ID+ PARAMETER_EQUALS+ "'"+userId+"'", null);

        ContentValues contentValues = new ContentValues();

        if(cursor.getCount() > 0) {
            while(cursor.moveToNext()) {
                int countInDB = cursor.getInt(0);
                ++countInDB;
                contentValues.put(COUNT, countInDB);
                int val = database.update(TABLE_NAME, contentValues, CLASS_ID+ " = '"+ classId + "' AND " +SECTION_ID+ " = '"+ sectionId+ "' AND " +FEATURE_ID+ " = '"+featureId+"'" + " AND "+SCHOOL_ID+ " = '"+ schoolId+ "'" + " AND "+USER_ID+ " = '"+ userId+ "'", null);
                Initiater initiater = Initiater.getInstance();
                initiater.updated(classId, sectionId, schoolId, userId, featureId, countInDB);
                cursor.close();
            }
        }
        return true;
    }

    public void initializeValues(String classId, String sectionId, String schoolId, String userId) {
        SQLiteDatabase database = this.getWritableDatabase();
        String[] featureIDs = new String[]{DASHBOARD_FEATURE, ASSIGNMENT_FEATURE_ID, CREATE_ASSIGNMENT, CALENDAR_FEATURE, TIMETABLE_FEATURE,
                CREATE_TIMETABLE, EVENTS_FEATURE_ID, CREATE_EVENT, DRAWER_FRAGMENT, NOTIFICATION_FEATURE, CREATE_NOTIFICATION, ATTENDANCE_FEATURE,
                CREATE_ATTENDANCE, FEE_MANAGEMENT_FEATURE, CREATE_FEE_MANAGEMENT, PROGRESS_CARD_FEATURE, TRANSPORT_FEATURE, VEHICLE_TRACKING,JOURNALS_FEATURE,
                CREATE_JOURNAL, PHOTO_GALLERY_FEATURE, CREATE_PHOTO_GALLERY, EXAM_FEATURE, CREATE_EXAM, HALL_OF_FAME_FEATURE_ID, VOICE_MMS_ID};

        for(String values: featureIDs) {
            ContentValues contentValues = new ContentValues();
            contentValues.put(CLASS_ID, classId);
            contentValues.put(SECTION_ID, sectionId);
            contentValues.put(FEATURE_ID, values);
            contentValues.put(SCHOOL_ID, schoolId);
            contentValues.put(USER_ID, userId);
            contentValues.put(COUNT, 0);
            Cursor cursor = database.rawQuery("select *"+ " from "+TABLE_NAME+ " where "+CLASS_ID + " = " + "'"+ classId+ "'" +" AND "+
                    SECTION_ID+ " = "+ "'"+ sectionId+"'"+ " AND "+
                    FEATURE_ID+ " = "+ "'"+ values+"'" + " AND "+SCHOOL_ID+ " = '"+ schoolId+ "'" + " AND "+USER_ID+ " = '"+ userId+ "'", null);
            if(cursor.getCount() >  0) {
                // Entry is already there so no need to add it again
                cursor.close();
            } else {
                long result = database.insert(TABLE_NAME, null, contentValues);
                cursor.close();
            }
        }
    }

    public Cursor getClassSectionAndUser(String featureId) {
        SQLiteDatabase database = this.getWritableDatabase();
        return database.rawQuery("select "+ CLASS_ID + ","+ SECTION_ID+ ","+ USER_ID+" from "+ TABLE_NAME+ " where "+ FEATURE_ID+ " = '"+ featureId+"'", null);
    }

    public int getCount(String classId, String sectionId, String featureId, String schoolId, String userId) {
        SQLiteDatabase database = this.getWritableDatabase();
        int count = 0;
        Cursor cursor = database.rawQuery("select "+ COUNT + " from "+TABLE_NAME+ " where "+CLASS_ID + PARAMETER_EQUALS + "'"+ classId + "'"+ " AND "+
                SECTION_ID+ PARAMETER_EQUALS+ "'"+ sectionId+ "'"+ " AND "+
                FEATURE_ID+ PARAMETER_EQUALS+ "'"+ featureId +"'"+ " AND "+
                SCHOOL_ID+ PARAMETER_EQUALS +"'"+ schoolId+ "'"+ " AND "+USER_ID+ PARAMETER_EQUALS +"'"+ userId+ "'", null);
        while(cursor.moveToNext())
            count = cursor.getInt(0);
        cursor.close();
        Log.v("COUNT "," "+count);
        return count;
    }

    public int getSumOfNotificationCount(String schoolId) {
        SQLiteDatabase database = this.getWritableDatabase();
        Cursor cursor = database.rawQuery("select SUM("+COUNT+") from "+ TABLE_NAME+ " where "+SCHOOL_ID+ " = '" + schoolId+ "'", null);
        int count = 0;
        if(cursor.getCount() > 0) {
            cursor.moveToFirst();
            count = cursor.getInt(0);
            cursor.close();
        }
        return count;
    }

    public int notificationCountSumWithUserId(String schoolId, String userId) {
        SQLiteDatabase database = this.getWritableDatabase();
        Cursor cursor = database.rawQuery("select SUM("+COUNT+") from "+ TABLE_NAME+ " where "+SCHOOL_ID+ " = '" + schoolId+ "' AND "+ USER_ID+ " = '"+ userId + "'", null);
        int count = 0;
        if(cursor.getCount() > 0) {
            cursor.moveToFirst();
            count = cursor.getInt(0);
            cursor.close();
        }
        return count;
    }

    public void reduceNotificationCount(String classId, String sectionId, String featureId, String schoolId, String userId) {
        SQLiteDatabase database = this.getWritableDatabase();
        Cursor cursor = database.rawQuery("select "+COUNT+ " from "+TABLE_NAME+ " where "+CLASS_ID + PARAMETER_EQUALS + "'"+classId +"'"+" AND "+
                SECTION_ID+ PARAMETER_EQUALS+ "'" + sectionId + "'" + " AND "+
                FEATURE_ID+ PARAMETER_EQUALS + "'" + featureId +"'"+ " AND "+
                SCHOOL_ID+ PARAMETER_EQUALS+ "'"+schoolId+"'"+ " AND "+ USER_ID+ PARAMETER_EQUALS+ "'"+userId+"'", null);

        ContentValues contentValues = new ContentValues();

        if(cursor.getCount() > 0) {
            while(cursor.moveToNext()) {
                contentValues.put(COUNT, 0);
                database.update(TABLE_NAME, contentValues, CLASS_ID+ " = '"+ classId + "' AND " +SECTION_ID+ " = '"+ sectionId+ "' AND " +FEATURE_ID+ " = '"+featureId+"'"+ " AND "+SCHOOL_ID+ " = '"+ schoolId+ "'"+ " AND "+USER_ID+ " = '"+ userId+ "'", null);
                cursor.close();
            }
        }
    }

    public void resetNotificationCount() {
        SQLiteDatabase database = this.getWritableDatabase();
        database.delete(TABLE_NAME, null, null);

    }

    public void storePreferences(String value) {
        SQLiteDatabase database = this.getWritableDatabase();
        ContentValues contentValues = new ContentValues();
        contentValues.put(VALUE, value);
        database.insert(PREFERENCES_TABLE, null, contentValues);
    }

    public Cursor getPreferenceValues() {
        SQLiteDatabase database = this.getWritableDatabase();
        return database.rawQuery("select * from "+ PREFERENCES_TABLE, null);
    }

    public void resetPreferences() {
        SQLiteDatabase database = this.getWritableDatabase();
        database.execSQL("DELETE FROM "+PREFERENCES_TABLE);
    }

    public void saveUser(String userId, String userName, String schoolId, String sessionToken, String firstName, String permissions) {
        SQLiteDatabase database = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        Cursor cursor = database.rawQuery("select * from "+USER+ " where "+ USER_NAME+ " = "+"'"+userName+"'", null);

        values.put(SCHOOL_ID, schoolId);
        values.put(SESSION_TOKEN, sessionToken);
        values.put(FIRST_NAME, firstName);
        values.put(PERMISSIONS, permissions);
        values.put(USER_ID, userId);

        if(cursor.getCount() > 0 ) {
            database.update(USER, values, USER_NAME+ " = "+"'"+userName+"'", null);
        } else {
            values.put(USER_NAME, userName);
            database.insert(USER, null, values);
        }
        cursor.close();
    }

    public int updateUser(String userName, String classId, String className, String sectionId, String sectionName) {
        SQLiteDatabase database = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(CLASS_ID, classId);
        values.put(CLASS_NAME, className);
        values.put(SECTION_ID, sectionId);
        values.put(SECTION_NAME, sectionName);
        return database.update(USER, values, USER_NAME+ " = "+"'"+userName+"'", null);
    }

    public Cursor getUser(String userName) {
        SQLiteDatabase database = this.getWritableDatabase();
        return database.rawQuery("select * from "+USER+ " where "+USER_NAME+ " = "+"'"+userName+"'", null);
    }

    public Cursor getAllUser() {
        SQLiteDatabase database = this.getWritableDatabase();
        return database.rawQuery("select * from "+USER, null);
    }

    public void resetUser() {
        SQLiteDatabase database = this.getWritableDatabase();
        database.execSQL("DELETE FROM "+USER);
    }

    public void saveConfig(String schoolId, String value) {
        SQLiteDatabase database = this.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(SCHOOL_ID, schoolId);
        values.put(VALUE, value);
        Cursor cursor = database.rawQuery("select * from "+ CONFIG +" where "+SCHOOL_ID+ " = '"+ schoolId+"'", null);
        if(cursor.getCount() == 0) {
            database.insert(CONFIG, null, values);
        }
        cursor.close();
    }

    public Cursor getConfig(String schoolId) {
        SQLiteDatabase database = this.getWritableDatabase();
        return database.rawQuery("select * from "+ CONFIG +" where "+SCHOOL_ID+ " = '"+ schoolId+"'", null);
    }
}
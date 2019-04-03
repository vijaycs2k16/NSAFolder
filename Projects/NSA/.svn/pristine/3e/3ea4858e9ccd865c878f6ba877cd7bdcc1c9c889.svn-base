package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Holiday;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by praga on 08-Jun-17.
 */

public class HolidayJsonParser implements Constants {
    public List<Holiday> jsonParser(String jsonString) throws JSONException {
        JSONObject object = new JSONObject(jsonString);
        JSONArray dataArray = object.getJSONArray(DATA);
        List<Holiday> holidayList = new ArrayList<>();
        if(dataArray.length()!=0){
            for(int i = 0;i<dataArray.length();i++){
                Holiday holiday = new Holiday();
                JSONObject data = dataArray.getJSONObject(i);

                holiday.setSchoolId(data.getString("schoolId"));
                holiday.setTenantId(data.getString("tenantId"));
                holiday.setHolidayId(data.getString("holidayId"));
                holiday.setHolidayTypeId(data.getString("holidayTypeId"));
                holiday.setHolidayName(data.getString("holidayName"));
                holiday.setHolidayType(data.getString("holidayType"));
                holiday.setAcademicYear(data.getString("academicYear"));
                holiday.setStartDate(data.getString("startDate"));
                holiday.setEndDate(data.getString("endDate"));
                holiday.setFullDate(data.getString("fullDate"));
                holiday.setUpdatedDate(data.getString("updatedDate"));
                holiday.setUpdatedBy(data.getString("updatedBy"));
                holiday.setUpdatedUsername(data.getString("updatedUsername"));
                holiday.setUpdateddateAndName(data.getString("updateddateAndName"));
                holidayList.add(holiday);
            }
        }else {
            throw new JSONException("Empty JSOnArray");
        }

        return holidayList;
    }
}

package nexrise.publication.in.nexrise.JsonParser;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.FeeManagement;
import nexrise.publication.in.nexrise.BeanClass.FeeType;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by karthik on 12-10-2016.
 */

public class FeesManagementJsonParser implements Constants {
    public static ArrayList<FeeManagement> paidFeeList = new ArrayList<FeeManagement>();
    public static ArrayList<FeeManagement> dueFeeList = new ArrayList<FeeManagement>();
    public static ArrayList<FeeManagement> teacherList = new ArrayList<FeeManagement>();

    public void getFeeDetails(String jsonString) throws JSONException, NullPointerException {
        paidFeeList = new ArrayList<FeeManagement>();
        dueFeeList = new ArrayList<FeeManagement>();
        teacherList = new ArrayList<FeeManagement>();

        JSONObject jsonObject = new JSONObject(jsonString);
        JSONArray jsonArray = jsonObject.getJSONArray(DATA);
        if (jsonArray.length() != 0) {
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject finalobject = jsonArray.getJSONObject(i);
                String feename = finalobject.getString("feeAssignmentName");
                String feeAssignmentDetailId = finalobject.getString("feeAssignmentDetailId");
                String dueDate = finalobject.getString("dueDate");
                String classname = finalobject.getString("className");
                String firstName = finalobject.getString("firstName");
                String status = finalobject.getString("status");
                JSONArray feetypes = finalobject.getJSONArray("feeTypes");
                ArrayList<FeeType> feeTypeArrayList = new ArrayList<FeeType>();

                for (int j = 0; j < feetypes.length(); j++) {
                    JSONObject feeobject = feetypes.getJSONObject(j);
                    String typename = feeobject.getString("name");
                    String typeamount = feeobject.getString("amount");
                    int refundamount = feeobject.getInt("percent");
                    String id = feeobject.getString("id");
                    FeeType feeType = new FeeType(typename, typeamount, refundamount, id);
                    feeTypeArrayList.add(feeType);
                }
                JSONArray scholarship = finalobject.getJSONArray("scholarShip");
                ArrayList<FeeType> scholarShipList = new ArrayList<>();
                for (int k = 0; k < scholarship.length(); k++) {
                    JSONObject jsonObject1 = scholarship.getJSONObject(k);
                    String Scholarshipname = jsonObject1.getString("name");
                    String Scholarshipamount = jsonObject1.getString("amount");
                    String id = jsonObject1.getString("id");
                    Log.v("scholar arry", "" + Scholarshipname);
                    FeeType feeType = new FeeType(Scholarshipname, Scholarshipamount, 0, id);
                    scholarShipList.add(feeType);
                }

                String sectionname = finalobject.getString("sectionName");
                String feeDiscountAmount = finalobject.getString("feeDiscountAmount");
                String scholarshipname = finalobject.getString("status");
                String paidstatus = finalobject.getString("isPaid");
                String paidAmount = finalobject.getString("paidAmount");
                String netamount = finalobject.getString("netAmount");
                String totalAmount = finalobject.getString("totalAmount");
                if (paidstatus.equalsIgnoreCase("paid")) {
                    FeeManagement management = new FeeManagement(feeAssignmentDetailId, feename, dueDate, classname, paidstatus, sectionname, firstName, paidstatus, feeTypeArrayList, scholarShipList, scholarshipname, netamount, netamount, feeDiscountAmount);
                    management.setTotalAmount(totalAmount);
                    paidFeeList.add(management);
                } else {
                    if (!status.equalsIgnoreCase("Pending")) {
                        FeeManagement management = new FeeManagement(feeAssignmentDetailId, feename, dueDate, classname, paidstatus, sectionname, firstName, paidstatus, feeTypeArrayList, scholarShipList, scholarshipname, netamount, netamount, feeDiscountAmount);
                        management.setPaidAmount(paidAmount);
                        management.setTotalAmount(totalAmount);
                        dueFeeList.add(management);
                    }
                }
            }
        } else {
            throw new JSONException("Data is Empty");
        }
    }
}

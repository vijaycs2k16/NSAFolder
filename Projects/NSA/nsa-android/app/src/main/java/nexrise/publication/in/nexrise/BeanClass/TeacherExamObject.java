package nexrise.publication.in.nexrise.BeanClass;

/**
 * Created by Sai Deepak on 13-Oct-16.
 */

public class TeacherExamObject {

    String examName;
    String examDate;
    String examMonth;
    String roomNo;

    public TeacherExamObject(String examName, String examDate, String examMonth, String roomNo) {
        this.examName = examName;
        this.examDate = examDate;
        this.examMonth = examMonth;
        this.roomNo = roomNo;
    }

    public String getRoomNo() {
        return roomNo;
    }

    public void setRoomNo(String roomNo) {
        this.roomNo = roomNo;
    }

    public String getExamMonth() {
        return examMonth;
    }

    public void setExamMonth(String examMonth) {
        this.examMonth = examMonth;
    }

    public String getExamDate() {
        return examDate;
    }

    public void setExamDate(String examDate) {
        this.examDate = examDate;
    }

    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

}

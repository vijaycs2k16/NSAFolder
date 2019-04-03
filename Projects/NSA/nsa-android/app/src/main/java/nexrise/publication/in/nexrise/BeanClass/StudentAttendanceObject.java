package nexrise.publication.in.nexrise.BeanClass;

/**
 * Created by Sai Deepak on 17-Oct-16.
 */

public class StudentAttendanceObject {

    String name;
    String attendance;
    String present;
    String absent;
    String rno;

    public StudentAttendanceObject(String name, String attendance, String present, String absent, String rno) {
        this.name = name;
        this.attendance = attendance;
        this.present = present;
        this.absent = absent;
        this.rno = rno;
    }

    public String getAbsent() {
        return absent;
    }

    public void setAbsent(String absent) {
        this.absent = absent;
    }

    public String getPresent() {
        return present;
    }

    public void setPresent(String present) {
        this.present = present;
    }

    public String getAttendance() {
        return attendance;
    }

    public void setAttendance(String attendance) {
        this.attendance = attendance;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRno() {
        return rno;
    }

    public void setRno(String rno) {
        this.rno = rno;
    }
}

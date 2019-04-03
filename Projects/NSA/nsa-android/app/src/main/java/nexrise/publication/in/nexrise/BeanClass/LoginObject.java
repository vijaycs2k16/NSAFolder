package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by Sai Deepak on 25-Oct-16.
 */

public class LoginObject implements Serializable {

    String userName;
    String userType;
    String password;

    public LoginObject(String userName, String userType, String password) {
        this.userName = userName;
        this.userType = userType;
        this.password = password;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}

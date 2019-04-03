package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by karthik on 04-11-2016.
 */

public class Portions implements Serializable {

    private String part;

    public Portions(String part) {
        this.part = part;
    }

    public String getPart() {
        return part;
    }

    public void setPart(String part) {
        this.part = part;
    }

}

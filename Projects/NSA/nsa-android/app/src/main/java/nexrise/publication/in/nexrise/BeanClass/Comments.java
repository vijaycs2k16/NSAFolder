package nexrise.publication.in.nexrise.BeanClass;

/**
 * Created by karthik on 30-09-2016.
 */

public class Comments {
    private int id;
    private String name;
    private String creationTime;
    private String comments;

    public Comments(int id, String name, String creationTime, String comments) {
        this.id = id;
        this.name = name;
        this.creationTime = creationTime;
        this.comments = comments;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(String creationTime) {
        this.creationTime = creationTime;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }


}

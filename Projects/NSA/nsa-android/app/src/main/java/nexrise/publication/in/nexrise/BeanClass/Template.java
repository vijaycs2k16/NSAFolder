package nexrise.publication.in.nexrise.BeanClass;

/**
 * Created by krathik on 23-02-2017.
 */

public class Template {

    private String templateId;
    private String title;
    private String message;
    private String status;

    public Template(String templateId, String title, String message, String status) {
        this.templateId = templateId;
        this.title = title;
        this.message = message;
        this.status = status;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

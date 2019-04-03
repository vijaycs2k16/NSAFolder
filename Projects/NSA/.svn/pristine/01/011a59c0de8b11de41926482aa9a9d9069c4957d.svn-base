package nexrise.publication.in.nexrise.Gallery.CustomGallery.BeanClass;

import android.os.Parcel;
import android.os.Parcelable;

import java.util.ArrayList;

/**
 * Created by praga on 12/18/2016.
 */

public class Image extends ArrayList<Parcelable> implements Parcelable {
    public long id;
    public String name;
    public String path;
    public int position;
    public boolean isSelected;

    public Image(long id, String name, String path, boolean isSelected) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.position = position;
        this.isSelected = isSelected;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public int getPosition() {
        return position;
    }


    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeLong(id);
        dest.writeString(name);
        dest.writeString(path);
    }

    public static final Parcelable.Creator<Image> CREATOR = new Parcelable.Creator<Image>() {
        @Override
        public Image createFromParcel(Parcel source) {
            return new Image(source);
        }

        @Override
        public Image[] newArray(int size) {
            return new Image[size];
        }
    };

    private Image(Parcel in) {
        id = in.readLong();
        name = in.readString();
        path = in.readString();
    }
}

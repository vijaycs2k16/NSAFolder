package nexrise.publication.in.nexrise.CustomHashMap;

import java.util.HashMap;

/**
 * Created by Karthik on 7/11/17.
 */

public class CustomHashMap<K, V> extends HashMap<K, V> {

    @Override
    public V put(K key, V value) {
       /* Initiater initiater = Initiater.getInstance();
        initiater.updated(key, value);*/
        return super.put(key, value);
    }
}

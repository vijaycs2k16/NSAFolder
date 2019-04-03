package nexrise.publication.in.nexrise.HomeworkFeature;

import java.util.Comparator;

import nexrise.publication.in.nexrise.BeanClass.Homework;

/**
 * Created by karthik on 4/20/2017.
 */

public class IncompletedStudentsComparator implements Comparator<Homework> {

    @Override
    public int compare(Homework student1, Homework student2) {
        String student1ClassSection = student1.getClassName()+" "+student1.getSectionName();
        String student2ClassSection = student2.getClassName()+" "+student2.getSectionName();

        return student1ClassSection.compareTo(student2ClassSection);
    }
}

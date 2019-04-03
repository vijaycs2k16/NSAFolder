package nexrise.publication.in.nexrise.MMS;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.AttributeSet;
import android.view.View;

import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 12/10/17.
 */

public class VisualizerView extends View {
    private static final int MAX_AMPLITUDE = 32767;

    private float[] amplitudes;
    private float[] vectors;
    public int insertIdx = 0;
    private Paint pointPaint;
    private Paint linePaint;
    private int width;
    private int height;
    public int beginningIndex = -1;

    public VisualizerView(Context context, AttributeSet attrs) {
        super(context, attrs);
        linePaint = new Paint();
        int color = context.getResources().getColor(R.color.appColor);
        linePaint.setColor(color);
        linePaint.setStrokeWidth(1);
        pointPaint = new Paint();
        pointPaint.setColor(Color.BLUE);
        pointPaint.setStrokeWidth(1);
    }

    @Override
    protected void onSizeChanged(int width, int h, int oldw, int oldh) {
        this.width = width;
        height = h;
        amplitudes = new float[this.width * 2]; // xy for each point across the width
        vectors = new float[this.width * 4]; // xxyy for each line across the width
    }

    /**
     * modifies draw arrays. cycles back to zero when amplitude samples reach max screen size
     */
    public void addAmplitude(int amplitude) {
        invalidate();
        float scaledHeight = ((float) amplitude / MAX_AMPLITUDE) * (height - 1);
        int ampIdx = insertIdx * 2;
        amplitudes[ampIdx++] = insertIdx;   // x
        amplitudes[ampIdx] = scaledHeight;  // y
        int vectorIdx = insertIdx * 4;
        vectors[vectorIdx++] = insertIdx;   // x0
        vectors[vectorIdx++] = 0;           // y0
        vectors[vectorIdx++] = insertIdx;   // x1
        vectors[vectorIdx] = scaledHeight;  // y1
        // insert index must be shorter than screen width
        insertIdx = ++insertIdx >= width ? 0 : insertIdx;
    }

    @Override
    public void onDraw(Canvas canvas) {
        if(beginningIndex == 0) {
            //canvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
            amplitudes = new float[this.width * 2]; // xy for each point across the width
            vectors = new float[this.width * 4]; // xxyy for each line across the width
            ++beginningIndex;
        }

        canvas.drawLines(vectors, linePaint);
        canvas.drawPoints(amplitudes, pointPaint);
    }
}

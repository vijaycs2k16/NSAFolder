/**
 * Created by SenthilPeriyasamy on 10/19/2016.
 */
import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone.js');
if (process.env.ENV === 'production') {
    // Production
} else {
    // Development
    Error['stackTraceLimit'] = Infinity;
    require('zone.js/dist/long-stack-trace-zone');
}

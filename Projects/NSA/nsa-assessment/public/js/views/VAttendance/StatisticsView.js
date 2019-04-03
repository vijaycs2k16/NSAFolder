define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/VAttendance/statisticsTemplate.html'
], function (Backbone, $, _, statiscticsBlock) {
    'use strict';

    var StatisticsView = Backbone.View.extend({
        el        : '#statictics',
        initialize: function (options) {
            this.leaveDays = options.leaveDays || 0;
            this.workingDays = options.workingDays || 0;
            this.vacation = options.vacation || 0;
            this.medical = options.medical || 0;
            this.half = options.half || 0;
            this.sick = options.sick || 0;
            this.education = options.education || 0;

            this.lastLeave = options.lastLeave || 0;
            this.lastWorkingDays = options.lastWorkingDays || 0;
            this.lastVacation = options.lastVacation || 0;
            this.lastMedical = options.lastMedical || 0;
            this.lastHalf = options.lastHalf || 0;
            this.lastSick = options.lastSick || 0;
            this.lastEducation = options.lastEducation || 0;
        },

        events: {},

        percentDiff: function (now, last) {
            var numberPercent = 0;
            var onePercent = 0;
            if (now < last) {
                onePercent = last / 100;
                numberPercent = now / onePercent;
                numberPercent = 'DOWN ' + Math.abs(Math.ceil(100 - numberPercent)) + '%';
            } else {
                if (last === 0) {
                    numberPercent = 'UP ' + Math.ceil(now * 100) + '%';
                } else {
                    onePercent = last / 100;
                    numberPercent = (now - last) / onePercent;
                    numberPercent = 'UP ' + Math.ceil(numberPercent) + '%';
                }
            }
            return numberPercent;
        },

        render: function (options) {
            var self = this;
            var startTime = options.startTime;
            var percentLeave = self.percentDiff(self.leaveDays, self.lastLeave);
            var percentWork = self.percentDiff(self.workingDays, self.lastWorkingDays);
            var percentVacation = self.percentDiff(self.vacation, self.lastVacation);
            var percentMedical = self.percentDiff(self.medical, self.lastMedical);
            var percentHalf = self.percentDiff(self.half, self.lastHalf);
            var percentSick = self.percentDiff(self.sick, self.lastSick);
            var percentEducation = self.percentDiff(self.education, self.lastEducation);

            self.$el.html(_.template(statiscticsBlock, {
                leaveDays  : self.leaveDays,
                workingDays: self.workingDays,
                vacation   : self.vacation,
                medical    : self.medical,
                half       : self.half,
                sick       : self.sick,
                education  : self.education,

                lastLeave      : self.lastLeave,
                lastWorkingDays: self.lastWorkingDays,
                lastVacation   : self.lastVacation,
                lastMedical    : self.lastMedical,
                lastHalf       : self.lastHalf,
                lastSick       : self.lastSick,
                lastEducation  : self.lastEducation,

                percentLeave    : percentLeave,
                percentWork     : percentWork,
                percentVacation : percentVacation,
                percentMedical  : percentMedical,
                percentHalf     : percentHalf,
                percentSick     : percentSick,
                percentEducation: percentEducation
            }));

            $('#timeRecivingDataFromServer').html('Created in ' + (new Date() - startTime) + ' ms');
        }
    });

    return StatisticsView;
});

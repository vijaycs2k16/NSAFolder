define([
    'Backbone',
    'views/listViewBase',
    'Underscore',
    'jQuery',
    'text!templates/VCSTManagement/cvmDetails/topics/ListTemplate.html',
    'views/VCSTManagement/cvmDetails/topics/EditView',
    'views/VCSTManagement/cvmDetails/topics/CreateView',
    'helpers',
    'helpers/ga',
    'constants/googleAnalytics',
    'common',
    'dataService',
    'vconstants',
    'collections/VTopics/filterCollection',
    'Lodash',
    'views/selectView/selectView',
], function (Backbone,listViewBase, _, $, PaymentMethodList, EditView, CreateView, helpers, ga, GA, common, dataService, constant, FilterCollection, lodash, SelectView) {
    'use strict';

    var ContentView = listViewBase.extend({
        template  : _.template(PaymentMethodList),
        el        : '#topicsTab',
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.collection.bind('add change', this.render, this);

            this.responseObj = {};


            this.render();
        },

        events: {
            'click .goToEdit'                               : 'goToEditDialog',
            'click .goToRemove'                             : 'deleteItem',
            'click #top-bar-editBtn'                        : 'editItem',
            'click #top-bar-saveBtn'                        : 'saveProfile',
            'click .toggleList'                             : 'toggleList',
            'click .profile-list li a'                      : 'viewProfileDetails',
            'click .editProfile'                            : 'editProfile',
            'click #newProfileBtn'                          : 'createProfile',
            'click #modulesAccessTable tr th input'         : 'checkUncheck',
            'click #modulesAccessTable tr.parent'           : 'showChild',
            'click #modulesAccessTable tr.parent td input'  : 'checkUncheckChild',
            'click #modulesAccessTable tr.child td input'   : 'checkUncheckParent',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click .current-selected'                       : 'showNewSelect',
            'click .checkAll'                               : 'checkUncheckAll',
            'click .checkAllColumns'                        : 'checkUncheckcolumns'
        },

        chooseOption: function (e) {
            var self = this;
            var $thisEl = self.$el;
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            var classId = $thisEl.find('#subjectClass').attr('data-id');
            var classes = lodash.filter(this.classDetails, {'_id': classId});
            var dataObj = classes.length > 0 ? classes[0]: '';

            $('.newSelectList').hide();

            dataService.getData('/permission/tabs', {module : constant.MID.CSTMangement, moduleId: constant.MID.VFRANCHISETOPICS}, function (data) {
                dataService.getData('/vsubject/topics/sublist/' , {classDetail: classId}, function (result) {
                    self.$el.html(self.template({
                        dataObj          : dataObj,
                        collection       : result.data,
                        classDetails     : self.classDetails,
                        courses          : lodash.isEmpty(self.collection.toJSON()) ? [] : self.collection.toJSON()[0].course,
                        currencySplitter : helpers.currencySplitter,data: data.data
                    }));

                    self.collectionObj = result.data;

                    var $firstLi = self.$el.find('#profilesList').find('li').first();

                    if(!_.isEmpty(self.collectionObj))
                        self.viewProfileDetails(null, $firstLi);

                });
            });

        },

        showChild: function (e) {
            var $cur;

            if (!$(e.target).is('input')) {
                $cur = $(e.target).closest('.parent');

                while ($cur.next().hasClass('child')) {
                    $cur.next().toggleClass('visible');
                    $cur = $cur.next();
                }
            }
        },

        showNewSelect: function (e) {

            var $target = $(e.target);

            e.stopPropagation();

            if ($target.attr('id') === 'selectInput') {
                return false;
            }

            if (this.selectView) {
                this.selectView.remove();
            }

            if ($target.hasClass('current-selected')) {

                this.selectView = new SelectView({
                    e          : e,
                    responseObj: this.responseObj,
                    number     : 12
                });
                $target.append(this.selectView.render().el);

            } else {

                this.selectView = new SelectView({
                    e          : e,
                    responseObj: this.responseObj
                });

                $target.append(this.selectView.render().el);
                // $target.find('input').show();

            }

            return false;
        },

        checkUncheckParent: function (e) {
            var $target = $(e.target);
            var $td = $target.parent();
            var $cur;
            var n;

            if ($target.prop('checked')) {
                n = $td.parent().find('td').index($td);
                $cur = $(e.target).closest('.child');

                while ($cur.prev().hasClass('child')) {
                    $cur = $cur.prev();
                }

                $cur = $cur.prev();
                $cur.find('td').eq(n).find('input').prop('checked', true);

               /* while ($td && $td.prev() && $td.prev().get(0) && $td.prev().get(0).tagName === 'TD') {
                    $td.prev().find('input').prop('checked', true);
                    $td = $td.prev();
                }*/

            } else {
                /*while ($td && $td.next() && $td.next().get(0) && $td.next().get(0).tagName === 'TD') {
                    $td.next().find('input').prop('checked', false);
                    $td = $td.next();
                }*/
            }
        },

        checkUncheckChild: function (e) {
            var $target = $(e.target);
            var n = $target.parent().parent().find('td').index($(e.target).parent());
            var $cur = $target.closest('.parent');
            var $td;

            while ($cur.next().hasClass('child')) {
                $cur.next().find('td').eq(n).find('input').prop('checked', $target.prop('checked'));
                $cur = $cur.next();
            }

            $td = $target.parent();

            if ($target.prop('checked')) {
                /*while ($td && $td.prev() && $td.prev().get(0) && $td.prev().get(0).tagName === 'TD') {
                    $td.prev().find('input').prop('checked', true);
                    n = $target.parent().parent().find('td').index($td.prev());
                    $cur = $td.prev().closest('.parent');

                    while ($cur.next().hasClass('child')) {
                        $cur.next().find('td').eq(n).find('input').prop('checked', $td.prev().find('input').prop('checked'));
                        $cur = $cur.next();
                    }
                    $td = $td.prev();
                }*/
            } else {
                /*while ($td && $td.next() && $td.next().get(0) && $td.next().get(0).tagName === 'TD') {
                    $td.next().find('input').prop('checked', false);
                    n = $(e.target).parent().parent().find('td').index($td.next());
                    $cur = $td.next().closest('.parent');

                    while ($cur.next().hasClass('child')) {
                        $cur.next().find('td').eq(n).find('input').prop('checked', $td.next().find('input').prop('checked'));
                        $cur = $cur.next();
                    }

                    $td = $td.next();
                }*/
            }
        },

        checkUncheck: function (e) {
            var $target = $(e.target);
            var n = $('#modulesAccessTable tr th').index($target.parent());
            $target.prop('checked')

            this.$el.find('#modulesAccessTable tr').each(function () {
                $(this).find('td').eq(n).find('input').prop('checked', $target.prop('checked'));
            });
        },

        checkUncheckAll: function (e) {
            var $target = $(e.target);
            var n = $('#modulesAccessTable tr th').index($target.parent());
            $target.prop('checked')
            $(this).find('th').find('input').prop('checked', $target.prop('checked'));

            this.$el.find('#modulesAccessTable tr').each(function () {
                $(this).find('td').find('input').prop('checked', $target.prop('checked'));
                $(this).find('th').find('input').prop('checked', $target.prop('checked'));
            });
        },

        checkUncheckcolumns: function (e) {
            var $target = $(e.target);
            var n = $target.parent().parent().find('td').index($(e.target).parent());
            var $cur = $target.closest('.parent');
            var $td;

            while ($cur.next().hasClass('child')) {
                $cur.next().find('td').eq(n).find('input').prop('checked', $target.prop('checked'));
                $cur = $cur.next();
            }

            $td = $target.parent();

            if ($target.prop('checked')) {
                while ($td && $td.next() && $td.next().get(0) && $td.next().get(0).tagName === 'TD') {
                 $td.next().find('input').prop('checked', true);
                 n = $target.parent().parent().find('td').index($td.next());
                 $cur = $td.next().closest('.parent');

                 while ($cur.next().hasClass('child')) {
                 $cur.next().find('td').eq(n).find('input').prop('checked', $td.next().find('input').prop('checked'));
                 $cur = $cur.next();
                 }
                 $td = $td.next();
                 }
            } else {
                while ($td && $td.next() && $td.next().get(0) && $td.next().get(0).tagName === 'TD') {
                 $td.next().find('input').prop('checked', false);
                 n = $(e.target).parent().parent().find('td').index($td.next());
                 $cur = $td.next().closest('.parent');

                 while ($cur.next().hasClass('child')) {
                 $cur.next().find('td').eq(n).find('input').prop('checked', $td.next().find('input').prop('checked'));
                 $cur = $cur.next();
                 }

                 $td = $td.next();
                 }
            }

        },

        deleteItem: function (e) {
            var self = this;
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);
            var topicId =  model.attributes.topics;
            var answer = confirm('Are you sure to delete this entry?');

            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel: GA.EVENT_LABEL.DELETE_SHIPPING_METHOD
            });

            if (answer === true && model) {
                dataService.deleteData('/vtopic/' + id, {topic: topicId}, function (err, result) {
                    if (!err) {
                        self.$el.find('tr[data-id="' + id + '"]').remove();
                        self.render()

                        return App.render({
                            type: 'notify',
                            message: "topic deleted successfully"
                        });
                    }
                    else{
                        if (err.status === 401) {
                            App.render({
                                type   : 'error',
                                message: err.responseText
                            });
                        }
                    }
                })
            }
        },

        error: function (model, err) {
            self.collection = new FilterCollection();
            if (err.status === 401) {
                App.render({
                    type   : 'error',
                    message: err.responseText
                });
            }
        },

        toggleList: function (e) {
            e.preventDefault();

            this.$el.find('.forToggle').toggle();
        },

        goToEditDialog: function (e) {
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);

            e.preventDefault();
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.EDIT_SHIPPING_METHOD
            });

            if (model) {
                return new EditView({model: model, collection: this.collection});
            }
        },

        create: function (e) {
            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CREATE_SHIPPING_METHOD
            });

            return new CreateView({collection: this.collection});
        },


        editItem: function () {
            var selectedProfileId = $('#profilesList > li.active > a').data('id');
            var selectedProfileValue = $('#profilesList > li.active > a').data('value');
            var $thisEl = this.$el;

            $thisEl.find('#profilesList li.active a').hide();
            $thisEl.find('#profilesList li.active').append('<div class="editProfileContainer"><input type="text" class="editProfileName" maxlength="12" value="'
                + $thisEl.find('#profilesList > li.active > a').text().replace(' Profile', '') + '"/></div>');

            $('#top-bar-saveBtn').show();
            $('#top-bar-editBtn').hide();
            $('#modulesAccessTable tr input').prop('disabled', false);
        },

        saveProfile: function () {
            var self = this;
            var $thisEl = self.$el;
            var selectedProfileId = $('#profilesList > li.active > a').data('id');
            var jsonProfile = lodash.filter(this.collectionObj, {"_id": selectedProfileId});
            var classId = $thisEl.find('#subjectClass').attr('data-id');

            var tableContent = $('#modulesAccessTable tbody');
            var tableRows;
            var course = self.collectionObj[0].course;
            var courseArray = []

            for(var j = 0; j < course.length; j++) {
                var courseObj = {};
                courseObj.course = course[j]._id;
                courseObj.subject = selectedProfileId;
                courseObj.classDetail = classId;
                courseObj.topics = [];

                var readAccess = tableContent.find('input.'+ course[j]._id +':checkbox').map(function () {
                    return {checked: this.checked, index: $(this).closest('tr').attr('data-i')};
                }).get();

                for (var i = 0, len = readAccess.length; i < len; i++) {
                    if(readAccess[i].checked) {
                        var topic = {};
                        topic = JSON.parse(JSON.stringify(jsonProfile[0].topics[readAccess[i].index].topic));
                        var subtopic = []

                        var tAccess = tableContent.find('input.' + course[j]._id + '-' + jsonProfile[0].topics[readAccess[i].index].topic._id +':checkbox').map(function () {
                            return {checked: this.checked, index: $(this).closest('tr').attr('data-i')};
                        }).get();

                            for (var k = 0, len1 = tAccess.length; k < len1; k++) {
                                if(tAccess[k].checked) {
                                    subtopic.push(jsonProfile[0].topics[readAccess[i].index].subtopic[0].subtopic[tAccess[k].index]);
                                }
                                if(k == len1 - 1) {
                                    topic.subtopics = JSON.parse(JSON.stringify(subtopic));

                                }
                            }
                        courseObj.topics.push(topic);

                    }

                }

                courseArray.push(courseObj)
            }

            $('#modulesAccessTable tr th input').prop('disabled', true);

            dataService.postData('/vtopic/', {topics: courseArray}, function (err, result) {
                if(err) {
                    self.errorNotification(err);
                } else {
                    $('#top-bar-saveBtn').hide();
                    $('#top-bar-editBtn').show();
                    tableRows = $('#modulesAccessTable tbody tr');

                    for (var i = 0, len = tableRows.length; i < len; i++) {
                        for(var j = 0; j < course.length; j++) {
                            $(tableRows[i]).find('.' + course[j]._id).prop('disabled', true);
                        }

                    }

                    $('#modulesAccessTable').show();
                    if ($('#profilesList li.active .editProfileContainer').length > 0) {
                        $('#profilesList li.active a').text($('#profilesList li.active .editProfileContainer input').val() );
                        $('#profilesList li.active .editProfileContainer').remove();
                        $('#profilesList li.active a').show();

                    }
                }
            })

        },

        viewProfileDetails: function (e, el) {
             var $target = e ? $(e.target) : el;
             var $currentLi;
             var id;
             var pr;
             var b1;
             var b2;
             var b3;
             var c1;
             var c2;
             var c3;
             var tds;
             var ads;
             var sds;
             if (e) {
                e.preventDefault();
             }

             $('#top-bar-editBtn').show();
             $('#top-bar-deleteBtn').show();
             $('#top-bar-saveBtn').hide();

             $('#modulesAccessTable tr input').prop('disabled', true);

             if ($('#profilesList li.active .editProfileContainer').length > 0) {
                 $('#profilesList li.active .editProfileContainer').remove();
                 $('#profilesList li.active a').show();
             }

             $('#modulesAccessTable').hide();

             $currentLi = el || $target.closest('li');
             $currentLi.parent().find('.active').removeClass('active');
             $currentLi.addClass('active');

             id = $currentLi.find('a').data('id');

             this.profileId = id;
             this.profile = lodash.filter(this.collectionObj, {"_id": id});
             $('#modulesAccessTable').find('tbody').empty();

             pr = this.profile.length > 0 ? this.profile[0].topics : [];
             var course = this.collectionObj[0].course;

             b1 = true;
             b2 = true;
             b3 = true;
             sds += '<td><input type="checkbox" class="checkAllColumns"  disabled/></td>';

             for (var i = 0; i < pr.length; i++) {
                 c1 = '';
                 c2 = '';
                 c3 = '';
                 tds = '';
                 ads = '';

                 for(var j = 0; j < course.length; j++) {
                     c1 = lodash.isEmpty(lodash.filter(pr[i].course, {course: course[j]._id})) ? '' : 'checked="checked"';
                     tds += '<td><input type="checkbox" class="'+ course[j]._id + '" ' + c1 + ' disabled/></td>';
                 }

                 if(pr[i].subtopic.length > 0){
                     $('#modulesAccessTable').find('tbody').append('<tr class="parent" data-i="' + i + '"><td class="mname"> * ' + pr[i].topic.name + '</td>' + sds + ',' + tds + '</tr>');
                 } else {
                     $('#modulesAccessTable').find('tbody').append('<tr class="parent" data-i="' + i + '"><td class="mname">   ' + pr[i].topic.name + '</td>' + sds + ',' + tds + '</tr>');
                 }


                 if(pr[i].subtopic.length > 0 ) {
                     for (var k = 0; k < pr[i].subtopic[0].subtopic.length; k++) {
                         var s2 = '';
                         var stds = '';
                         var sData = pr[i].subtopic[0].subtopic[k];
                         for(var j = 0; j < course.length; j++) {
                             c1 = lodash.isEmpty(lodash.filter(pr[i].course, {course: course[j]._id})) ? [] : lodash.filter(pr[i].course, {course: course[j]._id});
                             var s1 = c1.length > 0 && c1[0].topics ? (lodash.filter(c1[0].topics, {_id: pr[i].topic._id})) : [];
                             s1 = s1.length > 0 ? s1[0].subtopics : [];
                             var isFound = lodash.filter(s1, {_id: pr[i].subtopic[0].subtopic[k]._id});
                             s2 = lodash.isEmpty(isFound) ? '' : 'checked="checked"';
                             stds += '<td><input type="checkbox" class="'+ course[j]._id + '-' + pr[i].topic._id + '" ' + s2 + ' disabled/></td>';
                         }
                          $('#modulesAccessTable').find('tbody').append('<tr class="child" data-i="' + k + '"><td class="mname">' + sData.name  + '</td>' + sds + ','+ stds + '</tr>');

                     }

                 }
             }

             $('#modulesAccessTable').show();
             return false;
         },

        render: function () {
            var self = this;
            dataService.getData('/vcourse/classDetails', {}, function (classes) {
                classes = _.map(classes.data, function (cls) {
                    cls.name = cls.className;
                    return cls;

                });
                self.classDetails = classes;
                self.responseObj['#subjectClass'] = classes;
            });

            dataService.getData('/permission/tabs', {module : constant.MID.CSTMangement, moduleId: constant.MID.VFRANCHISETOPICS}, function (data) {
                var className =  data.data.tab ? 'active' : '';
                $('#topics').addClass(className);
                $('#topicsTab').addClass(className);
                if(data.data.read) {
                    $('#topics').removeClass('hide');
                    $('#topicsTab').removeClass('hide')
                } else {
                    $('#topics').addClass('hide');
                    $('#topicsTab').addClass('hide')
                }

                self.$el.html(self.template({
                    collection      : '',
                    classDetails    : '',
                    dataObj         : ''
                }));
            });

            return this;
        }

    });

    return ContentView;
});
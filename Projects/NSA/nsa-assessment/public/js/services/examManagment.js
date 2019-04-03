define([
    'jQuery',
    'Underscore',
    'dataService'
], function ($, _, dataService) {

    function deleteSubject(e) {
        var $thisEl = this.$el;
        var $target = $thisEl.find(e.target);
        var id = $thisEl.find($target.closest('li')
            .find('.checkedProductCategory')[0])
            .data('id');

        e.stopPropagation();

        $thisEl.find('.productCategory[data-id="' + id + '"]')
            .prop('checked', false);
        $target.closest('li').remove();
        this.resetExamMode();

        this.$el.find('#checkedTopics').empty();
        $('.topicCategories').attr('checked', false);
        if (typeof this.useFilter === 'function') {
            this.useFilter();
        }
    }

    function deleteTopic(e) {
        var $thisEl = this.$el;
        var $target = $thisEl.find(e.target);
        var id = $thisEl.find($target.closest('li')
            .find('.checkedTopics')[0])
            .data('id');

        e.stopPropagation();

        $thisEl.find('.topicCategories[data-id="' + id + '"]')
            .prop('checked', false);
        $target.closest('li').remove();
        this.resetExamMode();

        if (typeof this.useFilter === 'function') {
            this.useFilter();
        }
    }
    function deleteCourse(e) {
        var $thisEl = this.$el;
        var $target = $thisEl.find(e.target);
        var id = $thisEl.find($target.closest('li')
            .find('.checkedProductCenter')[0])
            .data('id');

        e.stopPropagation();
        this.resetExamMode();
        $thisEl.find('.productCenterCategories[data-id="' + id + '"]')
            .prop('checked', false);
        $target.closest('li').remove();

        if (typeof this.useFilter === 'function') {
            this.useFilter();
        }
    }


    function deleteClasses(e) {
        var $thisEl = this.$el;
        var $target = $thisEl.find(e.target);
        var id = $thisEl.find($target.closest('li')
            .find('.checkedClassCategories')[0])
            .data('id');

        e.stopPropagation();
        this.resetExamMode();

        $thisEl.find('.classCategories[data-id="' + id + '"]')
            .prop('checked', false);
        $target.closest('li').remove();
        this.changeClass(e)
        if (typeof this.useFilter === 'function') {
            this.useFilter();
        }
    }


    function renderMultiFilter() {
        var $thisEl = this.$el;
        var $checkedCategoryContainer = $thisEl.find('#checkedProductCategories');
        var $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');
        var $categoryContainer = $thisEl.find('#productCategories');
        var checkedSelectedId;
        var checkedName;
        var self = this;
        var checkObject = {};

        dataService.getData('/products/optionsValues/getForFiler', {id: this.groupId}, function (result) {

            _.each(result, function (category) {
                checkedName = '';
                checkedSelectedId = '';

                if (!category.name) {
                    return false;
                }

                if (!checkObject[category.name]) {
                    checkObject[category.name] = 1;
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCategory" data-value="' + category.name + '" data-id="' + category.variantId + '" data-variant="' + category._id + '"> <span></span></label>' + category.name + '</li>');

                    if (checkedName) {
                        $checkedCategoryContainer.append('<li><span class="checkedProductCategory"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag icon-close3"></span></li>');
                    }
                }

            });

            // $categoriesBlock.children('ul').hide();

        }, this);
    }

    function  showSubjects(e) {
        var $thisEl = this.$el;
        var $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');
        e.stopPropagation();
        if (!$categoriesBlock.length) {
            $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');
        }
        var id = $(e.target).attr('id');
        if(id != 'mySubjectInput') {
            if ($categoriesBlock.hasClass('open')) {
                $categoriesBlock.removeClass('open');
                $categoriesBlock.children('ul').hide();
            } else {
                $categoriesBlock.addClass('open');
                $categoriesBlock.children('ul').show();
            }
        }

    }

    function showClass(e) {
        var $thisEl = this.$el;
        var $Classes = $thisEl.find('#variantsClassBlock')
        e.stopPropagation();

        if (!$Classes.length) {
            $Classes = $thisEl.find('#variantsClassBlock');
        }
        var id = $(e.target).attr('id');
        if (id != 'ClassCate') {
            if ($Classes.hasClass('open')) {
                $Classes.removeClass('open');
                $Classes.children('ul').hide();
            } else {
                $Classes.addClass('open');
                $Classes.children('ul').show();
            }

        }
    }

    function showTopics(e) {
        var $thisEl = this.$el;
        var $categoriesBlock = $(e.target).closest('#topicBlocks');
        $(e.target).closest('#variantsCategoriesBlock').children('ul').hide()

        e.stopPropagation();

        if (!$categoriesBlock.length) {
            $categoriesBlock =  $(e.target).closest('#topicBlocks');
        }
        var id = $(e.target).attr('id');
        if(id != 'myTopicInput') {
            if ($categoriesBlock.hasClass('open')) {
                $categoriesBlock.removeClass('open');
                $categoriesBlock.children('ul').hide();
            } else {
                $categoriesBlock.addClass('open');
                $categoriesBlock.children('ul').show();
            }
        }
    }

    function showTopicData(e) {
        var $thisEl = this.$el;
        var $categoriesBlock = $(e.target).closest('#topicDataBlocks');
        $(e.target).closest('#variantsCategoriesBlock').children('ul').hide()

        e.stopPropagation();

        if (!$categoriesBlock.length) {
            $categoriesBlock =  $(e.target).closest('#topicDataBlocks');
        }
        var id = $(e.target).attr('id');
        if(id != 'myTopicDataInput') {
            if ($categoriesBlock.hasClass('open')) {
                $categoriesBlock.removeClass('open');
                $categoriesBlock.children('ul').hide();
            } else {
                $categoriesBlock.addClass('open');
                $categoriesBlock.children('ul').show();
            }
        }
    }

    function showsubTopics(e) {
        var $thisEl = this.$el;
        var $categoriesBlock = $thisEl.find('#subtopicBlocks');
        $thisEl.find('#variantsCategoriesBlock').children('ul').hide()

        e.stopPropagation();

        if (!$categoriesBlock.length) {
            $categoriesBlock = $thisEl.find('#subtopicBlocks');
        }
        var id = $(e.target).attr('id');
        if(id != 'mySubTopicInput') {
            if ($categoriesBlock.hasClass('open')) {
                $categoriesBlock.removeClass('open');
                $categoriesBlock.children('ul').hide();
            } else {
                $categoriesBlock.addClass('open');
                $categoriesBlock.children('ul').show();
            }
        }
    }

    function multiSelectSearch(e) {
        var input, filter, ul, li, a, i;
        var id = $(e.target).attr('id')
        input = document.getElementById(id);
        filter = input.value.toUpperCase();
        ul = document.getElementById($(e.target).closest("ul").attr('id'));
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("label")[1];
            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }

    function  showSubTopic(e) {
        var $thisEl = this.$el;
        var $categoriesBlock = $thisEl.find('#variantsSubTopicBlock');
        e.stopPropagation();
        if (!$categoriesBlock.length) {
            $categoriesBlock = $thisEl.find('#variantsSubTopicBlock');
        }
        var id = $(e.target).attr('id');
        if(id != 'mySubTopicInput') {
            if ($categoriesBlock.hasClass('open')) {
                $categoriesBlock.removeClass('open');
                $categoriesBlock.children('ul').hide();
            } else {
                $categoriesBlock.addClass('open');
                $categoriesBlock.children('ul').show();
            }
        }

    }

    function deleteSubTopic(e) {
        var $thisEl = this.$el;
        var $target = $thisEl.find(e.target);
        var id = $thisEl.find($target.closest('li')
            .find('.checkedSubTopic')[0])
            .data('id');

        e.stopPropagation();

        $thisEl.find('.productSubTopic[data-id="' + id + '"]')
            .prop('checked', false);
        $target.closest('li').remove();

        if (typeof this.useFilter === 'function') {
            this.useFilter();
        }
    }

    function resetExamMode(){
        $('.randomQuestions').addClass('hide');
        $('.manualQuestions').addClass('hide');
        $('.generatedQuestions').addClass('hide');
        if(this.questionMode){
            $('#'+this.questionMode).prop('checked', false);
        }
    }

    return {
       showSubjects            : showSubjects,
        deleteSubject          : deleteSubject,
        renderMultiFilter      : renderMultiFilter,
        showTopics             : showTopics,
        showTopicData          : showTopicData,
        deleteTopic            : deleteTopic,
        showSubTopic           : showSubTopic,
        deleteSubTopic         : deleteSubTopic,
        multiSelectSearch      : multiSelectSearch,
        showClass              : showClass,
        deleteClasses          :deleteClasses,
        deleteCourse           :deleteCourse,
        resetExamMode          : resetExamMode,
    };
});

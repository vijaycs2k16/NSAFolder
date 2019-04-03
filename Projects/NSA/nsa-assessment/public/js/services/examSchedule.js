define([
    'jQuery',
    'Underscore',
    'dataService'
], function ($, _, dataService) {

    function deleteBatch(e) {
        var $thisEl = this.$el;
        var $target = $thisEl.find(e.target);
        var id = $thisEl.find($target.closest('li')
            .find('.checkedProductCategory')[0])
            .data('id');

        e.stopPropagation();

        $thisEl.find('.productCategory[data-id="' + id + '"]')
            .prop('checked', false);
        $target.closest('li').remove();

        if (typeof this.useFilter === 'function') {
            this.useFilter();
        }
    }

    function showBatches(e) {
        var $thisEl = this.$el;
        var $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');

        e.stopPropagation();

        if (!$categoriesBlock.length) {
            $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');
        }

        if ($categoriesBlock.hasClass('open')) {
            $categoriesBlock.removeClass('open');
            $categoriesBlock.children('ul').hide();
        } else {
            $categoriesBlock.addClass('open');
            $categoriesBlock.children('ul').show();
        }
    }

    function showCenters(e) {
        var $thisEl = this.$el;
        var $categoriesBlock = $thisEl.find('#variantsCenterBlock');

        e.stopPropagation();

        if (!$categoriesBlock.length) {
            $categoriesBlock = $thisEl.find('#variantsCenterBlock');
        }

        var id = $(e.target).attr('id');
        if(id != 'myCenterInput') {
            if ($categoriesBlock.hasClass('open')) {
                $categoriesBlock.removeClass('open');
                $categoriesBlock.children('ul').hide();
            } else {
                $categoriesBlock.addClass('open');
                $categoriesBlock.children('ul').show();
            }
        }
    }

    function deleteCenter(e) {
        var $thisEl = this.$el;
        var $target = $thisEl.find(e.target);
        var id = $thisEl.find($target.closest('li')
            .find('.checkedProductCenter')[0])
            .data('id');

        e.stopPropagation();
        $thisEl.find('.productCategory').prop('checked', false)
        $('#checkedProductCategories').empty();

        $thisEl.find('.productCenterCategory[data-id="' + id + '"]')
            .prop('checked', false);
        $target.closest('li').remove();

        if (typeof this.useFilter === 'function') {
            this.useFilter();
        }
    }

    function batchesResetForm(){
        $('#productCategories').empty();
        $('#checkedProductCategories').empty();
    }

    return {
        deleteBatch         : deleteBatch,
        showBatches         : showBatches,
        showCenters         : showCenters,
        deleteCenter        : deleteCenter
    };
});


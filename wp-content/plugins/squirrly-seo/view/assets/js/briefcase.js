if (typeof SQ_DEBUG === 'undefined') var SQ_DEBUG = false;
(function ($) {
    var briefcaseTable;

    $.fn.sq_Briefcase = function () {
        var $this = this;
        var $popupAddKeyword = $this.find('.sq_add_keyword_dialog');
        var $popupAddLabel = $this.find('.sq_add_labels_dialog');
        var $popupEditLabel = $this.find('.sq_edit_label_dialog');

        $this.listenAdd = function () {
            $popupAddLabel.find('#sq_labelcolor').wpColorPicker();
            $popupAddLabel.find('#sq_save_label').on('click', function () {
                var $button = $(this);
                var $name = $popupAddLabel.find('input#sq_labelname').val();
                var $color = $popupAddLabel.find('input#sq_labelcolor').val();

                $button.addClass('sq_minloading');
                $.post(
                    sqQuery.ajaxurl,
                    {
                        action: 'sq_briefcase_addlabel',
                        name: $name,
                        color: $color,
                        sq_nonce: sqQuery.nonce
                    }
                ).done(function (response) {
                    if (typeof response.saved !== 'undefined') {
                        location.reload();
                        $button.removeClass('sq_minloading');
                    } else if (typeof response.error !== 'undefined') {
                        $button.removeClass('sq_minloading');
                        $.sq_showMessage(response.error).addClass('sq_error');

                    }
                }).fail(function () {
                    $button.removeClass('sq_minloading');
                }, 'json');
            });

            $this.find('.sq_save_keyword_labels').on('click', function () {
                var $popup = $(this).parents('.sq_label_manage_popup:last');
                var $button = $(this);
                var $keyword = $(this).data('keyword');

                var $labels = [];
                $popup.find('input[name="sq_labels"]:checked').each(function () {
                    $labels.push(this.value);
                });

                $button.addClass('sq_minloading');
                $.post(
                    sqQuery.ajaxurl,
                    {
                        action: 'sq_briefcase_keywordlabel',
                        keyword: $keyword,
                        labels: $labels,
                        sq_nonce: sqQuery.nonce
                    }
                ).done(function (response) {
                    if (typeof response.saved !== 'undefined') {
                        location.reload();
                        $button.removeClass('sq_minloading');
                    } else if (typeof response.error !== 'undefined') {
                        $button.removeClass('sq_minloading');
                        $.sq_showMessage(response.error).addClass('sq_error');

                    }
                }).fail(function () {
                    $button.removeClass('sq_minloading');
                }, 'json');
            });
        };

        $this.listenEdit = function () {
            $popupEditLabel.find('#sq_labelcolor').wpColorPicker();

            $this.find('.sq_edit_label').on('click', function () {
                $('#element .wp-picker-clear').trigger('click');
                $popupEditLabel.find('input#sq_labelid').val($(this).attr('data-id'));
                $popupEditLabel.find('input#sq_labelname').val($(this).attr('data-name'));
                $popupEditLabel.find('input#sq_labelcolor').val($(this).attr('data-color'));
                $popupEditLabel.find('input#sq_labelcolor').trigger('change');
                $popupAddKeyword.modal('hide');
                $popupAddLabel.modal('hide');
                $popupEditLabel.modal('show');
            });

            $popupEditLabel.find('#sq_save_label').on('click', function () {
                var $button = $(this);
                var $id = $popupEditLabel.find('#sq_labelid').val();
                var $name = $popupEditLabel.find('#sq_labelname').val();
                var $color = $popupEditLabel.find('#sq_labelcolor').val();

                $button.addClass('sq_minloading');
                $.post(
                    sqQuery.ajaxurl,
                    {
                        action: 'sq_briefcase_editlabel',
                        id: $id,
                        name: $name,
                        color: $color,
                        sq_nonce: sqQuery.nonce
                    }
                ).done(function (response) {
                    if (typeof response.saved !== 'undefined') {
                        location.reload();
                        $button.removeClass('sq_minloading');
                    } else if (typeof response.error !== 'undefined') {
                        $button.removeClass('sq_minloading');
                        $.sq_showMessage(response.error).addClass('sq_error');

                    }
                }).fail(function () {
                    $button.removeClass('sq_minloading');
                }, 'json');
            });
        };

        $this.listenCount = function () {
            $this.find('.sq_open_subrow').on('click', function () {
                var $button = $(this);
                var $id = $(this).data('id');
                var $keyword = $(this).data('keyword');
                $this.find('.fa_showmore').removeClass('fa-sort-asc');

                if ($('#sq_subrow_' + $id).is(':visible')) {
                    $('#sq_subrow_' + $id).hide();
                    return;
                }

                $button.addClass('sq_minloading');

                $.post(
                    sqQuery.ajaxurl,
                    {
                        action: 'sq_briefcase_article',
                        keyword: $keyword,
                        sq_nonce: sqQuery.nonce
                    }
                ).done(function (response) {
                    if (typeof response.error !== 'undefined') {
                        if (response.error === 'limit_exceeded') {
                            $.sq_showMessage(response.error).addClass('sq_error');
                        } else {
                            $.sq_showMessage(response.error, 10000).addClass('sq_error');
                        }
                    } else if (typeof response.articles !== 'undefined') {
                        $('.sq_subrow').hide();
                        $('#sq_subrow_' + $id).find('td').html(response.articles);
                        $('#sq_subrow_' + $id).show();

                    }
                    $('#sq_row_' + $id).find('.fa_showmore').addClass('fa-sort-asc');

                    $button.removeClass('sq_minloading');
                }).fail(function () {
                    $button.removeClass('sq_minloading');
                }, 'json');
            });
        };

        $this.listenDelete = function () {
            $this.find('.sq_delete').on('click', function () {
                if (confirm('Are you sure ?')) {
                    var $button = $(this);
                    var $keyword = $(this).data('keyword');
                    var $id = $(this).data('id');
                    $button.addClass('sq_minloading');
                    $.post(
                        sqQuery.ajaxurl,
                        {
                            action: 'sq_briefcase_deletekeyword',
                            keyword: $keyword,
                            sq_nonce: sqQuery.nonce
                        }
                    ).done(function (response) {
                        if (typeof response.message !== 'undefined') {
                            $this.find('#sq_row_' + $id).remove();
                            $this.find('#sq_subrow_' + $id).remove();
                        } else if (typeof response.error !== 'undefined') {
                            $.sq_showMessage(response.error).addClass('sq_error');
                        }
                        $button.removeClass('sq_minloading');
                    }).fail(function () {
                        $button.removeClass('sq_minloading');
                    }, 'json');
                }
            });

            $this.find('.sq_delete_label').on('click', function () {
                if (confirm('Are you sure ?')) {
                    var $button = $(this).parents('.sq_saved_label:last');
                    var $id = $(this).data('id');
                    $button.addClass('sq_minloading');
                    $.post(
                        sqQuery.ajaxurl,
                        {
                            action: 'sq_briefcase_deletelabel',
                            id: $id,
                            sq_nonce: sqQuery.nonce
                        }
                    ).done(function (response) {
                        if (typeof response.deleted !== 'undefined') {
                            location.reload();

                            $button.remove();
                            $this.find('label[data-id=' + $id + ']').remove();
                            $this.find('.sq_circle_label[data-id=' + $id + ']').remove();
                        } else if (typeof response.error !== 'undefined') {
                            $.sq_showMessage(response.error).addClass('sq_error');
                        }
                        $button.removeClass('sq_minloading');
                    }).fail(function () {
                        $button.removeClass('sq_minloading');
                    }, 'json');
                }
            });
        };

        $this.listenDoSerp = function () {
            $this.find('.sq_research_doserp').on('click', function () {
                var $button = $(this);
                var $keyword = $(this).data('keyword');
                $button.addClass('sq_minloading');
                $.post(
                    sqQuery.ajaxurl,
                    {
                        action: 'sq_ajax_briefcase_doserp',
                        keyword: $keyword,
                        sq_nonce: sqQuery.nonce
                    }
                ).done(function (response) {
                    if (typeof response.message !== 'undefined') {
                        $.sq_showMessage(response.message).addClass('sq_success');
                        $button.hide();
                    } else if (typeof response.error !== 'undefined') {
                        $.sq_showMessage(response.error);
                    }

                    $button.removeClass('sq_minloading');
                }).fail(function () {
                    $button.removeClass('sq_minloading');
                }, 'json');
            });
        };

        $this.listenOptions = function () {
            $this.find('.sq_research_selectit').on('click', function () {
                $(this).addClass('sq_minloading');
                var $keyword = $(this).data('keyword');
                $.sq_setCookie('sq_keyword', $keyword);

                location.href = $(this).data('post');
            });

            $('#sq_briefcase .sq_filter_label input[type=checkbox]').click(function () {
                $('#sq_briefcase .sq_filter_label input[type=checkbox]').each(function () {
                    if (!$(this).is(':checked')) {
                        $(this).next('label').removeClass('sq_active');
                    }
                });

                if ($(this).is(':checked')) {
                    $(this).next('label').addClass('sq_active');
                }
            });
            $('#sq_briefcase .sq_add_keyword_dialog input[type=checkbox]').click(function () {
                $('#sq_briefcase .sq_add_keyword_dialog input[type=checkbox]').each(function () {
                    if (!$(this).is(':checked')) {
                        $(this).next('label').removeClass('sq_active');
                    }
                });

                if ($(this).is(':checked')) {
                    $(this).next('label').addClass('sq_active');
                }
            });
            $('#sq_briefcase .sq_label_manage_popup input[type=checkbox]').click(function () {
                var $popup = $(this).parents('.sq_label_manage_popup:last');
                $popup.find('input[type=checkbox]').each(function () {
                    if (!$(this).is(':checked')) {
                        $(this).next('label').removeClass('sq_active');
                    }
                });

                if ($(this).is(':checked')) {
                    $(this).next('label').addClass('sq_active');
                }
            });
        };

        $this.bulkAction = function () {

                //submit bulk action
                $this.find('.sq_bulk_submit').on('click', function () {
                    var $button = $(this);

                    if ($this.find('.sq_bulk_action').find(':selected').val() !== '') {

                        //show modal window for assign labels
                        if (!$button.hasClass('btn-modal') && $this.find('.sq_bulk_action').find(':selected').val() === 'sq_ajax_briefcase_bulk_label') {
                            $this.find('#sq_label_manage_popup_bulk').modal('show');
                            return;
                        }

                        //only if confirmation needed
                        if ($this.find('.sq_bulk_action').find(':selected').data('confirm')) {
                            if (!confirm($this.find('.sq_bulk_action').find(':selected').data('confirm'))) {
                                return;
                            }
                        }

                        var $sq_bulk_input = [];
                        jQuery($this.find('.sq_bulk_input').serializeArray()).each(function () {
                            $sq_bulk_input.push($(this).attr('value'));
                        });
                        var $sq_bulk_labels = [];
                        jQuery($this.find('.sq_bulk_labels').serializeArray()).each(function () {
                            $sq_bulk_labels.push($(this).attr('value'));
                        });

                        $button.addClass('sq_minloading');
                        $.post(
                            sqQuery.ajaxurl,
                            {
                                action: $this.find('.sq_bulk_action').find(':selected').val(),
                                inputs: $sq_bulk_input,
                                labels: $sq_bulk_labels,
                                sq_nonce: sqQuery.nonce
                            }
                        ).done(function (response) {
                            if (typeof response.message !== 'undefined') {
                                $.sq_showMessage(response.message).addClass('sq_success');

                                //if delete action is called
                                if ($this.find('.sq_bulk_action').find(':selected').val() === 'sq_ajax_briefcase_bulk_doserp') {
                                    $this.find('.sq_bulk_input').each(function () {
                                        if ($(this).is(":checked")) {
                                            $(this).parents('tr:last').find('.sq_research_doserp').remove();
                                            $(this).prop("checked", false);
                                        }
                                    });
                                } else if ($this.find('.sq_bulk_action').find(':selected').val() === 'sq_ajax_briefcase_bulk_delete') {
                                    $this.find('.sq_bulk_input').each(function () {
                                        if ($(this).is(":checked")) {
                                            briefcaseTable.row($(this).parents('tr:last'))
                                                .remove()
                                                .draw();
                                        }
                                    });
                                } else {
                                    location.reload();
                                }
                            } else if (typeof response.error !== 'undefined') {
                                $.sq_showMessage(response.error);
                            }

                            $button.removeClass('sq_minloading');
                        }).fail(function () {
                            $button.removeClass('sq_minloading');
                        }, 'json');

                    }
                });
        };

        $this.listenAdd();
        $this.listenEdit();
        //$this.listenCount();
        $this.listenDelete();
        $this.listenDoSerp();
        $this.listenOptions();
        $this.bulkAction();

        return $this;
    };

    /**
     * Load the table for briefcase
     * @returns {jQuery|*}
     */
    $.fn.loadTable = function () {
        //Set the new sort
        $.extend($.fn.dataTableExt.oSort, {
            "formatted-progress-pre": function (a) {
                return $('<div></div>').append(a).find('button').data('value');
            },

            "formatted-progress-asc": function (a, b) {
                return a - b;
            },

            "formatted-progress-desc": function (a, b) {
                return b - a;
            },
            "formatted-num-pre": function (a) {
                return parseInt(a.replace(/[^\d\-\.]/g, ""));
            },

            "formatted-num-asc": function (a, b) {
                return a - b;
            },

            "formatted-num-desc": function (a, b) {
                return b - a;
            }
        });

        //Load datatables for Briefcase
        return $(this).DataTable(
            {
                "columnDefs": [
                    {
                        "targets": 4,
                        "sortable": true,
                        "type": "formatted-progress"
                    },
                    {
                        "targets": 2,
                        "sortable": true,
                        "type": "formatted-num"
                    },
                    {
                        "targets": [0, 5],
                        "sortable": false
                    }
                ],

                "bPaginate": true,
                "bLengthChange": false,
                "bFilter": false,
                "iDisplayLength": 10,
                "aaSorting": [2, 'desc']

            }
        );
    };

    $(document).ready(function () {
        $('#sq_briefcase').sq_Briefcase();
        $('#sq_briefcaselabels').sq_Briefcase();

        //load dataTable
        briefcaseTable = $('#sq_briefcase table.table').loadTable();
    });

})(jQuery);


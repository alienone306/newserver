if (typeof SQ_DEBUG === 'undefined') var SQ_DEBUG = false;
(function ($) {

    $.extend($.fn.dataTableExt.oSort, {
        "formatted-num-pre": function (a) {
            return (parseInt(a) > 0) ? parseInt(a.replace(/[^\d\-\.]/g, "")) : 99;
        },

        "formatted-num-asc": function (a, b) {
            return a - b;
        },

        "formatted-num-desc": function (a, b) {
            return b - a;
        }
    });

    $.fn.sq_Ranking = function () {
        var $this = this;
        var ranksTable;

        ranksTable = $this.find('table.table-ranks').DataTable(
            {
                "bPaginate": true,
                "bLengthChange": false,
                "bFilter": true,
                "iDisplayLength": 25,
                "columnDefs": [
                    {
                        "targets": 2,
                        "sortable": true,
                        "type": "formatted-num"
                    },
                    {
                        "targets": 3,
                        "sortable": true,
                        "type": "formatted-num"
                    },
                    {
                        "targets": 'no-sort',
                        "sortable": false
                    }
                ],
                "aaSorting": [2, 'asc']
            }
        );

        $this.bulkAction = function () {

            //submit bulk action
            $this.find('.sq_bulk_submit').on('click', function () {
                var $button = $(this);

                if ($this.find('.sq_bulk_action').find(':selected').val() !== '') {

                    //only if confirmation needed
                    if ($this.find('.sq_bulk_action').find(':selected').data('confirm')) {
                        if (!confirm($this.find('.sq_bulk_action').find(':selected').data('confirm'))) {
                            return;
                        }
                    }

                    var $sq_bulk_input = [];
                    $($this.find('.sq_bulk_input').serializeArray()).each(function () {
                        $sq_bulk_input.push($(this).attr('value'));
                    });

                    $button.addClass('sq_minloading');
                    $.post(
                        sqQuery.ajaxurl,
                        {
                            action: $this.find('.sq_bulk_action').find(':selected').val(),
                            inputs: $sq_bulk_input,
                            sq_nonce: sqQuery.nonce
                        }
                    ).done(function (response) {
                        if (typeof response.message !== 'undefined') {
                            $.sq_showMessage(response.message).addClass('sq_success');

                            //if delete action is called
                            if ($this.find('.sq_bulk_action').find(':selected').val() === 'sq_ajax_rank_bulk_refresh') {
                                $this.find('.sq_bulk_input').each(function () {
                                    if ($(this).is(":checked")) {
                                        $(this).parents('tr:last').find('.sq_research_doserp').remove();
                                        $(this).prop("checked", false);
                                    }
                                });
                            } else if ($this.find('.sq_bulk_action').find(':selected').val() === 'sq_ajax_rank_bulk_delete') {
                                $this.find('.sq_bulk_input').each(function () {
                                    if ($(this).is(":checked")) {
                                        ranksTable.row($(this).parents('tr:last'))
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

        $this.bulkAction();

        return $this;
    };


    $(document).ready(function () {

        if ($('#sq_ranks').find('table.table-ranks').length > 0) {
            $('#sq_ranks').sq_Ranking();
        }


        $('.sq_research_add_briefcase').each(function () {
            $(this).on('click', function () {
                $(this).sq_addBriefcase();
            });
        });
    });

})(jQuery);


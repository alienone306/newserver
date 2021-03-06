(function ($) {
    if (typeof __sq_subscriptionexpired_text === 'undefined') __sq_subscriptionexpired_text = '';
    if (typeof __sq_couldnotprocess_text === 'undefined') __sq_couldnotprocess_text = '';

    $.fn.sq_postslist = function (posts) {
        var $this = this;

        $this.inArray = function (id, array) {
            if (array.length === 0)
                return false;
            for (var i = 0; i < array.length; i++) {
                if (array[i] === id) {
                    return true;
                }
            }
            return false;
        };

        $this.getRanks = function () {
            var $current_rows = $this.find(".sq_slacolumn_row");
            var $current_row ;

            $.post(
                sqQuery.ajaxurl,
                {
                    action: 'sq_ajax_postslist',
                    posts: posts,
                    post_type: $this.find('input[name=post_type]').val(),
                    sq_nonce: sqQuery.nonce
                }
            ).done(function (response) {

                if (typeof response.error !== 'undefined' && response.error === 'subscription_expired') {
                    $current_rows.each(function () {
                        $(this).removeClass('sq_minloading').html('<span class="sq_no_rank">' + __sq_subscriptionexpired_text + '</span>');
                    });
                } else {
                    $current_rows.each(function () {
                        if (!$this.inArray(jQuery(this).attr('ref'), posts)) {
                            $(this).removeClass('sq_minloading').html('<span class="sq_no_rank" ref="' + $(this).attr('ref') + '">' + __sq_ranknotpublic_text + '</span>');
                        }
                    });

                    if (typeof response.posts !== 'undefined') {

                        for (current in response.posts) {
                            $current_row = $this.find(".sq_slacolumn_row[ref='" + current + "']");

                            if (typeof response.posts[current] !== 'undefined') {
                                //get the optimization value
                                $current_row.removeClass('sq_minloading').html(response.posts[current]);

                                //Listen the optimize progressbar
                                if ($current_row.find('.sq_optimize').length > 0) {
                                    $current_row.find('.sq_optimize').on('click', function () {
                                        location.href = sqQuery.adminposturl + "?post=" + current + "&action=edit";
                                    });
                                }
                            }
                        }
                    } else {
                        $current_rows.each(function () {
                            $(this).removeClass('sq_minloading').html('<span class="sq_no_rank" ref="' + current + '">' + __sq_couldnotprocess_text + '</span>');
                        });
                    }
                }
            });
        };

        return $this;
    };

    // listen
    $(document).ready(function () {
        if (typeof sq_posts !== 'undefined') {
            $('.wrap').sq_postslist(sq_posts).getRanks();
        }

    });

})(jQuery);

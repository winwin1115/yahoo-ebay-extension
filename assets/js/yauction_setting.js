var Settings = (function ($) {
    "use strict";
    var initFunc = function() {
        chrome.storage.local.get(['user_name', 'user_id'], function(res) {
            if(res['user_name'] == undefined)
                location.href = 'login.html';
            $('.loggedInUser_name').text(res['user_name'] + 'さん');

            var user_id = res['user_id'];
            var url = api_url + '/getsetting';
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    user_id: user_id
                },
                success: function(response)
                {
                    $('#currency_rate').val(response.currency_rate + '¥');
                    $('#profit_rate').val(response.profit_rate);
                    $('#user_token').val(response.user_token);
                },
                error: function()
                {
                    console.log('fail');
                }
            });
        });  
    };

    $('.logout-btn').click(function () {
        chrome.storage.local.remove(['user_name', 'additem_url'], function() {
            location.href = 'login.html';
        });
    });

    $('.currency-btn').click(function () {
        var currency_rate = $('#currency_rate').val();
        var url = api_url + '/setCurrency';
        chrome.storage.local.get(['user_id'], function(res) {
            var user_id = res['user_id'];
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    currency_rate: currency_rate,
                    user_id: user_id
                },
                success: function(response)
                {
                    swal("成功", "保存されました!", "success");
                    console.log(response.data);
                    setTimeout(function() {
                        location.reload();
                    }, 3000);
                },
                error: function()
                {
                    swal("失敗", "保存に失敗しました!", "error");
                }
            });
        });
    });

    $('.profit-btn').click(function () {
        var profit_rate = $('#profit_rate').val();
        var url = api_url + '/setProfit';
        chrome.storage.local.get(['user_id'], function(res) {
            var user_id = res['user_id'];
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    profit_rate: profit_rate,
                    user_id: user_id
                },
                success: function(response)
                {
                    swal("成功", "保存されました！", "success");
                    setTimeout(function() {
                        location.reload();
                    }, 3000);
                },
                error: function()
                {
                    swal("失敗", "保存に失敗しました！", "error");
                }
            });
        });
    });

    $('.token-btn').click(function () {
        var user_token = $('#user_token').val();
        var url = api_url + '/setToken';
        chrome.storage.local.get(['user_id'], function(res) {
            var user_id = res['user_id'];
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    user_token: user_token,
                    user_id: user_id
                },
                success: function(response)
                {
                    swal("成功", "保存されました！", "success");
                    setTimeout(function() {
                        location.reload();
                    }, 3000);
                },
                error: function()
                {
                    swal("失敗", "保存に失敗しました！", "error");
                }
            });
        });
    });

    return {
        init: function() {
            initFunc();
        }
    }
})(jQuery);

jQuery(document).ready(function() {
    Settings.init();
})
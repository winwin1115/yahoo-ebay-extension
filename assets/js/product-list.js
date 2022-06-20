(function ($) {
    "use strict";
    
    chrome.storage.local.get(['user_name', 'user_id'], function(res) {
        if(res['user_name'] == undefined)
            location.href = 'login.html';
        $('.loggedInUser_name').text(res['user_name'] + 'さん');

        var url = api_url + '/getProductlist';
        var user_id = res['user_id'];

        $.ajax({
            url: url,
            type: 'POST',
            data: {
                user_id: user_id,
                from_type: 'all'
            },
            success: function(response) {
                if(response.status == '200')
                {
                    var table_content = '';
                    table_content += '<div class="table-responsive product-table">\
                        <table class="display" id="basic-1">\
                            <thead>\
                                <tr>\
                                    <th width="90px">画像</th>\
                                    <th>タイトル</th>\
                                    <th>価格(¥)</th>\
                                    <th>商品状態</th>\
                                    <th>在庫</th>\
                                </tr>\
                            </thead>\
                            <tbody>';
                    for(var i = 0; i < response.data.length; i++)
                    {
                        table_content += '<tr>\
                            <td style="text-align: center;"><img style="width: 96px; height: 64px;" src="' + response.data[i]['image_data'] + '"></td>\
                            <td><h6> ' + response.data[i]['title'] + ' </h6></td>\
                            <td>' + response.data[i]['price'] + '</td>\
                            <td>' + response.data[i]['product_status'] + '</td>\
                            <td>' + response.data[i]['stock'] + '</td>\
                        </tr>';
                    }
                    table_content += '</tbody>\
                            </table>\
                        </div>';
                    $('.card-body').html(table_content);
                    $('#basic-1').DataTable();
                }
                else
                    console.log('GetProductList failed!');    
            },
            error: function() {
                console.log('GetProductList failed!');
            }
        });
    });

    $('.logout-btn').click(function () {
        chrome.storage.local.remove(['user_name', 'additem_url'], function() {
            location.href = 'login.html';
        });
    });
})(jQuery);
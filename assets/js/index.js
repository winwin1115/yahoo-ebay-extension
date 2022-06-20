(function ($) {
    "use strict";
    
    chrome.storage.local.get(['user_name'], function(res) {
        if(res['user_name'] == undefined)
            location.href = 'login.html';
        $('.loggedInUser_name').text(res['user_name'] + 'さん');
    });

    $('.logout-btn').click(function () {
        chrome.storage.local.remove(['user_name', 'user_id', 'additem_url'], function() {
            location.href = 'login.html';
        });
    });

    $('.search-btn').click(function () {
        var site_url = $('#site_url').val();
        
        if(!site_url)
        {
            swal("警告", "商品のURLを入力ください", "info");
            return;
        }
        $.ajax({
            url: site_url,
            type: 'GET',
            success: function(response)
            {
                var dom_nodes = $($.parseHTML(response));
                if(dom_nodes.find('#Ckv2 .hd li strong').text() == '家電、AV、カメラ')
                {
                    var products_url_array = [];
                    dom_nodes.find('#mIn #AS1m3 #list01 .inner.cf .bd.cf .a.cf h3 a').each(function() {
                        products_url_array.push($(this).attr('href'));
                    });
                    var count = 0;
                    var result_data = [];
                    for (let x in products_url_array)
                    {
                        $.ajax({
                            url: products_url_array[x],
                            type: 'GET',
                            success: function(result)
                            {
                                var item_nodes = $($.parseHTML(result));
                                var rows_data = {};

                                rows_data['img'] = item_nodes.find('.ProductImage__footer.js-imageGallery-footer .ProductImage__indicator.js-imageGallery-indicator .ProductImage__thumbnails li a img').eq(0).attr('src');

                                rows_data['title'] = item_nodes.find('.ProductTitle__title .ProductTitle__text').text();

                                var price = item_nodes.find('.Price.Price--buynow .Price__borderBox .Price__body .Price__value').text() || item_nodes.find('.Price.Price--buynow .Price__borderBox .Price__body.Price__body--none .Price__value').text();
                                rows_data['price'] = price.replace(/\s+/g, '').split('円')[0];

                                var status = item_nodes.find('.ProductTable__row .ProductTable__th').filter(function() {
                                    return $(this).text() === '状態';
                                }).parent().find('.ProductTable__td .ProductTable__items .ProductTable__item').text();
                                rows_data['status'] = status.replace(/\s+/g, '').split('（')[0];

                                var stock = item_nodes.find('.l-left .ProductDetail__items.ProductDetail__items--primary .ProductDetail__item dl .ProductDetail__title').filter(function() {
                                    return $(this).text() === '個数';
                                }).parent().find('.ProductDetail__description').text();
                                rows_data['stock'] = stock.split('：')[1];

                                rows_data['url'] = products_url_array[x];
                                result_data.push(rows_data);
                                count++;
                                if(count == products_url_array.length)
                                {
                                    var table_content = '';
                                    table_content += '<div class="table-responsive product-table">\
									    <table class="display" id="basic-1">\
                                            <thead>\
                                                <tr>\
                                                    <th>画像</th>\
                                                    <th>タイトル</th>\
                                                    <th>価格(¥)</th>\
                                                    <th>商品状態</th>\
                                                    <th>在庫</th>\
                                                    <th>eBayへ出品</th>\
                                                </tr>\
                                            </thead>\
                                            <tbody>';
                                    for(var i = 0; i < result_data.length; i++)
                                    {
                                        table_content += '<tr>\
                                            <td><img style="width: 96px; height: 64px;" src="' + result_data[i]['img'] + '"></td>\
                                            <td><h6> ' + result_data[i]['title'] + ' </h6></td>\
                                            <td>' + result_data[i]['price'] + '</td>\
                                            <td>' + result_data[i]['status'] +  '</td>\
                                            <td>' + result_data[i]['stock'] + '</td>\
                                            <td><button class="btn btn-success btn-xs ebay-view-btn" data-url="' + result_data[i]['url'] + '" type="button" data-original-title="btn btn-danger btn-xs" title="">eBayへ出品</button></td>\
                                        </tr>';
                                    }
                                    table_content += '</tbody>\
                                            </table>\
                                        </div>';
                                    $('.card-body').html(table_content);
                                    $('#basic-1').DataTable();

                                    $('.ebay-view-btn').click(function () {
                                        chrome.storage.local.remove(['additem_url'], function() {});
                                        chrome.storage.local.set({"additem_url": $(this).data('url')}, function(){});
                                        location.href = 'product_detail.html';
                                    });
                                }
                            }
                        })
                    }
                }
                else
                {
                    swal("警告", "カメラのURLを入力してください", "info");    
                }
            },
            error: function()
            {
                swal("失敗", "検索に失敗しました", "error");
            }
        })
    });
})(jQuery);
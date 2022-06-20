
chrome.browserAction.onClicked.addListener(function(a){
    chrome.storage.local.get(["user_name"], function(res){
        if(res['user_name'] == undefined){
            chrome.tabs.create({
                url: 'theme/login.html'
            });
        }
        else{
            chrome.tabs.create({
                url: 'theme/index.html'
            });
        }
    });
});

setInterval(() => {
    chrome.storage.local.get(['user_id'], function(res) {
        var user_id = res['user_id'];
        var api_url = 'http://3.12.198.63/api';
        // var api_url = 'http://localhost:8000/api';
        var url = api_url + '/getProductlist';
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
                    for(var i = 0; i < response.data.length; i++)
                    {
                        if(response.data[i]['from_type'] == 'Yahoo_Auction')
                        {
                            var temp_url = response.data[i]['site_url'];
                            $.ajax({
                                url: response.data[i]['site_url'],
                                type: 'GET',
                                success: function(result) {
                                    var item_nodes = $($.parseHTML(result));
                                    var end_text = item_nodes.find('.ClosedHeader .ClosedHeader__tag p').text();
                                    if(end_text == 'このオークションは終了しています')
                                    {
                                        var url = api_url + '/updateProduct';
                                        $.ajax({
                                            url: url,
                                            type: 'POST',
                                            data: {
                                                user_id: user_id,
                                                site_url: temp_url
                                            },
                                            success: function() {
                                                
                                            },
                                            error: function() {
                                                
                                            }
                                        });
                                    }
                                    else
                                    {
                                        var stock = item_nodes.find('.l-left .ProductDetail__items.ProductDetail__items--primary .ProductDetail__item dl .ProductDetail__title').filter(function() {
                                            return $(this).text() === '個数';
                                        }).parent().find('.ProductDetail__description').text();
                                        stock = stock.split('：')[1];

                                        var price = item_nodes.find('.Price.Price--buynow .Price__borderBox .Price__body .Price__value').text() || item_nodes.find('.Price.Price--buynow .Price__borderBox .Price__body.Price__body--none .Price__value').text();
                                        price = price.replace(/\s+/g, '').split('円')[0];
                                        var price_array = price.split(',');
                                        var real_price = '';
                                        for(var k = 0; k < price_array.length; k++)
                                            real_price += price_array[k];

                                        var url = api_url + '/checkProduct';
                                        $.ajax({
                                            url: url,
                                            type: 'POST',
                                            data: {
                                                user_id: user_id,
                                                site_url: temp_url,
                                                price: real_price,
                                                stock: stock
                                            },
                                            success: function() {
                                                
                                            },
                                            error: function() {
                                                
                                            }
                                        });
                                    }
                                },
                                error: function() {
                                    alert('aaa');
                                }
                            });
                        }
                    }
                }
                else
                    alert('f');
            },
            error: function() {
                alert('failed');
            }
        });
    });
}, 1000 * 60 * 60 * 24);
var Settings = (function ($) {
    "use strict";
    var initFunc = function() {
        chrome.storage.local.get(['user_name', 'additem_url'], function(res) {
            if(res['user_name'] == undefined)
                location.href = 'login.html';
            $('.loggedInUser_name').text(res['user_name'] + 'さん');

            var item_url = res['additem_url'];
            $.ajax({
                url: item_url,
                type: 'GET',
                success: function(response)
                {
                    var item_nodes = $($.parseHTML(response));
                    var title = item_nodes.find('.ProductTitle__title .ProductTitle__text').text();
                    $('#title').val(title);

                    var status = item_nodes.find('.ProductTable__row .ProductTable__th').filter(function() {
                        return $(this).text() === '状態';
                    }).parent().find('.ProductTable__td .ProductTable__items .ProductTable__item').text();
                    status = status.replace(/\s+/g, '').split('（')[0];
                    $('#status1').val(status);

                    var brand = item_nodes.find('.ProductTable__row .ProductTable__th').filter(function() {
                        return $(this).text() === 'メーカー・ブランド';
                    }).parent().find('.ProductTable__td .ProductTable__items.ProductTable__items--noScroll .ProductTable__item a').text();
                    brand = brand.replace(/\s+/g, '').split('（')[0];
                    $.ajax({
                        url: "http://translate.google.com/translate_a/single?client=webapp&sl=auto&tl=en&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=gt&pc=1&otf=1&ssel=0&tsel=0&kc=1&tk=&q=" + encodeURIComponent( brand ),
                        type: 'GET',
                        success: function(res)
                        {
                            $('#brand').val(res[0][0][0]);
                            $('#model').val(res[0][0][0]);
                        }
                    });

                    var price = item_nodes.find('.Price.Price--buynow .Price__borderBox .Price__body .Price__value').text() || item_nodes.find('.Price.Price--buynow .Price__borderBox .Price__body.Price__body--none .Price__value').text();
                    price = price.replace(/\s+/g, '').split('円')[0];
                    $('#price1').val('円' + price);

                    var stock = item_nodes.find('.l-left .ProductDetail__items.ProductDetail__items--primary .ProductDetail__item dl .ProductDetail__title').filter(function() {
                        return $(this).text() === '個数';
                    }).parent().find('.ProductDetail__description').text();
                    stock = stock.split('：')[1];
                    $('#quantity').val(stock);

                    var image_array = [];
                    item_nodes.find('.ProductImage__footer.js-imageGallery-footer .ProductImage__indicator.js-imageGallery-indicator .ProductImage__thumbnails li a img').each(function() {
                        image_array.push($(this).attr('src'));
                    });
                    var image_data = '';
                    var p = 0;
                    for(var i = 0; i < image_array.length; i++)
                    {
                        p++;
                        image_data += '<figure class="reveal col-xl-2 col-sm-3" itemprop="associatedMedia" itemscope="">\
                                <a href="' + image_array[i] + '" itemprop="contentUrl" data-size="1600x950">\
                                    <img class="img-thumbnail" src="' + image_array[i] + '" itemprop="thumbnail" alt="Image description">\
                                </a>\
                            <figcaption itemprop="caption description">Image caption ' + p + '</figcaption>\
                        </figure>';
                    }
                    $('#aniimated-thumbnials').html(image_data);
                    if (Modernizr.csstransforms3d) {
                        window.sr = ScrollReveal();
                        sr.reveal('.reveal', {
                            duration: 800,
                            delay: 400,
                            reset: true,
                            easing: 'linear',
                            scale: 1
                        });
                    }
                },
                error: function()
                {
                    console.log('fail');
                }
            });
        });

        var getBusinessUrl = api_url + '/getBusinessPolicy';
        $.ajax({
            url: getBusinessUrl,
            type: 'POST',
            data: {
                getUrl: getBusinessUrl
            },
            success: function (response) {
                if(response.status == '200')
                {
                    var business_div = '';
                    business_div += '<div class="col-md-4">\
                        <label class="form-label" for="paymentlist" style="font-size: 18px; font-weight: bold;"><span style="color: red;">*</span>PaymentPolicy</label>\
                        <select class="form-select form-control-primary" name="paymentlist" id="paymentlist">';
                    for(var i = 0; i < response.paymentList.length; i++)
                        business_div += '<option value="' + response.paymentList[i]['profileId'] + '">' + response.paymentList[i]['profileName'] + '</option>';
                    business_div += '</select>\
                        </div>\
                        <div class="col-md-4">\
                            <label class="form-label" for="returnlist" style="font-size: 18px; font-weight: bold;"><span style="color: red;">*</span>ReturnPolicy</label>\
                            <select class="form-select form-control-primary" name="returnlist" id="returnlist">';
                    for(var i = 0; i < response.returnList.length; i++)
                        business_div += '<option value="' + response.returnList[i]['profileId'] + '">' + response.returnList[i]['profileName'] + '</option>';
                    business_div += '</select>\
                        </div>\
                        <div class="col-md-4">\
                            <label class="form-label" for="shippinglist" style="font-size: 18px; font-weight: bold;"><span style="color: red;">*</span>ShippingPolicy</label>\
                            <select class="form-select form-control-primary" name="shippinglist" id="shippinglist">';
                    for(var i = 0; i < response.shippingList.length; i++)
                        business_div += '<option value="' + response.shippingList[i]['profileId'] + '">' + response.shippingList[i]['profileName'] + '</option>';
                    business_div += '</select>\
                        </div>';
                    $('.business_div').html(business_div);
                }
                else
                    console.log('GetBusinessPolicy failed!');
            },
            error: function () {
                console.log('GetBusinessPolicy failed!');
            }
        });
    };

    $('.logout-btn').click(function () {
        chrome.storage.local.remove(['user_name', 'additem_url'], function() {
            location.href = 'login.html';
        });
    });

    $('.auto-tran-btn').click(function () {
        var title = $('#title').val();
        $.ajax({
            url: "http://translate.google.com/translate_a/single?client=webapp&sl=auto&tl=en&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=gt&pc=1&otf=1&ssel=0&tsel=0&kc=1&tk=&q=" + encodeURIComponent( title ),
            type: 'GET',
            success: function(res)
            {
                $('#eng-title').val(res[0][0][0]);
            }
        });
    });

    $('.auto-calc-btn').click(function () {
        chrome.storage.local.get(['user_id'], function(res) {
            var user_id = res['user_id'];
            var price_array = [];
            price_array = $('#price1').val().split('円')[1].split(',');
            var price = '';
            for(var i = 0; i < price_array.length; i++)
                price += price_array[i];
            var url = api_url + '/autoCalc';
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    user_id: user_id,
                    price: price
                },
                success: function(response) {
                    $('#price2').val(response.data.toFixed(3));
                },
                error: function() {
                    swal("失敗", "自動計算に失敗しました！", "error");
                }
            });
        });
    });

    $('.listing-btn').click(function () {
        chrome.storage.local.get(['user_id', 'additem_url'], function (res) {
            var site_url = res['additem_url'];
            var user_id = res['user_id'];
            var title = $('#eng-title').val();
            var category = $('#category2').val();
            var product_status = $('#status2').val();
            var image_data = $('figure a').map(function() {
                return $(this).attr('href');
            }).get();
            var quantity = $('#quantity').val();
            var brand = $('#brand').val();
            var product_type = $('#product_type').val();
            var model = $('#model').val();
            // console.log($($('.summernote').summernote('code')).text());
            // console.log($('.summernote').summernote('code'));
            var description = $('.summernote').summernote('code');
            var price = $('#price2').val();
            var paymentId = $('#paymentlist').val();
            var paymentName = $('#paymentlist').find(':selected').text();
            var returnId = $('#returnlist').val();
            var returnName = $('#returnlist').find(':selected').text();
            var shippingId = $('#shippinglist').val();
            var shippingName = $('#shippinglist').find(':selected').text();
            if(!title)
            {
                notify_func('タイトルを入力してください。');
                return;
            }
            if(!product_status)
            {
                notify_func('商品の状態を選択してください。');
                return;
            }
            if(!product_type)
            {
                notify_func('タイプを選択してください。');
                return;
            }
            if(!description)
            {
                notify_func('商品説明を入力してください。');
                return;
            }
            if(!price)
            {
                notify_func('eBayの価格を入力してください。');
                return;
            }
            if(!paymentId)
            {
                notify_func('PaymentPolicyを確認してください。');
                return;
            }
            if(!returnId)
            {
                notify_func('ReturnPolicyを確認してください。');
                return;
            }
            if(!shippingId)
            {
                notify_func('ShippingPolicyを確認してください。');
                return;
            }
            // title = '[Used] NIKON AF MICRO NIKKOR 105mm F2.8 D';
            // category = '31388';
            // product_status = '3000';
            // var image_data = [];
            // image_data = ["https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0211/users/cb975a11f8c83dd0afdb6cfa04c25613fbd080b4/i-img842x1200-1637735311bedx0v2248.jpg",
            // "https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0211/users/cb975a11f8c83dd0afdb6cfa04c25613fbd080b4/i-img1200x780-1637735311qbaqbf11204.jpg",
            // "https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0211/users/cb975a11f8c83dd0afdb6cfa04c25613fbd080b4/i-img1200x914-1637735311yn1gpm498664.jpg",
            // "https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0211/users/cb975a11f8c83dd0afdb6cfa04c25613fbd080b4/i-img1200x859-1637735311okhz4m1012.jpg"];
            // quantity = '1';
            // brand = 'Nikon';
            // product_type = '3D';
            // model = 'Nikon';
            // description = '3D Camera';
            // price = '33.5';
            // site_url = 'https://page.auctions.yahoo.co.jp/jp/auction/q1021866468';
            // user_id = '1';
            var url = api_url + '/addItem';
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    title: title,
                    categoryid: category,
                    product_status: product_status,
                    quantity: quantity,
                    image_data: image_data,
                    brand: brand,
                    product_type: product_type,
                    model: model,
                    description: description,
                    price: price,
                    paymentId: paymentId,
                    paymentName: paymentName,
                    returnId: returnId,
                    returnName: returnName,
                    shippingId: shippingId,
                    shippingName: shippingName,
                    site_url: site_url,
                    user_id: user_id
                },
                success: function(response) {
                    if(response.status == '200')
                    {
                        swal("成功", "出品に成功しました。", "success");
                        chrome.storage.local.remove(['additem_url'], function() {});
                        location.href = 'index.html';
                    }
                    else if(response.status == '300')
                    {
                        swal("失敗", "UserTokenを発行してください。", "error");
                    }
                    else
                        swal("失敗", "出品に失敗しました。", "error");
                },
                error: function() {
                    swal("失敗", "出品に失敗しました。", "error");
                }
            });
        });
    });

    function notify_func(message)
    {
        $.notify({
            title: '警告',
            message: message
        },
        {
            type:'danger',
            allow_dismiss:false,
            newest_on_top:false ,
            mouse_over:false,
            showProgressbar:false,
            spacing:10,
            timer:2000,
            placement:{
              from:'top',
              align:'right'
            },
            offset:{
              x:30,
              y:30
            },
            delay:1000 ,
            z_index:10000,
            animate:{
              enter:'animated bounce',
              exit:'animated bounce'
          }
        });
    }

    return {
        init: function() {
            initFunc();
        }
    }
})(jQuery);

jQuery(document).ready(function() {
    Settings.init();
});
(function ($) {
    "use strict";
    
    chrome.storage.local.get(['user_name'], function(res) {
        if(res['user_name'] != undefined)
            location.href = 'index.html';
    });

    $('.login-btn').on('click', function () {
        if(!$('#email').val())
        {
            notify_func('メールアドレスを入力してください。');
            return;
        }
        if(!$('#password').val())
        {
            notify_func('パスワードを入力してください。');
            return;
        }
        if(!$('#license').val())
        {
            notify_func('ライセンスを入力してください。');
            return;
        }
        
        var url = api_url + '/login';
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                email: $('#email').val(),
                password: $('#password').val(),
                license: $('#license').val(),
                remember: $('#remember').val()
            },
            success: function(response){
                if(response.status == '200')
                {
                    swal("成功", "ログインに成功しました!", "success");
                    chrome.storage.local.set({"user_name": response.data[0]['first_name']}, function(){});
                    chrome.storage.local.set({"user_id": response.data[0]['id']}, function(){});
                    setTimeout(function(){
                        location.href = 'index.html';
                    }, 3000);
                }
                else if(response.status == '300')
                {
                    swal("警告", response.message, "info");
                }
                else
                    swal("失敗", "ログイン情報を確認してください!", "error");
            }
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
              align:'left'
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

})(jQuery);
(function ($) {
    "use strict";
    
    chrome.storage.local.get(['user_name'], function(res) {
        if(res['user_name'] != undefined)
            location.href = 'index.html';
    });
    
    $('.signup-btn').on('click', function () {
        if(!$('#first_name').val())
        {
            notify_func('お名前(姓)を入力してください。');
            return;
        }
        if(!$('#last_name').val())
        {
            notify_func('お名前(名)を入力してください。');
            return;
        }
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
        
        var url = api_url + '/signup/';
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                first_name: $('#first_name').val(),
                last_name: $('#last_name').val(),
                email: $('#email').val(),
                password: $('#password').val()
            },
            success: function(response){
                console.log(response.status);
                if(response.status == '200')
                {
                    swal("成功", "正常に登録されました!", "success");
                    setTimeout(function(){
                        location.href = 'login.html';
                    }, 3000);
                }
                else
                    swal("お知らせ", "そのメールアドレスはすでに使用中です!", "info");
            },
            error: function(){
                swal("失敗", "登録に失敗しました!", "error");
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
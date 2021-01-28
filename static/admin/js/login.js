/*
 +----------------------------------------------------------------------
 | login.js 后台登录javascript
 +----------------------------------------------------------------------
 | Time 2020-03-17
 +----------------------------------------------------------------------
 | Author: lhh <1913555371@qq.com>
 +----------------------------------------------------------------------
*/

layui.use(['layer' , 'form'] , function () {
    layer = layui.layer;
    form = layui.form;
    $ = layui.$;

    /*表单提交验证*/
    form.verify({
        user: function(value, item){  //管理员验证
            if(!/^.+$/.test(value)){
               $(item).focus();
               return '管理员不能为空';
            }
            if(!/^[\u4E00-\u9FA5a-zA-Z\d]{2,18}$/.test(value)){
               $(item).focus();
               return '管理员格式错误';
            }
        },
        pwd : function (value , item) {   //密码验证
            if(!/^.+$/.test(value)){
                $(item).focus();
                return '密码不能为空';
            }
            if(!/^[a-zA-Z\d\-_\.!@]{6,26}$/.test(value)){
                $(item).focus();
                return '密码格式错误';
            }
        },
        code : function (value , item) {   //验证码验证
            if(!/^.+$/.test(value)){
                $(item).focus();
                return '验证码不能为空';
            }
            if(!/^[\da-zA-Z]{4}$/.test(value)){
                $(item).focus();
                return  '验证码为长度4位的数字、字母组成';
            }
        }
    });
    form.on('submit(login)', function(data){   //登录
        var token_elem = $("meta[name='csrf-token']");
        var token = token_elem.attr('content');
        var admin_url = $("meta[name='admin-url']").attr('content');
        var load_index = layer.load(0);
        $.ajax({
            url : data.form.action ,
            type : data.form.method,
            data : data.field,
            dataType : 'JSON',
            headers : {
              'X-CSRF-TOKEN' : token
            },
            success(res){
                if(res.code == 1){  //登录成功
                    location = admin_url;
                    return;
                }else if(res.code == -3){
                    $(".captcha img").click();
                }
                if(res.token){  //如果有token返回
                    token_elem.attr('content' , res.token);
                }
                layer.msg(res.msg , {icon : 2});
            },
            error(){

            },
            complete(){
                location = 'index.html';
                layer.close(load_index);
            }
        });
        return false;
    });


    $(".captcha img").click(function () { //换验证码
        var url = $(this).data('url');
        if(!url){  //没有
            url = $(this).attr('src');
            $(this).data('url' , url);
        }
        $(this).attr('src' , url + '?' + Math.random());
    });

});
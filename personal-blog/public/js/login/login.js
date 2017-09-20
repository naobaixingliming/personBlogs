/** Created by Liming on 2017/7 */

function cambiar_login() {
    document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_login";
    document.querySelector('.cont_form_login').style.display = "block";
    document.querySelector('.cont_form_sign_up').style.opacity = "0";
    setTimeout(function(){  document.querySelector('.cont_form_login').style.opacity = "1"; },400);
    setTimeout(function(){
        document.querySelector('.cont_form_sign_up').style.display = "none";
    },200);
}

function cambiar_sign_up(at) {
    document.querySelector('.cont_forms').className = "cont_forms cont_forms_active_sign_up";
    document.querySelector('.cont_form_sign_up').style.display = "block";
    document.querySelector('.cont_form_login').style.opacity = "0";
    setTimeout(function(){  document.querySelector('.cont_form_sign_up').style.opacity = "1";
    },100);
    setTimeout(function(){   document.querySelector('.cont_form_login').style.display = "none";
    },400);
}

function ocultar_login_sign_up() {
    document.querySelector('.cont_forms').className = "cont_forms";
    document.querySelector('.cont_form_sign_up').style.opacity = "0";
    document.querySelector('.cont_form_login').style.opacity = "0";
    setTimeout(function(){
        document.querySelector('.cont_form_sign_up').style.display = "none";
        document.querySelector('.cont_form_login').style.display = "none";
    },500);
}

// function check(pwd){
//     //6-18位 ，由数字、大写字母、小写字母、特殊字符
//     var r = /^[0-9a-zA-Z!@#$^]{6,18}$/;//特殊字符可以补充，与后续校验同步即可
//     if(r.test(pwd)){
//         var a = /[0-9]/.exec(pwd)!=null ? 1:0;
//         var b = /[a-z]/.exec(pwd)!=null ? 1:0;
//         var c = /[A-Z]/.exec(pwd)!=null ? 1:0;
//         var d = /[!@#$^]/.exec(pwd)!=null ? 1:0;
//         return a + b + c + d >= 2;//至少2种
//     }
//     return false;
// }
/**
 *
        登录 、注册
*
*/
var login={
    init:function () {
        this.bindEvent();
    },
    bindEvent:function () {

        // 登录
        $('#loginBtn').on('click',function () {
            $.ajax({
                type:'post',
                url:'/api/user/login',
                dataType:'json',
                data:{
                    username:$('.cont_form_login').find('[ name="username"]').val(),
                    password:$('.cont_form_login').find('[ name="password"]').val()
                },
                success:function (res) {
                    if( res.code!=0){
                        $('.cont_form_login').find('.colWarning').html(res.message);
                        return;
                    }
                    $('.cont_form_login').find('.colWarning').html('<i style="color: #43d063;">'+res.message+'</i>');
                    setTimeout(function () {
                        if(!res.personInfo.preUrl){
                            location.href='http://localhost:8081/';
                        }else {
                            location.href=res.personInfo.preUrl;
                        }
                        // window.history.back();  location.reload();
                    },1000);
                }
            })
        });

        //注册
        $('#registerBtn').on('click',function () {
            var usernameReg =/[\u4E00-\u9FA5]/ ; //包含中文
            var pwdReg = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){5,19}$/; //密码规则：只能输入6-20个以字母开头、可带数字、“_”、“.”的字串
            var username=$('.cont_form_sign_up').find('[ name="username"]').val(),
                password=$('.cont_form_sign_up').find('[ name="password"]').val(),
                repassword=$('.cont_form_sign_up').find('[ name="repassword"]').val();
            if(!username){
                $('.cont_form_sign_up').find('.colWarning').html('用户名不能为空');
                return;
            }
            if(!usernameReg.test(username)){
                $('.cont_form_sign_up').find('.colWarning').html('用户名必须包含中文');
                return;
            }
            if(!password){
                $('.cont_form_sign_up').find('.colWarning').html('密码不能为空');
                return;
            }
            if(!pwdReg.test(password)){
                $('.cont_form_sign_up').find('.colWarning').html('密码只能输入6-20个以字母开头、可带数字 _ . 的的组合');
                return;
            }
            if(repassword!=password){
                $('.cont_form_sign_up').find('.colWarning').html('二次密码输入不同');
                return;
            }
            $.ajax({
                type:'post',
                url:'/api/user/register',
                dataType:'json',
                data:{
                    username:$('.cont_form_sign_up').find('[ name="username"]').val(),
                    password:$('.cont_form_sign_up').find('[ name="password"]').val(),
                    repassword:$('.cont_form_sign_up').find('[ name="repassword"]').val()
                },
                success:function (res) {
                    // if(res.code!=0){
                    //     $('.cont_form_sign_up').find('.colWarning').html(res.message);
                    // }
                    $('.cont_form_sign_up').find('.colWarning').html('<i style="color: #43d063;">'+res.message+'</i>');
                     setTimeout(function () {
                         //ocultar_login_sign_up();
                         // window.history.back();location.reload();
                         if(!res.personInfo.preUrl){
                             location.href='http://localhost:8081/';
                         }else {
                             location.href=res.personInfo.preUrl;
                         }
                    },1000);
                }
            })
        });


    }

};
login.init();

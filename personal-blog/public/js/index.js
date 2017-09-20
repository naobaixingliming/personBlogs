/** Created by Liming on 2017/7 */
(function () {

var index={
    setSlide:function () {  },
    logout:{
        init:function () {
            //退出
            $('#logout').on('click',function () {
                //console.log('out');
                $.ajax({
                    type:'get',
                    url:'/api/user/logout',
                    success:function (res) {
                        //console.log(res);
                        if(!res.code){
                            window.location.reload();
                        }
                    }
                })
            });
        }
    },

};
index.logout.init();
})();
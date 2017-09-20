/** Created by Liming on 2017/9 */
var content = {
    /**
     *  内容页
     */
    contentIndex: {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {
            var $valId = $('#contentId').val();
            $('.deleteBtn').on('click', function () {
                $('#popupBox').show();
            });
            //删除
            $('#popupBox .btn-warning').on('click', function () {
                $.ajax({
                    type: 'get',
                    url: '/admin/content/delete',
                    data: {contentId: $valId},
                    success: function () {
                        setTimeout(function (args) {
                            $('#popupBox').hide();
                            location.reload();
                        }, 1000)
                    }
                });
            });
            //取消
            $('#popupBox .btn-info').on('click', function () {
                $('#popupBox').hide();
            });
        }
    },


    /**
     *  详情页
     */
    views: {
        comments:[],
        flag: true,
        currentPage:1,
        init: function () {
            this.initAjax();
            this.comments();
            this.page();
        },
        initAjax:function(){
            $.ajax({
                url: '/api/user/comment',
                data: {
                    contentId: $('#contentId').val()
                },
                success: function (res) {
                    content.views.comments=res.data.reverse();
                    content.views.render();
                }
            });
        },
        //提交评论
        comments: function () {
            $('#messageCount').html($('.messageBox').length);
            $('#messageBtn').on('click', function () {
                if ($('#messageContent').val() == '') {
                    return;
                }
                if (content.views.flag==true) {
                    content.views.flag = false;
                    $.ajax({
                        type: 'post',
                        url: '/api/user/comment',
                        data: {
                            contentId: $('#contentId').val(),
                            content: $('#messageContent').val()
                        },
                        success: function (res) {
                            console.log(res);
                            content.views.comments = res.data.comments.reverse();
                            content.views.render();
                        }
                    });
                    content.views.flag=true;
                    $('#messageContent').val('');
                }
            });
        },
        //渲染页面
        render: function () {
            var data=content.views.comments;
            var limit=5,    //每页显示条数
                count=data.length,
                currentPage= content.views.currentPage,  //当前页
                totalPages=Math.max(Math.ceil(count/limit),1);        //总页数 最小为1

            var start=Math.max(0,(currentPage-1)*limit),
                end=Math.min(start+limit,count);

            var $lis=$('.pager li');
            if(currentPage<=1){
                currentPage=1;
                $lis.eq(0).html('<span>没有上一页</span>');
            }else {
                $lis.eq(0).html('<a href="javascript:;">上一页</a>');
            }
            if(currentPage>=totalPages){
                currentPage=totalPages;
                $lis.eq(2).html('<span>没有下一页</span>');
            }else {
                $lis.eq(2).html('<a href="javascript:;">下一页</a>');
            }
            $lis.eq(1).html(currentPage+'/'+totalPages);

           var htmlStr='';
           for(var i=start;i<end;i++){
               htmlStr+='<div class="messageBox"><p>'+data[i].content +'</p><p class="color_999 clear"><span class="fl mar-right-10">'+decodeURI(data[i].username) +'</span><span class="fr mar-right-10">'+content.views.formatDate(data[i].submitTime)+'</span></p></div>';
           }
            if(data.length==0){
                $('.messageList').html('<div class="messageBox"><p>还没有留言</p></div>');
            }else {
                $('.messageList').html(htmlStr);
            }
        },
        //日期格式化
       formatDate:function (d) {
           var date=new Date(d);
           return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
       },
        //分页
        page:function () {
            //上一页 下一页 事件
            $('.pager').delegate('li','click',function () {
                if($(this).hasClass('previous')){
                    content.views.currentPage--;
                    content.views. render();
                }
                if($(this).hasClass('next')){
                    content.views.currentPage++;
                    content.views.render();
                }
            });
        }


    }
};

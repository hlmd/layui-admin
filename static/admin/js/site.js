/*
 +----------------------------------------------------------------------
 | site.js 后台框架javascript
 +----------------------------------------------------------------------
 | Time 2020-01-17
 +----------------------------------------------------------------------
 | Author: lhh <1913555371@qq.com>
 +----------------------------------------------------------------------
*/

NProgress.configure({parent : 'body'}).start();   //页面加载进度条
$(document).ready(function (){
    setHeaderNav($('.admin-header') , $('.admin-header .list li > dl')); //头部悬浮栏 设置不超出
    // setHeaderNav($('.admin-page') , $('.admin-page .btn .list'));
    setMenuOff();  //改变分辨率改变是否显示菜单
    headerNavHoverBar(); //头部菜单悬浮特效
    leftNavClick(); //左侧菜单展示子类
    leftNavBar(); //左侧菜单栏悬浮bar
    setDefaultPage(); //打开默认页

    $(".close_page_now").click(function () {   //关闭当前标签页
        delPage($('.admin-page .page-list .page-item.on:not(.default)'));
    });
    $(".close_page_other").click(function () {   //关闭其他标签页
        delPage($('.admin-page .page-list .page-item:not(.default,.on)'));
    });
    $(".close_page_all").click(function () {   //关闭全部标签页
        delPage($('.admin-page .page-list .page-item:not(.default)'));
    });
    //设置左侧菜单滚动条
    jQuery(".nav-list").scrollbar();

    //标签滚动条
    jQuery(".page-list").scrollbar();
    setItemScrollX('.page-list.scroll-content');

    //切换标签页
    setChangePage('.admin-page .change-page' , '.page-list .page-item.on');

    $("#changeMenu , .admin-menu-zzc").click(function () {
        changeMenu(); //改变左侧菜单显示
    });

    $(window).resize(function (){
        setHeaderNav($('.admin-header') , $('.admin-header .list li > dl')); //头部悬浮栏 设置不超出
        // setHeaderNav($('.admin-page') , $('.admin-page .btn .list'));  //菜单悬浮栏 设置不超出
        setMenuOff(); //改变分辨率改变是否显示菜单
        changePage($('.page-item.on'));
        setItemScrollX('.page-list.scroll-content');
    });

    //页面进度条加载完成
    NProgress.done();
});


//左侧菜单展示子类
function leftNavClick(){
    $('.nav-list a').click(function (e) {

        var is_has_child = $(this).next('dl').length;

        //关闭兄弟掌开
        var nav_item = $(this);


        //选中父节点
        if(nav_item.parent('li').length == 0){ //不是一级
            nav_item.parents('dl').each(function (i , item) {
                var a_item = $(item).prev('a');
                if(a_item.hasClass('on') == false){
                    a_item.click();
                }
            });
        }

        if(is_has_child == 1){ //有子类
            //关闭兄弟掌开
            $(this).parent().siblings('.on').each(function (i , on_item) {
                if($(on_item).children('.has_child.on').length){  //有兄弟展开的
                    $(on_item).removeClass('on').find('.on:not(a) , .has_child.on').removeClass('on');
                }
            });
            //var zi_count = $(this).next('dl').children().length;
            //$(this).next('dl').css('--count' , zi_count);
            if(nav_item.hasClass('has_child') == false){
                nav_item.addClass('has_child');
            }
            if($("#main.off").length == 0){   //如果不是图标菜单模式
                nav_item.parent().toggleClass('on').children().toggleClass('on');
            }else{
                nav_item.parent().toggleClass('on').children().addClass('on');
            }
            if(e.hasOwnProperty('originalEvent')){  //手动点击的话就展开
                changeMenu('remove');
            }
        }else{ //没得子类

            $(this).parents('dd , dl , li').each(function (i , on_item) {
                $(on_item).siblings('*:not(.has_child)').removeClass('on').find('.on').removeClass('on');
            });

            if(nav_item.hasClass('on') == false){
                nav_item.addClass('on');
                nav_item.parent().addClass('on');
            }
            if($(window).innerWidth() < 992){  //如果小于992px 就收起左侧菜单栏
                changeMenu('add');
            }
            pageOpen(nav_item); //打开页面
        }
        nav_item.parents('li').mouseover();
    });
}


//改变左侧菜单显示
function changeMenu(action){
    var title = '展开';
    action = action || false;
    if(action != false){  //手动设置
        eval("$('#main')." + action + "Class('off')");
    }else{
        $("#main").toggleClass('off');
    }

    if($("#main").hasClass('off') == false){
        title = '收起';
        $(".admin-menu .nav-list li > a").attr('title' , null);
    }else{
        $(".admin-menu .nav-list li > a").each(function () {
            var title = $(this).find('span').text();
            $(this).attr('title' , title);
        });
    }
    $("#changeMenu").attr('title' , title);
}


//左侧菜单栏悬浮bar
function leftNavBar(){
    $(".nav-list li").hover(function () {
        var height = $(this).children('a').innerHeight();
        var offsetTop = $(this).offset().top;
        var scrollTop = $(this).parent().scrollTop();
        $(this).siblings('.nav-bar').css({height: height , top: offsetTop - height + scrollTop});

    },function () {
        var height = $(this).children('a').innerHeight();
        var offsetTop = $(this).offset().top;
        var scrollTop = $(this).parent().scrollTop();

        $(this).siblings('.nav-bar').css({height: 0 , top: offsetTop - (height / 2)  + scrollTop});
    });
}


//头部悬浮栏设置不超出
function setHeaderNav(fa , list){
    var fa_width = fa.innerWidth();
    var fa_left = fa.offset().left;
    list.removeClass('right left');
    list.each(function (i , item) {
        var this_width = $(item).innerWidth();
        var this_left = $(item).offset().left;
        if(this_left <= fa_left){  //小于左边
            $(item).addClass('left');
        }else if(this_left + this_width >= fa_left + fa_width){   //大于左边
            $(item).addClass('right');
        }
   });
}


//改变分辨率改变是否显示菜单
function setMenuOff(){
    var width = $(window).innerWidth();
    if(width > 992){ //展开菜单
        changeMenu('remove');
    }else{
        changeMenu('add');
    }

}


//头部菜单悬浮特效
function headerNavHoverBar(){
    $('.admin-header .list li').hover(function () {
        var width = $(this).innerWidth();
        var left = $(this)[0].offsetLeft;
        $(this).siblings('.bar').css({'width' : width , 'left' : left});
    },function () {
        var width = $(this).innerWidth();
        var left = $(this)[0].offsetLeft;
        $(this).siblings('.bar').css({'width' : 0 , 'left' : left + (width / 2)});
    });
}


//设置默认打开页
function setDefaultPage(){
    var menu_item = $('.admin-menu > div');
    var menu_url = menu_item.data('url');
    if(menu_url){  //如果有默认页 只能设置一个
        var menu_title = menu_item.data('title') || '主页';
        var aDom = $("<a>");
        aDom.data('url' , menu_url ).data('title' , menu_title);
        pageOpen(aDom);
        return;
    }

    //可以打开多个 只需a[class=default]
    var a_item = $(".admin-menu .nav-list a.default");
    if(a_item.length != 0){
        a_item.each(function (i , item) {
            var dl = $(item).next('dl');
            if(dl.length == 1){  //如果有子类
                dl.find('a').eq(0).click();
                return;
            }
            //没有子类
            $(item).click();
        });
        return;
    }
    //没有设置默认页就默认的一个
    menu_item.find('a').each(function (i , item) {
        var dl = $(item).next('dl');
        if(dl.length == 0){  //如果有子类
            $(item).click();
            return false;
        }
    });

}


//增加菜单栏
function addPageItem(id , title , is_default) {
    var item = $('<div>');
    item.attr({'id' : 'page-item' + id});
    item.data('id' , id);
    item.addClass('page-item');
    item.append($("<p>").text(title));
    if(!is_default){ //如果不是默认
        var close = $('<span>');
        close.append('<i class="iconfont icon-guanbi"></i>');
        close.click(function () { //关闭本页面
            delPage($(this).parent());
        });
        item.append(close);
    }else{ //是默认的
        item.addClass('default');
    }
    item.click(function () {  //绑定点击事件
        var id = $(this).data('id');
        var nav_item = $("#page-nav" + id);
        nav_item.click();
        changePage($(this));
    });
    item.hover(function () {   //悬浮移动bar到自己上
        changePage($(this) , true);
    } , function () {   //离开移动到默认上
        changePage($('.page-item.on') , true);
    });
    $(".admin-page .page-list").append(item);
    changePage(item);
    return item;
}


//设置菜单Bar回到默认
function setPageBar(bar , item){
    left = item[0].offsetLeft
    width = item.innerWidth();
    $(bar).css({
        width : width,
        left : left
    });
}


//关闭页
function delPage(elem) {
    elem.each(function (i , item) {
        var id = $(item).data('id');
        setOnPage($(item));
        $("#page-body" + id + ' , #page-item' + id).remove();
        $("#page-nav" + id).removeClass('on');
    });
}


//设置页选中
function setOnPage(item) {
    var next = item.next('.page-item');
    var prev = item.prev('.page-item');
    var now = {click:function () {}};
    if(next.length == 1){ //有下一个
        now = next;
    }else if(prev.length == 1){
        now = prev;
    }
    now.click();
}


//设置切换标签页
function setChangePage(ev , elem) {
    $(ev).click(function () {
        var next = $(elem).next('.page-item');
        var prev = $(elem).prev('.page-item');
        if($(this).hasClass('prev') == true){ //切换是一个
            if(prev.length == 0)return;
            prev.click();
        }else{  //切换下一个
            if(next.length == 0)return;
            next.click();
        }
    });
}


//切换标签页
function changePage(item , hover) {
    if(!item || !item.length){
        return;
    }
    var left = item[0].offsetLeft;
    var width = item.innerWidth();
    var fa = item.parent();
    var fa_left = fa.scrollLeft();
    var fa_width = fa.width();
    var wz = 0;
    var speed = 0;
    if(left < fa_left && !hover){ //如果在左边没有显示出来
        var range = fa_left - left;
        speed = range / 50 * 45;
        fa.animate({scrollLeft:left},speed);
    }else if(fa_left + fa_width < left + width && !hover){ //如果在右边没有显示出来
        left = left - width;
        var range =  left - fa_left;
        speed = range / 50 * 45;
        fa.animate({scrollLeft:left},speed);
    }
    setTimeout(function () {  //设置bar位置
        setPageBar('.page-bar', item);
    } , speed + 1);
}


//打开页面
var pageCount = 0;
function pageOpen(item) {
    var id = item.data('id');
    var title = item.data('title') || item.find('span').text();
    var url = item.data('url') || item.attr('href') || false;
    var is_default = item.hasClass('default');
    if(!url){   //如果没有地址就禁用
        return false;
    }
    if(!id){  //没有id就赋值
        id = ++pageCount;
        item.data('id' , id);
        item.attr('id' , 'page-nav' + id);
    }
    var pageBody = $("#page-body" + id);  //页面
    var pageItem = $("#page-item" + id);  //菜单
    if(pageBody.length == 0 && pageItem.length == 0){  //如果不存在 就增加
        pageBody = $('<iframe>');
        pageBody.attr({'src' : url , 'id' : 'page-body' + id});
        pageBody.data('id' , id);
        pageBody.addClass('page-body');
        pageBody[0].onload = function(){
            NProgress.done();
        };
        $(".admin-body").append(pageBody);
        pageItem = addPageItem(id , title , is_default);
        NProgress.configure({parent : '.admin-body'}).start();
    }
    if(pageBody.hasClass('on') == false){   //没有被选中
        $(".admin-body").find('.on').removeClass('on');
        pageBody.addClass('on');
        $(".admin-page .page-list").find('.on').removeClass('on');
        pageItem.addClass('on');
        changePage(pageItem);
    }

}


//设置鼠标滚动
function setItemScrollX(item) {
    var left = 0;
    $(item).unbind('mousewheel').mousewheel(function (event) {
        var min = 0;
        var max = 0;
        $(this).children().each(function () {
            max += $(this).innerWidth();
        });
        max -= $(item).width();
        if(event.deltaY == -1){  //右滚动
            left+=50;
            if(left >= max){
                left = max;
            }
        }else {  //左滚动
            left-=50;
            if (left <= min) {
                left = min;
            }
        }
        $(item).animate({scrollLeft:left},45);
    });
}





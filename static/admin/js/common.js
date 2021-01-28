/*
 +----------------------------------------------------------------------
 | common.js 后台公共方法javascript
 +----------------------------------------------------------------------
 | Time 2020-03-29
 +----------------------------------------------------------------------
 | Author: lhh <1913555371@qq.com>
 +----------------------------------------------------------------------
*/

/*
*  格式化时间
*  @method date(tpye , time)
*  @param format string 'Y-m-d H:i:s' 时间格式
*  @param time timestamp 时间戳 毫秒
*  @param fill_zero boolean 小于10是否补充0 默认true
*  @return string '2019-03-29 19:17:22'
*  例如：
*   date('Y年m月d日 H时i分s秒')
*   输出 2019年03月29日 19时17分22秒
* */
function date( format  , time , fill_zero){
    if(fill_zero === undefined){
        fill_zero = true;
    }
    if(time){
        var date = new Date(time);
    }else{
        var date = new Date();
    }
    var replace = {
        'Y' : date.getFullYear(),   //年
        'm' : date.getMonth() + 1,  //月
        'd' : date.getDate(),       //日
        'H' : date.getHours(),      //时
        'i' : date.getMinutes(),    //分
        's' : date.getSeconds(),    //秒
    }
    for(let key in replace){
        var value = replace[key];
        if(fill_zero && value < 10){
            value = '0' + value;
        }
        format = format.replace( key , value);
    }
    return format;
}
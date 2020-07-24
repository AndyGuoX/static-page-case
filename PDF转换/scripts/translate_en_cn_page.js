$(function () {
    var $en_cn = $(".en-cn");//获取中英文转换div
    var path; //路径名前缀
    //获取路径名
    var path_name = window.location.pathname;
    //获取最后的文件名
    var file_name = path_name.substring(path_name.lastIndexOf("/") + 1);
    $en_cn.on("click", function () {
        //在中文页面下
        if ($(this).text() === "English") {
            path = "./../../en/views/";
        } else {  //英文页面下
            path = "./../../cn/views/";
        }
        window.location.href = path + file_name;
    });

    var $title = $(".top-title h1"); //获取网站标题
    //刷新页面时判断窗口大小
    if (window.innerWidth <= 768) {
        if ($en_cn.text() === "English") {
            $title.text("极速网");
        } else if ($en_cn.text() === "简体中文") {
            $title.text("SWIFT");
        }
    }

    //实时监听窗口大小的变换
    $(window).resize(function () {
        if ($en_cn.text() === "English") {
            if (window.innerWidth <= 768) {
                $title.text("极速网");
            } else {
                $title.text("极速网PDF在线转换");
            }
        } else if ($en_cn.text() === "简体中文") {
            if (window.innerWidth <= 768) {
                $title.text("SWIFT");
            } else {
                $title.text("SWIFT PDF online conversion");
            }
        }
    });
});
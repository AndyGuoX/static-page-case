$(function () {
    var $en_cn = $(".en-cn");//获取中英文转换div
    var $title = $(".top-title h1"); //获取网站标题
    //刷新页面时判断窗口大小
    if (window.innerWidth <= 768) {
        if ($en_cn.text() === "English") {
            $title.text("极速网");
        } else if ($en_cn.text() === "简体中文") {
            $title.text("SWIFT");
        }
    }

    //切换页面的中英文
    $en_cn.on("click", function () {
        var itself_text = $(this).text();
        if (itself_text === "English") {
            window.location.href = "./../en/index.html";
        } else if (itself_text === "简体中文") {
            window.location.href = "./../cn/index.html";
        }
    });

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
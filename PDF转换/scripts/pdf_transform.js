var $main_box = $(".main-box"); // 选择文件的区域
var $select_complete = $(".select-complete"); // 选择完成的区域
var $server_notFound = $(".transform-server-notFound");// 服务器错误提示区域
var $file_list = $select_complete.find(".file-list");// 展示已经选择的文件
var $input_file = $("input[name = selectName]");// 获取file input
var $upload_btn = $(".upload-btn button"); // 提交按钮
var $reselect_btn = $(".reselect-btn button"); // 重选按钮
var $progress_bar = $(".progress-bar"); // 获取进度条
var $completed = $progress_bar.find(".completed");// 获取也完成的进度条
var $reload = $(".reload");// 点击重新加载
var $select_error = $(".select-error");// 获取到文件错误的区域快
var timer; // 定义一个进度条计时器
var $error_tip = $(".error-tip p"); // 文件错误提示语
var $error_tip_text = $error_tip.text();
var $transform_failure = $(".transform-failure"); // 转换失败的板块
var $failure_detail = $(".transform-failure-detail"); //失败信息区域
var json_data;//存放从后台接受的json
var $file_box_node = []; // 存放文件图标的li
var file_name_list = []; // 存放文件名称的数组
var close_button = $(".close-preview-box");
$(function () {
    //从其他页面返回时，文件改变函数会报错

    // 点击div的时候模拟用户点击input[type = file]以选择文件
    $main_box.on("click", function () {
        $input_file.trigger("click");
    });

    // 重选选择
    $reselect_btn.on("click", function () {
        $input_file.trigger("click");
    });

    // 重新加载
    $reload.on("click", function () {
        location.reload(true);// 相当于按F5
    });

    // 点击上传按钮提交文件
    $upload_btn.on("click", function () {
        $reselect_btn.css("display", "none");
        $(this).attr("disabled", "true");
        $(this).css({
            "backgroundColor": "#ccc",
            "cursor": "default"
        });
        $(".transform-icon").css("display", "block");
        $progress_bar.css("display", "block");
        timer = setInterval(progressBar, 666);
        var url;
        if (form_data.get("fileStyle") === "pdf") {
            url = "/pdfto/others.do";// pdf转其他文件
        } else {
            url = "/first/updAndRegis.do";// 其他文件转pdf
        }

        // 异步提交数据
        $.ajax({
            url: url,// 传输地址
            type: "post",
            data: form_data, /* 对象中key为文件名，val为文件，最后两个键为当前文件类型fileStyle和toFileStyle(ppt,word,pdf,excel) */
            cache: false, /* 禁止缓存 */
            processData: false, /* 禁止处理数据 */
            contentType: false, /* 不设置内容类型 */
            dataType: "json",
            success: function (data) {
                json_data = data;
                if (json_data.result) { //转换成功
                    for(var i=0;i<json_data.filesNum;i++){
                        var file_name = file_name_list[i] + "." + form_data.get("toFileStyle");
                        var preview_node = $('<div class="li-mask-layer" onclick="previewFile(\''+ json_data[file_name] +'\',\''+ form_data.get("toFileStyle") +'\')">预览</div>');
                        console.log(preview_node[0]);
                        $file_box_node[i].append(preview_node);
                    }
                    $(".upload-box").css("display", "none");
                    $(".download-box").css("display", "block");
                    $completed.css("width", "100%");
                } else { // 转换失败
                    $select_complete.css("display", "none");
                    $transform_failure.css("display", "block");
                }
            },
            error: function () { //服务器404
                $select_complete.css("display","none");
                $server_notFound.css("display","block");
            }
        });
    });

    $(".download-button-box button").click(function () {
        var $eleForm = $("<form method='get' style='display:none;'></form>");
        $eleForm.attr("action", json_data.zipIpPath);
        $(document.body).append($eleForm);
        // 提交表单，实现下载
        $eleForm.submit();
    });

    // 关闭预览窗口
    close_button.click(function () {
        preview_wrapper.css("display", "none");
        preview_box.css("display", "none");
        $(this).css("display", "none");
    });

    //离开页面事件
    window.onbeforeunload = function(){
        $("input[name = selectName]").val("");
        $.ajax({
            type: "POST",
            data: {
                data:JSON.stringify(json_data)
            },
            url: "/first/deleteFile.do",
            async: false
        });
        console.log("用户离开页面");
    };

    //查看详情绑定点击事件
    $(".failure-detail").click(function(){
        $failure_detail.slideToggle();
    })
});

// 进度条实现
var total_width = 0;// 进度条总长度
function progressBar() {
    total_width += Math.floor(Math.random() * 21);// 获取0到30的整数并累加到总长度上
    // 当长度大于或等于88时暂停滚动条
    if (total_width >= 88) {
        total_width = 88;
        clearInterval(timer);
    }
    var percent = total_width + "%";
    $completed.css("width", percent);
}

// 文件改变时显示变化
function fileChange(itself) {
    var $this = $(itself);
    var files = $this.get(0).files;
    $file_list.empty();
    if ($this.val() != "") {// 当文件不为空
        var file_style = files[0].name.substring(files[0].name.indexOf('.') + 1, files[0].name.length);
        form_data = new FormData();// formData对象，全局变量
        for (var j = 0; j < files.length; j++) {
            var file_val = files[j];
            var name = file_val.name.substring(0, file_val.name.indexOf('.'));
            file_name_list[j] = name;
            form_data.append("files", file_val);// formData对象
        }
        form_data.append("fileStyle", file_style);
        form_data.append("toFileStyle", $this.attr("to"));
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            // 判断文件类型是否正确
            var is_right = isRightFile(file, $this.attr("need"));
            if (is_right === 0) {
                var file_name = file.name;
                var file_size = (file.size / Math.pow(2, 20)).toFixed(4);
                $main_box.css("display", "none");
                $select_complete.css("display", "block");
                $file_box_node[i] = $("<li class='file-box'></li>");
                var $file_box_list_node = $("<i class=\"file-show-pic\"></i>\n" +
                    "                        <span>" + file_name + "</span><br/>\n" +
                    "                        <span>" + file_size + "MB</span>");
                $file_box_node[i].append($file_box_list_node);
                $file_list.append($file_box_node[i]);
            } else {
                if (is_right === 2) {
                    $error_tip.text("请保证您的文件在2M以下！");
                } else if (is_right === 3) {
                    $error_tip.text("我们不接受空文件！");
                } else {
                    $error_tip.text($error_tip_text);
                }
                $main_box.css("display", "none");
                $select_complete.css("display", "none");
                $select_error.css("display", "block");
                break;
            }
        }
    } else {
        $file_list.empty();
    }
}

function isRightFile(file, file_type) {
    // file_state 0表示正确 1表示格式不正确 2表示大小不正确
    var file_state = 0;
    var file_name = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase(); // 获取文件名称的后缀
    var file_size = Math.round(file.size / Math.pow(2, 20));// 获取文件大小并转换为MB单位
    // 判断文件后缀是否正确
    if (file_type === "ppt") {
        if (file_name !== "pptx" && file_name !== "ppt") return 1;
    } else if (file_type === "jpg") {
        if (file_name !== "jpeg" && file_name !== "jpg") return 1;
    } else if (file_type === "excel") {
        if (file_name !== "xlsx" && file_name !== "xls") return 1;
    } else if (file_type === "word") {
        if (file_name !== "docx" && file_name !== "doc") return 1;
    } else if (file_type === "pdf") {
        if (file_name !== "pdf") return false;
    }
    // 判断文件大小是否符合规范
    if (file.size > 2 * Math.pow(2, 20)) {
        file_state = 2;
    }
    if (file.size === 0) {
        file_state = 3;
    }
    return file_state;
}

// 预览遮罩层
var preview_box = $(".preview-box");
var preview_wrapper = $(".preview-box-wrapper");
function previewFile(fileUrl,fileStyle) {
    preview_box.css("display", "block");
    preview_wrapper.css("display", "block");
    close_button.css("display","block");
    console.log(fileUrl);
    if(fileStyle === "pdf"){
        if (PDFObject.supportsPDFs) {
            PDFObject.embed(fileUrl, "#preview");
        } else {
            alert("您的浏览器不支持在线预览！请使用最新的版本！");
        }
    } else if(fileStyle === "jpg"){
        var img_node = $("<img src="+ fileUrl +" width='100%' height='100%' />");
        preview_box.append(img_node);
    } else{
        preview_box.append("<iframe src='https://view.officeapps.live.com/op/view.aspx?src="+ fileUrl +"' frameborder='0' width='100%' height='100%'></iframe>\n");
    }
}
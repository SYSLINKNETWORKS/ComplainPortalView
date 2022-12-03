var btnsub = $("#btn_sub");
var imgload = $("#img_load");
var dataip = "_";

$(document).ready(function () {
    $('#footer_Mark').html('©2020 All Rights Reserved - MMC');
    imgload.hide();
    var strkey = localStorage.getItem(1);
    if (strkey != null) {
        window.location.assign("Main");
    }
  
    $("#txtusername").focus();
});

//Login Start
async function Login() {


    var txt_nam = $("#txtusername").val();
    var txt_pwd = $("#txtuserpassword").val();
    var txt_err = $("#txterr");
    if (txt_nam == "") {
        alert("Please Enter your Login");
        return false;
    } else if (txt_pwd == "") {
        alert("Please enter Password");
        return false;
    }
    var dataip = "_";// localStorage.getItem(12);
    await $.getJSON("https://jsonip.com?callback=?", function (data) {
        dataip = data.ip;
    });

    $.ajax({
        type: "POST",
        cache: false,
        url: apiUrl + '/Login/login',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "UserName": txt_nam, "UserPassword": txt_pwd, "userheader": navigator.userAgent, "wanip": dataip }),
        beforeSend: function () {
            imgload.show();
            btnsub.hide();
        },

        success: function (response) {
            localStorage.clear();
            if (response[0].status == 1) {
                imgload.hide();
                btnsub.show();
                localStorage.setItem(1, response[0].Key);
                window.location.assign("Main");

            }
            else {
                imgload.hide();
                btnsub.show();

                txt_err.html("<h2>" + response[0].Remarks + "</h2>");
                alert(response[0].Remarks);
            }
        },
        error: function (error) {
            imgload.hide();
            btnsub.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

    return true;

}
//Login End






$("#txtusername").keyup(function (e) {
    if (e.keyCode === 13) {
        $("#txtuserpassword").focus();
    }
});
$("#txtuserpassword").keyup(function (e) {
    if (e.keyCode === 13) {
        Login();
    }
});

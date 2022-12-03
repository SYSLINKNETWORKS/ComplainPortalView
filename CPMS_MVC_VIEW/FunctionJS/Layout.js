var alertcnt = 0, titlecnt = 0;
var lbltitle = $("#lbl_title");
var title = 'Complain Portal (MMC)';
jQuery(document).ready(function () {
    lbltitle.html(title);
    fillMenu();
    startTime();
    Metronic.init(); // init metronic core componets
    Layout.init(); // init layout
    Demo.init(); // init demo features
    //Index.init(); // init index page
    Tasks.initDashboardWidget(); // init tash dashboard widget
    var socket = io.connect('https://mmc-attendancechat.herokuapp.com');

    //Listen on new_message
    socket.on("complain_dashboard", (data) => {
        // console.log("ID : " + data.branchid + " Name : " + data.branchname + " Date : " + data.messagedate + " Category : " + data.messagecategory + " Message : " + data.message);
        var lblbrid = $('#lbl_brid_master').html();
        if (lblbrid == data.branchid || lblbrid == '01') {
            var msg = data.message;
            if (lblbrid == '01') {
                msg = '[' + data.branchname + ']-' + msg;
            }
            alertcnt += 1;
            titlecnt += 1;
            var ulmsgmaster = $('#ul_msg_master ul');
            var spanli = '';
            var ulmsgmaster_old = ulmsgmaster.html();
            ulmsgmaster.empty();
            //New
            if (data.messagecategory == 'R') {
                spanli = ' <span class="label label-sm label-icon label-danger">' +
                    '<i class="fa fa-bolt" ></i>' +
                    '</span>';
            }
            //Cancelled
            else if (data.messagecategory == 'L') {
                spanli = ' <span class="label label-sm label-icon label-info">' +
                    '<i class="fa fa-bullhorn" ></i>' +
                    '</span>';
            }
            //Check
            else if (data.messagecategory == 'C') {
                spanli = ' <span class="label label-sm label-icon label-warning">' +
                    '<i class="fa fa-bell-o" ></i>' +
                    '</span>';
            }
            //QC
            else if (data.messagecategory == 'Q') {
                spanli = ' <span class="label label-sm label-icon label-info">' +
                    '<i class="fa fa-bullhorn" ></i>' +
                    '</span>';
            }
            //Acknowledge
            else if (data.messagecategory == 'D') {
                spanli = ' <span class="label label-sm label-icon label-success">' +
                    '<i class="fa fa-plus" ></i>' +
                    '</span>';
            }

            ulmsgmaster.append(
                '<li>' +
                '<a href="javascript:;">' +
                '<span class="time">' + moment(data.messagedate).format('LT') + '</span>' +
                '<span class="details">' +
                spanli +
                //'<span class="label label-sm label-icon label-danger">' +
                //'<i class="fa fa-bolt"></i>' +
                //'</span>' +
                msg +
                '</span>' +
                '</a>' +
                '</li>'
            );
            ulmsgmaster.append(ulmsgmaster_old);
            $('#spn_alert_master').html(alertcnt);
            $('#spn_alert_master').css("background", "red");
            lbltitle.html('(' + titlecnt + ')' + title);
        }
    })
});

function spanchangecolor() {
    $('#spn_alert_master').css("background","gray");
    lbltitle.html(title);
    titlecnt = 0;
};
//$(document).ready(function () {
//    var dataip = "_";// localStorage.getItem(12);
//    //await $.getJSON("https://jsonip.com?callback=?", function (data) {
//    //    dataip = data.ip;
//    //});
//    $.ajax({
//        url: 'https://tools.keycdn.com/geo.json?host=103.244.176.39',
//        success: function (response) {
//            console.log(response);
//        },
//        error: function (error) {
//            console.log('Error ${error}')
//        }
//    });
//    //https://tools.keycdn.com/geo.json?host=103.244.176.39
//    //http://api.ipstack.com/39.57.133.166?access_key=4ef41f6ff21d913a63f59e3a3763ad76
//});

if (localStorage.getItem(1) != null) { strkey = localStorage.getItem(1); }
//Timing Start
//$("#ClockTime").html(startTime());
function startTime() {
    var today = new Date();
    //var d = today.getDate();
    //var mon = today.getMonthName();
    //var y = today.getFullYear()
    //var h = today.getHours();
    //var m = today.getMinutes();
    //var s = today.getSeconds();
    //m = checkTime(m);
    //s = checkTime(s);
    $("#ClockTime").html(
        "Date: " + moment(today).format("DD-MMM-YYYY") + " Time : " + moment(today).format("HH:mm:ss"));
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}
//Time End
//logout Start
async function logout_func() {
    var dataip = "_";// localStorage.getItem(12);
    await $.getJSON("https://jsonip.com?callback=?", function (data) {
        dataip = data.ip;
    });
    $.ajax({
        url: apiUrl + '/Login/logout',
        type: "Post",
        cache: false,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "userheader": navigator.userAgent, "wanip": dataip }),
        success: function (response) {
            var jres = response;
            if (response[0].status == 1) {
                //href = '@Url.Action("Logout","Login")'
                localStorage.clear();
                //window.location.assign("@Url.Content("~/login")")
                window.location.assign(ViewUrl + '/login');

            }
            else {
                alert(response[0].Remarks);
                console.log(response[0].Remarks);
            }
        },
        error: function (error) {
            console.log('Error ${error}')
        }
    });
    //});


}
//Logout End

function ChangePassword_modal() {
    $('#changepassword_data_Modal').modal('show');
}
//Change Password Start
function ChangePassword_func() {
    var txtopwd = $("#txt_opwd").val();
    var txtnpwd = $("#txt_npwd").val();
    var txtcpwd = $("#txt_cpwd").val();
    if (txtnpwd != txtcpwd) { alert('Confirm Password does not match'); return; }
    $.ajax({
        url: apiUrl + '/Login/PasswordChange',
        type: "Post",
        cache: false,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "UserPassword": txtopwd, "NewPassword": txtcpwd }),
        success: function (response) {
            var jres = response;
            if (response[0].status == 1) {

                localStorage.clear();
                //window.location.assign("@Url.Content("~/login")")
                window.location.assign(ViewUrl + '/login');
            }
            else {
                alert(response[0].Remarks);
                console.log(response[0].Remarks);
            }
        },
        error: function (error) {
            console.log('Error ${error}')
        }
    });
    //});


}
//Change Password End

function fillMenu() {
    $("#div_menu_demo").empty();
    $.ajax({
        url: apiUrl + '/Menu/FetchMenu',
        type: "Post",
        data: JSON.stringify({ "Token": strkey, "menid": "0" }),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            if (response[0].status == 1) {
                $('#lbl_brid_master').html(response[0]["Result_Information"][0]["Branch_ID"]);
                $('#lbl_company_name').html((response[0]["Result_Information"][0]["Branch_Name"]).toUpperCase());
                $("#userName").html(response[0]["Result_Information"][0]["User_Name"]);
                $("#lbl_ver").html('<i class="icon-handbag"></i>' + response[0]["Result_Information"][0]["Version"] + ' E');

                if (response[0]["Result_Information"][0]["User_Admin"] == 'True') {
                    var topmain = '';
                    topmain += ' <span class="btn btn-sm"><a href=' + ViewUrl + '/Main' + '>Home</a></span>'
                    topmain += ' <span class="btn btn-sm"><a href=' + ViewUrl + '/Company' + '>Company</a></span>'
                    topmain += ' <span class="btn btn-sm"><a href=' + ViewUrl + '/Branch' + '>Branch</a></span>'
                    topmain += ' <span class="btn btn-sm"><a href=' + ViewUrl + '/User' + '>User</a></span>'
                    topmain += ' <span class="btn btn-sm"><a href=' + ViewUrl + '/Backup' + '>Backup</a></span>'
                    $("#Top_Main").append(topmain);
                }
            }
            else {
                console.log("invalid key");
                localStorage.clear();
                window.location.assign(ViewUrl + '/login');
            }
        },
        error: function (error) {
            alert('Error ' + error)
        }
    })
}

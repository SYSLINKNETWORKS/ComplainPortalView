
var imgload = $("#img_load");
var bac = $("#btn_backup");
var backuptable = $("#Table_View");

$(document).ready(function () {
    imgload.hide();
    backuptable.hide();
});

//Backup Start
function create_backup() {

    output = confirm('Are you sure wants to Backup?');
    if (output == false) {
        return false;
    }
    var urlStr = apiUrl + '/BackupDB/DBBackupCreate';
    $.ajax({
        url: urlStr,
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey }),
        beforeSend: function () {
            imgload.show();
            bac.hide();
        },
        success: function (response) {
            if (response[0].status == 1) {
                imgload.hide();
                alert(response[0].Remarks);
                bac.show();
                show_backup();
            }
            else {
                alert(response[0].Remarks);
                imgload.hide();
                bac.show();
            }

        },
        error: function (error) {
            imgload.hide();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
}
//Backup End

// Delete Start 
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var file = data['FILE'];

    var output;
    output = confirm("Are sure wants to delete " + file + " ?");
    if (output == false) {
        return false;
    }
    $.ajax({
        url: apiUrl + '/BackupDB/DBBackupDelete',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "FileName": file
        }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {
            if (response[0].status == 1) {
                alert(response[0].Remarks);
                imgload.hide();
                show_backup();
                return true;
            }
            else {
                alert(response[0].Remarks);
            }
        },
        error: function (error) {
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
});

// Delete End 

//Download backup Start
$('table').on('click', '.btn-download', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var file = data['FILE'];
    var urlstr = apiUrl + '/db_backup/' + file;
    var output;
    output = confirm("Are sure wants to download : " + file + " ?");
    if (output == false) {
        return false;
    }
    window.location.assign(urlstr);
    //$.ajax({
    //    url: urlstr,
    //    type: "Get",
    //    contentType: "application/json",
    //    dataType: "json",
    //    //data: JSON.stringify({
    //    //    "Token": strkey,
    //    //    "FileName": file
    //    //}),
    //    beforeSend: function () {
    //        imgload.show();
    //    },
    //    success: function (response1) {

    //        console.log(response1);
    //        ////if (response[0].status == 1) {
    //        //    alert(response);
    //        ////    imgload.hide();
    //        //    return true;
    //        //}
    //        //else {
    //        //    alert(response);
    //        //}
    //    },
    //    error: function (error) {
    //        console.log('Error ' + error)
    //        alert('Error ' + error)
    //    }
    //})
});

//Download backup End 

//show backup Start
function show_backup() {
    var tbl_row_cnt = 1;

    $.ajax({
        url: apiUrl + '/BackupDB/DBBackupShow',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey
        }),
        beforeSend: function () {
            backuptable.hide();
            imgload.show();
        },
        success: function (response) {

            var action_button = ' ';
            //Delete
            action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
            //Download
            action_button += "<a href='#' class='btn-download glyphicon glyphicon-download-alt' data-toggle='tooltip' title='Download'></a>  ";
            var jres = response;
            if (jres[0].status == 1) {
                backuptable.show();
                var json = response[0]["Result"];
                array = response[0]["Result"];
                $('#Table_View').DataTable().clear().destroy();
                detailsTableBody = $("#Table_View").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data: null,
                            "defaultContent": action_button
                        },
                        {
                            "render": function (data, type, full, meta) {
                                return tbl_row_cnt++;
                            }
                        },
                        { data: 'DATE' },
                        { data: 'TIME' },
                        { data: 'FILE' },
                        { data: 'MB' }
                    ],
                    "pageLength": 10,
                    "order": [[2, "desc"]]
                });
                imgload.hide();
            }
            else {
                imgload.hide();
                alert(jres[0].Remarks);
            }
        },
        error: function (error) {
            imgload.hide();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
    return true;
}
//show backup End

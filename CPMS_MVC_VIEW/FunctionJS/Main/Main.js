var ImagedetailsTable = $("#Image_detailsTable tbody");
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var imgloadcheck = $("#img_load_check");
var imgloadeditcheck = $("#img_load_editcheck");
var btncreate = $("#btn_create");
var btnupd = $('#btn_upd');
var btnsav = $('#btn_sav');
var btnstasav = $('#btn_status_sav');
var _Form_ID = "0";
var _Form_Name = "";

function readURL(input) {
    if (input.files && input.files[0]) {
        for (let i = 0; i < input.files.length; i++) {

            var reader = new FileReader();

            reader.onload = function (e) {
                //var productItem = '<tr><td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td><td><img src="' + e.target.result + '" /></td></tr>';
                //ImagedetailsTable.append(productItem);

                //$('#image')
                //    .attr('src', e.target.result)
                //    .width(150)
                //    .height(200);
                var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
                if (match == null) {
                    throw 'Could not parse result'; // should not happen
                }
                var mimeType = match[1];
                var content = match[2];
                var productItem = '<tr>' +
                    '<td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td>' +
                    '<td><a href=' + URL.createObjectURL(input.files[i]) + ' target="_blank">' + input.files[i].name + '</a></td>' +
                    '<td style="display:none;">' + input.files[i].type + '</td>' +
                    '<td style="display:none;">' + content + ' </td>' +
                    '<td style="display:none;">' + input.files[i].name + ' </td>' +
                    '</tr>';
                ImagedetailsTable.append(productItem);
                //console.log(input.files[i].name);
            };

            reader.readAsDataURL(input.files[i]);
        }
    }
}



//Select2 Start
var ComponentsDropdowns = function () {
    var handleSelect2 = function () {

        //Master Customer End
        FillForm()
        //Master Customer End

    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();
//Select2 End

function FillForm() {
    $("#txt_form").select2({
        placeholder: "Search for Form or Module",
        minimumInputLength: 0,
        triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillFormModule',
            type: "Get",
            dataType: 'json',
            delay: 250,
            data: function (term, page) {
                return {
                    _key: strkey,
                    _srch: term, // search term
                    page: page // page number
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter remote JSON data

                var myResults = [];
                if (data[0].status != 1) {
                    myResults.push({
                        id: data[0].status,
                        text: data[0].Remarks
                    })
                }
                else {
                    $.each(data[0].Result, function (index, item) {
                        myResults.push({
                            id: item.Id,
                            text: item.formName

                        })
                    })
                }
                var more = (page * 30) < myResults.length; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return { results: myResults, more: more };
            },
            cache: true
        },
        initSelection: function (element, callback) {
            var data = { "id": _Form_ID, "text": _Form_Name };
            callback(data);
        },

        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {

            return m;
        } // we do not want to escape markup since we are displaying html in results
    });

}

$('#txt_form').on("select2-selected", function (e) {
    _Form_ID = $("#txt_form").select2('data').id;
});

$('#txt_form').on("select2-removed", function (e) {
    _Form_ID = "0";
    _Form_Name = "";
});

//Delete from Table Start
$(document).on('click', 'a.deleteItem', function (e) {
    output = confirm('Are sure wants to delete?');
    if (output == false) {

        return false;
    }

    e.preventDefault();
    var $self = $(this);
    if ($(this).attr('data-itemId') == "0") {
        $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {
            $(this).remove();
        });
    }
});
//Delete from Table End
// Create Code start *@

function savrec() {
    var rows_cnt = $("#Image_detailsTable tbody >tr");
    var ck = ckvalidation();
    var ckval = ck.ckval;
    if (ckval == 1) { return; }
    var detail_record = ck.detailrecord;


    output = confirm('Are sure wants to Save?');
    if (output == false) {

        return false;
    }
    $.ajax({
        url: apiUrl + '/Complain/create/',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Complain_By": $("#txt_comp_by").val(),
            "complainFormsId": _Form_ID,
            "Complain": $("#txt_comp").val(),
            "Remarks": $("#txt_rmrk").val(),
            "Priority": $("#txt_priority").val(),
            "IssueType": $("#txt_issuetyp").val(),
            "AttachmentCount": rows_cnt.length,
            "Detail": detail_record
        }),
        beforeSend: function () {
            imgloadsav.show();
            btnsav.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadsav.hide();
                discon();
                btnsav.show();
                $('#data_Modal').modal('hide');
                alert(jres[0].Remarks);

            }
            else {
                imgloadsav.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadsav.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
    return true;

}
// Create Code End *@

$(document).ready(function () {
    $("#lbl_status").html('Check');
    discon();

});
$(document).on("click", '#btn_create', function () {
    AcknowledgmentCheck();

});

function onload() {

    $.ajax({
        type: "POST",
        cache: false,
        url: apiUrl + '/Complain/FetchComplain/' + $("#lbl_status").html(),
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Menu": "2061", "Creteria": "" }),
        beforeSend: function () {
            imgload.show();
        },

        success: function (response) {
            if (response[0].status == 1) {
                var dgbutton = "";
                var cancelbutton = "";
                var editbutton = "";
                //New
                if (Boolean(response[0]["Record_Insert"])) {
                    btncreate.show();
                }


                $("#lbl_check").html(response[0]["Result_Count"][0]["Checked"]);
                $("#lbl_qc").html(response[0]["Result_Count"][0]["QC"]);
                $("#lbl_ack").html(response[0]["Result_Count"][0]["Acknowledge"]);
                $("#lbl_can").html(response[0]["Result_Count"][0]["Cancel"]);
                $("#lbl_complete").html(response[0]["Result_Count"][0]["Complete"]);
                $("#lbl_all").html(response[0]["Result_Count"][0]["All_Record"]);

                var json = response[0]["Result"];
                $('#Table_View').DataTable().clear().destroy();
                detailsTableBody = $("#Table_View").dataTable({
                    data: json,
                    destroy: true,
                    retrieve: true,
                    columns: [
                        {
                            data: null, render: function (data, type, row) {
                                dgbutton = "<div id='" + row.Ticket + "'>" + row.Status + "</div>";
                                cancelbutton = "<div id='" + row.Ticket + "'>Cancel</div>";
                                editbutton = "<div id='" + row.Ticket + "'>Edit</div>";
                                //Cancelled
                                if (response[0]["Result"][0]["Permission_Cancel"] == 'True') {
                                    cancelbutton = "<div id='" + row.Ticket + "' onclick=_Edit('" + row.Ticket + "','Cancel')><a>Cancel</a></div>";
                                }
                                //Check 
                                if (response[0]["Result"][0]["Permission_Check"] == 'True' && row.Status == 'Check') {
                                    dgbutton = "<div id='" + row.Ticket + "' onclick=_Edit('" + row.Ticket + "','" + row.Status + "')><a>" + row.Status + "</a></div>";
                                }

                                //Edit 
                                if (response[0]["Result"][0]["Permission_Edit"] == 'True') {
                                    editbutton = "<div id='" + row.Ticket + "' onclick=_Edit('" + row.Ticket + "','Edit')><a> Edit </a></div>";
                                }


                                //QC
                                if (response[0]["Result"][0]["Permission_QC"] == 'True' && row.Status == 'QC') {
                                    dgbutton = "<div id='" + row.Ticket + "' onclick=_Edit('" + row.Ticket + "','" + row.Status + "')><a>" + row.Status + "</a></div>";
                                }

                                //Acknowledge
                                else if (response[0]["Result"][0]["Permission_Acknowledge"] == 'True' && row.Status == 'Acknowledge') {
                                    dgbutton = "<div id='" + row.Ticket + "' onclick=_Edit('" + row.Ticket + "','" + row.Status + "')><a>" + row.Status + "</a></div>";
                                }

                                if (row.Status == 'Check') {
                                    return dgbutton + editbutton +
                                        cancelbutton;
                                }
                                else if (row.Status == 'Cancel') {
                                    return cancelbutton;
                                }
                                else {
                                    return dgbutton;
                                }
                            }
                        },

                        { data: 'Ticket' },
                        { data: 'Date' },
                        { data: 'Complain_By' },
                        { data: 'Complain' },
                        { data: 'IssueType' },
                        { data: 'Remarks' },
                        { data: 'Branch_Name' },
                        {
                            data: null, render: function (data, type, row) {
                                var _status_remarks = '';
                                //// if (row.Checked_Remarks != "") {
                                //     _status_remarks+= "Check : " + row.Checked_Remarks;
                                // //}
                                // //if (row.QC_Remarks != "") {
                                //     _status_remarks += "<br/>QC : " + row.QC_Remarks ;
                                // //}
                                // //if (row.Acknowledge_Remarks != "") {
                                //     _status_remarks += "<br/>Acknowledgment : " + row.Acknowledge_Remarks;
                                // //} 

                                //Cancelled
                                if (row.Cancelled == 'Yes') {
                                    _status_remarks += "Cancelled : " + row.Cancelled_Remarks + "<br/>";
                                }
                                //Check 
                                if (row.Checked == 'Yes') {
                                    _status_remarks += "Check : " + row.Checked_Remarks + "<br/>";
                                }

                                //QC
                                if (row.QC == 'Yes') {
                                    _status_remarks += "QC : " + row.QC_Remarks + "<br/>";
                                }

                                //Acknowledge
                                if (row.Acknowledge == 'Yes') {
                                    _status_remarks += "Acknowledge : " + row.Acknowledge_Remarks + "<br/>";
                                }
                                return _status_remarks;
                            }
                        },

                        { data: 'priority' },
                        { data: 'Status_Aging' },
                        {
                            data: null, render: function (data, type, row) {
                                if (row.Attachment_Count > 0) {
                                    return "<div id='Image" + row.Ticket + "' onclick=_ShowImage('" + row.Ticket + "')><a>" + row.Attachment_Count + "</a></div>";
                                }
                                else {
                                    return "<div id='Image" + row.Ticket + "'>" + row.Attachment_Count + "</div>";
                                }
                            }
                            //data: 'Attachment_Count'
                        }

                    ],
                    columnDefs: [
                        { orderable: false, targets: 0 }, {
                            targets: 2, render: function (data) {
                                return moment(data).format('DD-MMM-YYYY');
                            },
                        }],
                    "order": [[1, "desc"], [2, "desc"]],
                    "pageLength": 10,
                });

                imgload.hide();
            }
            else {
                btncreate.show();
                imgload.hide();
                console.log(response[0].Remarks)
                //alert(response[0].Remarks);
            }
        },
        error: function (error) {
            imgload.hide();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
}
// Fill Edit Start *@
function _Edit(ticket_id, ticket_status) {
    var divChecked = $("#div_Checked");
    var divisstyp = $("#div_isstyp");
    var divQC = $("#div_QC");
    divChecked.hide();
    divQC.hide();

    btnstasav.hide();
    var output;
    output = confirm("Are you sure to " + ticket_status + " Ticket  # " + ticket_id + "?");
    if (output == false) {
        return false;
    }
    $.ajax({
        url: apiUrl + '/Complain/FetchEditComplain/' + ticket_id,
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey
        }),
        beforeSend: function () {
            imgloadcheck.show();
            imgloadeditcheck.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadcheck.hide();
                imgloadeditcheck.hide();
                btnupd.show();
                $('#chck_modal').modal('show');
                $("#txt_id_upd").html(response[0]["Result"][0]["Ticket"]);
                $("#txt_date_upd").html(moment(response[0]["Result"][0]["Date"]).format("DD-MMM-YYYY"));
                $("#txt_comp_by_upd").html(response[0]["Result"][0]["Complain_By"]);
                $("#txt_status").html(ticket_status);


                $("#txt_check_rmk").html(response[0]["Result"][0]["Checked_Remarks"]);
                $("#txt_qc_rmk").html(response[0]["Result"][0]["QC_Remarks"]);

                if (ticket_status == 'Check') {
                    $("#txt_status_rmk").val(response[0]["Result"][0]["Checked_Remarks"]);
                }
                else if (ticket_status == 'QC') {
                    divChecked.show();
                    $("#txt_status_rmk").val(response[0]["Result"][0]["QC_Remarks"]);
                }
                else if (ticket_status == 'Acknowledge') {
                    divChecked.show();
                    divQC.show();
                    $("#txt_status_rmk").val(response[0]["Result"][0]["Acknowledge_Remarks"]);
                }
                else if (ticket_status == 'Cancel') {
                    divChecked.show();
                    divQC.show();
                    $('#ck_sta').iCheck('check');
                    $("#txt_status_rmk").val(response[0]["Result"][0]["Cancelled_Remarks"]);
                }

                else if (ticket_status == 'Edit') {
                    divisstyp.show();
                    $('#chck_modal').modal('hide');
                    $('#chck_editmodal').modal('show');
                    $("#txt_id_edit").html(response[0]["Result"][0]["Ticket"]);
                    $("#txt_date_edit").html(moment(response[0]["Result"][0]["Date"]).format("DD-MMM-YYYY"));
                    $("#txt_comp_by_edit").html(response[0]["Result"][0]["Complain_By"]);
                    $("#txt_comp_by_edit").html(response[0]["Result"][0]["Complain"]);
                    /*$("#txt_status").html(ticket_status);*/
                }
            }
            else {
                imgloadcheck.hide();
                imgloadeditcheck.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadcheck.hide();
            imgloadeditcheck.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

}
// Fill Edit End *@
//Update Check Start
function updrec_check() {


    $.ajax({
        url: apiUrl + '/Complain/checkedby/',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": $("#txt_id_upd").html(),
            "CK_Checked": $('#ck_sta').iCheck('update')[0].checked,
            "Remarks": $("#txt_status_rmk").val()
        }),
        beforeSend: function () {
            imgloadcheck.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgload.hide();
                discon();
                btnsav.show();
                $('#chck_modal').modal('hide');
                alert(jres[0].Remarks);

            }
            else {
                imgloadcheck.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadcheck.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

}
//Update Check End
//Udate Issue Type Start
function updrec_Edit() {

    $.ajax({
        url: apiUrl + '/Complain/EditIssueType/',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": $("#txt_id_upd").html(),
            "IssueType": $("#txt_edit_issuetyp").val()
        }),
        beforeSend: function () {
            imgloadcheck.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadcheck.hide();
                discon();
                btnsav.show();
                $('#chck_editmodal').modal('hide');
                alert(jres[0].Remarks);

            }
            else {
                imgloadcheck.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadcheck.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

}
//Udate Issue Type End
//Update QC Start
function updrec_QC() {

    $.ajax({
        url: apiUrl + '/Complain/QCby/',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": $("#txt_id_upd").html(),
            "QC_Checked": $('#ck_sta').iCheck('update')[0].checked,
            "Remarks": $("#txt_status_rmk").val()
        }),
        beforeSend: function () {
            imgloadcheck.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadcheck.hide();
                discon();
                btnsav.show();
                $('#chck_modal').modal('hide');
                alert(jres[0].Remarks);

            }
            else {
                imgloadcheck.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadcheck.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

}
//Update QC End

//Update Acknowledge Start
function updrec_Acknowledge() {
    $.ajax({
        url: apiUrl + '/Complain/Acknowledgeby/',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": $("#txt_id_upd").html(),
            "CK_Acknowledge": $('#ck_sta').iCheck('update')[0].checked,
            "Remarks": $("#txt_status_rmk").val()
        }),
        beforeSend: function () {
            imgloadcheck.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadcheck.hide();
                discon();
                btnsav.show();
                $('#chck_modal').modal('hide');
                alert(jres[0].Remarks);

            }
            else {
                imgloadcheck.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadcheck.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
}
//Update Acknowledge End
//Update Cancel Start
function updrec_Cancel() {


    $.ajax({
        url: apiUrl + '/Complain/Cancel/',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "ID": $("#txt_id_upd").html(),
            "CK_Cancel": $('#ck_sta').iCheck('update')[0].checked,
            "Remarks": $("#txt_status_rmk").val()
        }),
        beforeSend: function () {
            imgloadcheck.show();
            btnupd.hide();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imgloadcheck.hide();
                discon();
                btnsav.show();
                $('#chck_modal').modal('hide');
                alert(jres[0].Remarks);

            }
            else {
                imgloadcheck.hide();
                btnsav.show();
                alert(jres[0].Remarks);
            }

        },
        error: function (error) {
            imgloadcheck.hide();
            btnsav.show();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })

}
//Update Cancel End



function discon() {
    // console.log('Discon');
    document.getElementById('check_modal_form').reset();
    document.getElementById('Re_Packing_form').reset();

    _Form_ID = "0";
    _Form_Name = "";

    btnsav.hide();
    btncreate.hide();
    btnupd.hide();
    var detailsTableBody = $("#Table_View tbody");
    detailsTableBody.empty();
    var ImagedetailsTable = $("#Image_detailsTable tbody");
    ImagedetailsTable.empty();
    onload();
    imgload.hide();
    $('#ck_sta').iCheck('update')[0].checked;
    ComponentsDropdowns.init();

}

//Update Start
function updrec() {
    var txtstatus = $("#txt_status").html();
    if (txtstatus == 'Check') { updrec_check(); }
    else if (txtstatus == 'QC') { updrec_QC(); }
    else if (txtstatus == 'Acknowledge') { updrec_Acknowledge(); }
    else if (txtstatus == 'Cancel') { updrec_Cancel(); }
    else if (txtstatus == 'Edit') { updrec_Edit(); }

}
//Update End

//Validation Start
function ckvalidation() {
    var rows_create = $("#Image_detailsTable tbody >tr");
    var columns;
    var ck = 0;
    var detail_record = "";
    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        if (detail_record == "") {
            detail_record = $(columns[4]).html() + "|" + $(columns[3]).html() + "|" + $(columns[2]).html();
        }
        else {
            detail_record += "|" + $(columns[4]).html() + "|" + $(columns[3]).html() + "|" + $(columns[2]).html();
        }
    }
    console.log($("#txt_issuetyp").val());
    if ($("#txt_comp_by").val() == '') {
        console.log("Complain By cannot be blank");
        alert("Complain By cannot be blank");
        ck = 1;
    }
    else if ($("#txt_comp").val() == '') {
        console.log("Complain cannot be blank");
        alert("Complain cannot be blank");
        ck = 1;
    }
    else if ($("#txt_issuetyp").val() == '0') {
        console.log("Issue Type cannot be blank");
        alert("Issue Type cannot be blank");
        ck = 1;
    }
    else if (_Form_ID == '0') {
        console.log("Form/Module cannot be blank");
        alert("Form/Module cannot be blank");
        ck = 1;
    }
    //else if ($("#txt_issuetyp").val() == '0') {
    //    console.log("Select Issue Type");
    //    alert("Issue Type cannot be blank");
    //    ck = 1;
    //}

    return { ckval: ck, detailrecord: detail_record };
}
//Validation End

//Show Attachment Start
function _ShowImage(ticket_id) {
    var imagemodalShow = $("#image_modal_Show");
    var ImagedetailsTableShow = $("#Image_detailsTable_Show tbody");

    var divCheckedimg = $("#div_Checked_img");
    var divQCimg = $("#div_QC_img");
    var divAcknowledgeimg = $("#div_Acknowledge_img");
    divCheckedimg.hide();
    divQCimg.hide();
    divAcknowledgeimg.hide();

    ImagedetailsTableShow.empty();
    var urlstr = apiUrl + '/Complain/FetchImage/' + ticket_id;
    $.ajax({
        url: urlstr,
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey
        }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {
            var jres = response;
            if (jres[0].status == 1) {
                imagemodalShow.modal('show');
                imgload.hide();

                var ticket_status = response[0]["Result"][0]["Status"];

                $("#txt_id_img").html(response[0]["Result"][0]["Ticket"]);
                $("#txt_date_img").html(moment(response[0]["Result"][0]["Date"]).format("DD-MMM-YYYY"));
                $("#txt_comp_by_img").html(response[0]["Result"][0]["Complain_By"]);
                $("#txt_status_img").html('Attachment (Pending : ' + ticket_status + ')');
                $("#txt_check_rmk_img").val(response[0]["Result"][0]["Checked_Remarks"]);
                $("#txt_qc_rmk_img").val(response[0]["Result"][0]["QC_Remarks"]);
                $("#txt_act_rmk_img").val(response[0]["Result"][0]["Acknowledge_Remarks"]);

                if (ticket_status == 'Acknowledge') {
                    divCheckedimg.show();
                    divQCimg.show();
                    // divAcknowledgeimg.show();
                }
                else if (ticket_status == 'QC') {
                    divCheckedimg.show();
                    //divQCimg.show();
                }
                //else if (ticket_status == 'Check') {
                //    divCheckedimg.show();
                //}

                var productItem;
                var sno = 1;
                for (var row_cnt = 0; row_cnt < response[0]["Result"].length; row_cnt++) {


                    //const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
                    //    const byteCharacters = atob(b64Data);
                    //    const byteArrays = [];

                    //    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    //        const slice = byteCharacters.slice(offset, offset + sliceSize);

                    //        const byteNumbers = new Array(slice.length);
                    //        for (let i = 0; i < slice.length; i++) {
                    //            byteNumbers[i] = slice.charCodeAt(i);
                    //        }

                    //        const byteArray = new Uint8Array(byteNumbers);
                    //        byteArrays.push(byteArray);
                    //    }

                    //    const blob = new Blob(byteArrays, { type: contentType });
                    //    return blob;
                    //}

                    //const contentType = response[0]["Result"][row_cnt]["File_Extension"];// 'image/png';
                    //const b64Data = response[0]["Result"][row_cnt]["Image"];// 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

                    //const blob = b64toBlob(b64Data, contentType);
                    console.log(response[0]["Result"][row_cnt]["Image"]);
                    productItem += '<tr>' +
                        '<td>' + sno++ + '</td>' +
                        '<td><a href=' + response[0]["Result"][row_cnt]["Image"] + ' target="_blank">' + response[0]["Result"][row_cnt]["File_Name"] + '</a></td>' +
                        //'<td><div class="embed-responsive embed-responsive-16by9"><iframe src="https://drive.google.com/file/d/' + response[0]["Result"][row_cnt]["File_ID"]+'/preview" width="640" height="480"></iframe></div></td>' +
                        '<td></td>' +
                        '</tr>';

                }
                ImagedetailsTableShow.append(productItem);

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

    //image_modal_Show
}
//Show Attachment End

//Fill Record Start
function FillRecord(status) {
    $("#lbl_status").html(status);
    onload();
}
//Fill Record End

//Screen Recoding Start
const start_video = document.getElementById("start_video");
const stop_video = document.getElementById("stop_video");
//const video = document.querySelector("video");
let recorder_video, stream_video;

async function startRecording_video() {
    stream_video = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" }
    });
    recorder_video = new MediaRecorder(stream_video);

    const chunks = [];
    recorder_video.ondataavailable = e => chunks.push(e.data);
    recorder_video.onstop = e => {
        const completeBlob = new Blob(chunks, { type: chunks[0].mimeType });
        //video.src = URL.createObjectURL(completeBlob);
        //var reader = new FileReader();
        //var source = reader.readAsBinaryString(URL.createObjectURL(completeBlob));
        //console.log(source);

        var url = URL.createObjectURL(completeBlob);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = moment(new Date()).format('YYYYMMDDHHmmss') + '.webm';
        a.click();
        window.URL.revokeObjectURL(url);

    };

    recorder_video.start();
}

start_video.addEventListener("click", () => {
    start_video.setAttribute("disabled", true);
    stop_video.removeAttribute("disabled");

    startRecording_video();
});

stop_video.addEventListener("click", () => {
    stop_video.setAttribute("disabled", true);
    start_video.removeAttribute("disabled");

    recorder_video.stop();
    stream.getVideoTracks()[0].stop();
});
//Screen Recording End

//Audio Recoding Start
const start_Audio = document.getElementById("start_Audio");
const stop_Audio = document.getElementById("stop_Audio");
//const Audio = document.querySelector("Audio");
let recorder_Audio, stream_Audio;

async function startRecording_Audio() {
    stream_Audio = await navigator.mediaDevices.getUserMedia({ audio: true });


    recorder_Audio = new MediaRecorder(stream_Audio);
    const audioChunks = [];
    recorder_Audio.ondataavailable = e => audioChunks.push(e.data);
    recorder_Audio.onstop = e => {
        const completeBlob_Audio = new Blob(audioChunks, { type: audioChunks[0].mimeType });
        var url = URL.createObjectURL(completeBlob_Audio);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = moment(new Date()).format('YYYYMMDDHHmmss') + '.wav';
        a.click();
        window.URL.revokeObjectURL(url);
    };


    recorder_Audio.start();
}

start_Audio.addEventListener("click", () => {
    start_Audio.setAttribute("disabled", true);
    stop_Audio.removeAttribute("disabled");

    startRecording_Audio();
});

stop_Audio.addEventListener("click", () => {
    stop_Audio.setAttribute("disabled", true);
    start_Audio.removeAttribute("disabled");

    recorder_Audio.stop();
    //stream_Audio.getAudioTracks()[0].stop();
});
//Audio Recording End


function AcknowledgmentCheck() {

    $.ajax({
        type: "POST",
        cache: false,
        url: apiUrl + '/Complain/FetchComplainAcknowledgement/',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ "Token": strkey, "Menu": "2061", "Creteria": "" }),
        beforeSend: function () {
            imgload.show();
        },

        success: function (response) {
            if (response[0].status == 1) {
                var dgbutton = "";
                var cancelbutton = "";
                var editbutton = "";

                var _acknowledge = response[0]["Result"][0]["Acknowledge"];
                if (parseFloat(_acknowledge)>0)
                {
                    console.log("Acknowledgement " + _acknowledge + " Pending");
                    alert("Acknowledgement " + _acknowledge + " Pending");
                    return;
                }

                imgloadsav.hide();
                //var lblack = $("#lbl_ack").html();
                //if (lblack > 0) {
                   
                //}
                $('#data_Modal').modal('show');
                btnupd.hide();
                btnsav.show();

                imgload.hide();
            }
            else {
                btncreate.show();
                imgload.hide();
                console.log(response[0].Remarks)
                //alert(response[0].Remarks);
            }
        },
        error: function (error) {
            imgload.hide();
            console.log('Error ' + error)
            alert('Error ' + error)
        }
    })
}
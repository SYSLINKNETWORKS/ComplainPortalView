var txtdatfrm = $("#txt_dat_frm");
var txtdatto = $("#txt_dat_to");
var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var imgloadpwd=$("#img_load_pwd");
var SO = $("#txt_SO");
var slsmn = $("#txt_slsmn");
var broker = $("#txt_broker");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnupd = $("#btn_update");
var divpwd = $("#div_pwd");

var taxid = $("#txt_id");
var amt = 0;
var namt = 0;
var dis_per = 0;
var dis_amt = 0;
var txtstkqty = 0;
var txtsca = 0;

var _Branch_id = 0;
var _Branch_nam = '';

var _Group_id = 0;
var _Group_nam = '';

$(document).on("click", '#btn_new', function () {
    document.getElementById('create_form').reset();
    $('#data_Modal').modal('show');
    $("#detailsTable > tbody").html("");
    btnsav.show();
    btnupd.hide();
    divpwd.show();
    imgloadsav.hide();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdatfrm.find("input").val(CurrentDate);
    txtdatto.find("input").val(CurrentDate);
});

$("#txt_rmk").keyup(function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        $('#data_Modal_Detail').modal('show');
    }
});

$(function () {
    txtdatfrm.datetimepicker({ format: 'DD-MMM-YYYY' });
    txtdatto.datetimepicker({ format: 'DD-MMM-YYYY' });
});

$(document).ready(function () {
    discon();
    ComponentsDropdowns.init();
});

//Onload Start
function Onload() {
    var _menid = document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/System_Setup/User/New_User/GetUser',
        type: "Post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "Token": strkey,
            "Menu": _menid
        }),
        beforeSend: function () {
            imgload.show();
        },
        success: function (response) {
            var jres = response;
            var sno = 1;
            if (jres[0].status == 1) {
                var action_button = ' ';

                //New
                    btnnew.show();

                    action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                    action_button += "<a href='#' class='btn-edit glyphicon glyphicon-edit' data-toggle='tooltip' title='Edit'></a>  ";
                    action_button += "<a href='#' class='btn-cpwd glyphicon glyphicon-lock' data-toggle='tooltip' title='Change Password'></a> ";


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
                            render: function (data, type, row) {
                                return sno++
                            }
                        },
                        { data: 'Active' },
                        { data: 'NAME' },
                        { data: 'BRANCH_NAME' },
                        { data: 'Group' }
                    ],
                    "order": [[3, "asc"]],
                    "pageLength": 20
                });
                imgload.hide();
            }
            else {
                imgload.hide();
                Swal.fire({
                    title: `${jres[0].Remarks}`,
                    icon: 'error',

                    showClass: {
                        popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp faster'
                    }
                });
            }
        },
        error: function (error) {
            imgload.hide();
            console.log('Error ' + error)
            Swal.fire({
                title: "Error" + error,
                icon: 'error',

                showClass: {
                    popup: 'animated fadeInDown faster'
                },
                hideClass: {
                    popup: 'animated fadeOutUp faster'
                }
            });

        }
    })
    return true;
}
//Onload End

// Create Start 
function savrec() {
    var ck = ckvalidation();
    //var ckval = ck.ckval;
    //if (ckval == 1) { return; }
    var detailrecord = ck.detailrecord;
    var urlstr = apiUrl + '/System_Setup/User/New_User/create';

    Swal.fire({
        title: 'Are you sure you want to save?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Save',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {

            var urlStr =urlstr;
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "Name": $("#txt_nam").val(),
                    "Password": $("#txt_con_pass").val(),
                    "Address": $("#txt_address").val(),
                    "Phone_No": $("#txt_pho").val(),
                    "Mobile_No": $("#txt_mob").val(),
                    "Branch_ID": $("#txt_branch").select2('data').id,
                    "Active": $("#ck_act").iCheck('Update')[0].checked,
                    //"Check_Branches": $("#ck_all_bra").iCheck('Update')[0].checked,
                    "Detail": detailrecord
                }),
                beforeSend: function () {
                    imgloadsav.show();
                    btnsav.hide();
                },
                success: function (response) {
                    var jres = response;
                    if (jres[0].status == 1) {
                        imgloadsav.hide();

                        btnsav.show();
                        $('#data_Modal').modal('hide');
                        discon();

                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'success',
                            showConfirmButton: false,
                            // timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                    else {
                        imgloadsav.hide();
                        btnsav.show();
                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'error',
                            showConfirmButton: false,
                            //timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                },
                error: function (error) {
                    imgloadsav.hide();
                    btnsav.show();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: 'Error ' + error,

                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonColor: '#5cb85c',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Save',
                        showClass: {
                            popup: 'animated fadeInDown faster'
                        },
                        hideClass: {
                            popup: 'animated fadeOutUp faster'
                        }
                    })
                },
            })
            return true;
        }
    })
}
// Create End 

// Update Start 
function updrec() {
    var ck = ckvalidation();
    var detailrecord = ck.detailrecord;




    Swal.fire({
        title: 'Are you sure wants to Update?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Update',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            var urlStr = apiUrl + '/System_Setup/User/New_User/edit';
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "ID": $("#txt_id").html(),
                    "Name": $("#txt_nam").val(),
                    "Address": $("#txt_address").val(),
                    "Phone_No": $("#txt_pho").val(),
                    "Mobile_No": $("#txt_mob").val(),
                    "Branch_ID": $("#txt_branch").select2('data').id,
                    "Active": $("#ck_act").iCheck('Update')[0].checked,
                    //"Check_Branches": $("#ck_all_bra").iCheck('Update')[0].checked,
                    "Detail": detailrecord
                }),
                beforeSend: function () {
                    imgloadsav.show();
                    btnupd.hide();
                },
                success: function (response) {
                    var jres = response;
                    if (jres[0].status == 1) {
                        imgloadsav.hide();
                        btnupd.show();
                        $('#data_Modal').modal('hide');
                        discon();

                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'success',
                            showConfirmButton: false,
                            //  timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                    else {
                        imgloadsav.hide();
                        btnupd.show();
                        Swal.fire({
                            title: `${response[0].Remarks}`,

                            icon: 'error',
                            showConfirmButton: false,
                            //timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })

                    }
                },
                error: function (error) {
                    imgloadsav.hide();
                    btnupd.show();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: `Error ${error}`,

                        icon: 'error',
                        showConfirmButton: false,
                        // timer: 1500,
                        showClass: {
                            popup: 'animated fadeInDown faster'
                        },
                        hideClass: {
                            popup: 'animated fadeOutUp faster'
                        }

                    })
                }
            })
            return true;
        }
    })
}
// Update End


//After Add A New Order In The List, Clear Clean The Form For Add More Order.
function clearItem() {
    _dgcal();

    txtitem = $("#txt_ditm");
    txtitem.select2('val', '');
    txtitem.html('');
    $("#txt_sca").html('');
    $("#txt_qty").val('0');
    $("#txt_rate").html('0');
}

// After Add A New Order In The List, If You Want, You Can Remove It.
$(document).on('click', 'a.deleteItem', function (e) {
    Swal.fire({
        text: "Are sure wants to delete",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {


            e.preventDefault();
            var $self = $(this);
            if ($(this).attr('data-itemId') == "0") {
                $(this).parents('tr').css("background-color", "#ff6347").fadeOut(800, function () {
                    $(this).remove();
                    _dgcal();
                });
            }
        }
    })

});



//Fill Branch Start
function FillBranch() {
    $("#txt_branch").select2({
        placeholder: "Search for a Branch",
        minimumInputLength: 0,
        //triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillBranch/',
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
                // console.log(data);
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
                            id: item.ID,
                            text: item.Branch,
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
            var data = { "id": _Branch_id, "text": _Branch_nam };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Branch End


//Fill Group Start
function FillGroup() {
    $("#txt_group").select2({
        placeholder: "Search for a Group",
        minimumInputLength: 0,
        //triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillUserGroup/',
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
                // console.log(data);
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
                            id: item.ID,
                            text: item.Name,
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
            var data = { "id": _Group_id, "text": _Group_nam };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Group End


//Select2 Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {

        //Branch Start
        FillBranch();
        //Branch End

        //Group Start
        FillGroup();
        //Group End
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();



//Validation Start
function ckvalidation() {
    //var txtdat1 = txtdat.find("input").val();
    //var txtbdat1 = txtbdat.find("input").val();
    //var txtbroker = $("#txt_broker").val();
    //var txtslsmn = $("#txt_slsmn").val();
    //var txtbrand = $("#txt_brand").val();
    //var txtcus = $("#txt_cus").val();
    var detail_record = "";
    var rows_create = $("#raw_detailsTable_GROUP tbody >tr");
    var columns;
    var ck = 0;

    for (var i = 0; i < rows_create.length; i++) {
        columns = $(rows_create[i]).find('td');

        if (detail_record == "") {
            detail_record = $(columns[1]).html().trim();
        }
        else {
            detail_record = detail_record + "|" + $(columns[1]).html().trim();
        }

    }

    //if (txtdat1 == '') {
    //    ck = 1;
    //    Swal.fire({
    //        title: 'Please Enter Date',
    //        icon: 'error'
    //    })
    //}
    //else if (txtbdat1 == '') {
    //    ck = 1;
    //    Swal.fire({
    //        title: 'Please Enter Bilty Date',
    //        icon: 'error'
    //    })

    //}
    //else if (txtbroker == '') {
    //    ck = 1;
    //    Swal.fire({
    //        title: 'Please Select Broker',
    //        icon: 'error'
    //    })
    //}
    //else if (txtslsmn == '') {
    //    ck = 1;
    //    Swal.fire({
    //        title: 'Please Select Salesman',
    //        icon: 'error'
    //    })
    //}
    //else if (txtbrand == '') {
    //    ck = 1;
    //    Swal.fire({
    //        title: 'Please Select Brand',
    //        icon: 'error'
    //    })
    //}
    //else if (txtcus == '') {
    //    ck = 1;
    //    Swal.fire({
    //        title: 'Please Select Customer',
    //        icon: 'error'
    //    })
    //}
    //else if (rows_create.length == 0) {
    //    ck = 1;
    //    Swal.fire({
    //        title: 'Detail Record not found',
    //        icon: 'error'
    //    })
    //}

    return { ckval: ck, detailrecord: detail_record };
}
//Validation End

//Discon Start
function discon() {
    document.getElementById('create_form').reset();

    $("#txt_id").html('');

    _Branch_id = 0;
    _Branch_nam = '';

    _Group_id = 0;
    _Group_nam = '';

    $('#ck_act').iCheck('update')[0].checked;
    $('#ck_act').iCheck('check');
    //$('#ck_all_bra').iCheck('update')[0].checked;

    $("#txt_branch").select2('val', '');
    $("#txt_branch").html('');
    $("#txt_group").select2('val', '');
    $("#txt_group").html('');

    btnsav.hide();
    btnupd.hide();
    var detailsTableBody = $("#raw_detailsTable_GROUP tbody");
    detailsTableBody.empty();
    var CurrentDate = moment(new Date()).format("DD-MMM-YYYY");
    txtdatfrm.find("input").val(CurrentDate);
    txtdatto.find("input").val(CurrentDate);
    Onload();
    imgload.hide();
    imgloadsav.hide();
    ComponentsDropdowns.init();
};
//Discon End

//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();

    var _usr_id = data['ID'];
    var _usr_name = data['NAME'];
    //var _status = data['status'];
    //if (_status == 'true') { Swal.fire('CreditNote Completed'); return; }
    Swal.fire({
        title: 'Are you sure wants to edit User # ' + _usr_name + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f0ad4e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Edit',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            var txtid = $("#txt_id");
            $.ajax({

                url: apiUrl + '/System_Setup/User/New_User/FetchEditUser/' + _usr_id,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({ "Token": strkey }),
                beforeSend: function () {
                    imgloadsav.show();
                    btnupd.hide();
                    btnsav.hide();
                },
                success: function (response) {
                    if (response[0].status == 1) {
                        imgloadsav.hide();
                        $('#data_Modal').modal('show');
                        btnupd.show();
                        divpwd.hide();
                        txtid.html(response[0]["Result"][0]["ID"]);
                        $("#txt_nam").val(response[0]["Result"][0]["NAME"]);
                        $("#txt_address").val(response[0]["Result"][0]["ADDRESS"]);
                        $("#txt_email").val(response[0]["Result"][0]["E-MAIL"]);
                        $("#txt_mob").val(response[0]["Result"][0]["MOBILE"]);
                        $("#txt_pho").val(response[0]["Result"][0]["PHONE"]);
                        $("#txt_dat_frm").find("input").val(moment(response[0]["Result"][0]["Date_From"]).format("DD-MMM-YYYY"));
                        $("#txt_dat_to").find("input").val(moment(response[0]["Result"][0]["Date_To"]).format("DD-MMM-YYYY"));


                        _Branch_id = response[0]["Result"][0]["BRANCH_ID"];
                        _Branch_nam = response[0]["Result"][0]["BRANCH_NAME"];
                        $('#txt_branch').val(_Branch_id); // Select the option with a value of '1'
                        $('#txt_branch').trigger('change'); // Notify any JS components that the value changed

                        if (!response[0]["Result"][0]["Active"]) {
                            $('#ck_act').iCheck('uncheck'); //To uncheck the radio button
                        }
                        else if (response[0]["Result"][0]["Active"]) {
                            $('#ck_act').iCheck('check'); //To check the radio button
                        }


                        //if (!response[0]["Result"][0]["All_Branches"]) {
                        //    $('#ck_all_bra').iCheck('uncheck'); //To uncheck the radio button
                        //}
                        //else if (response[0]["Result"][0]["All_Branches"]) {
                        //    $('#ck_all_bra').iCheck('check'); //To check the radio button
                        //}

                        ////Detail Start
                        detailsTableBody = $("#raw_detailsTable_GROUP tbody");
                        detailsTableBody.empty();
                        var productItem = '';
                        for (var i = 0; i < response[0]["Result_Group"].length; i++) {
                            productItem += '<tr><td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td><td>' + '[' + response[0]["Result_Group"][i]["ID"] + ']-' + response[0]["Result_Group"][i]["Name"] + '</td></tr>';
                        }
                        detailsTableBody.append(productItem);
                        imgload.hide();
                        return true;
                    }
                    else {
                        imgloadsav.hide();
                        btnupd.show();
                        Swal.fire({
                            title: `${response[0].Remarks}`,

                            icon: 'error',
                            showConfirmButton: true,

                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }

                },
                error: function (error) {
                    imgloadsav.hide();
                    btnupd.show();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: 'Error ' + error,

                        icon: 'error',
                        showConfirmButton: true,

                        showClass: {
                            popup: 'animated fadeInDown faster'
                        },
                        hideClass: {
                            popup: 'animated fadeOutUp faster'
                        }

                    })
                }
            })
            return true;

        }
    });

})
//Edit End

//Delete Start
$('table').on('click', '.btn-delete', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();
    var _usr_id = data['ID'];
    var _usr_name = data['NAME'];
    Swal.fire({
        text: "Are you sure wants to delete User # " + _usr_name + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {
            var urlStr = apiUrl + '/System_Setup/User/New_User/delete/' + _usr_id;
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({ "Token": strkey }),
                beforeSend: function () {
                    imgload.show();
                }, success: function (response) {
                    var jres = response;
                    if (jres[0].status == 1) {
                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'success',
                            showConfirmButton: false,
                            // timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })

                        imgload.hide();
                        Onload();
                        return true;
                    }
                    else {
                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'error',
                            showConfirmButton: true,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })

                    }
                },
                error: function (error) {
                    console.log('Error ' + error)
                    Swal.fire({
                        title: 'Error ' + error,

                        icon: 'error',
                        showConfirmButton: true,
                        showClass: {
                            popup: 'animated fadeInDown faster'
                        },
                        hideClass: {
                            popup: 'animated fadeOutUp faster'
                        }

                    })

                }
            })
            return true;

        }
    });
})
//Delete End

//Change Password Start
$('table').on('click', '.btn-cpwd', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();

    var _usr_id = data['ID'];
    var _usr_name = data['NAME'];
    Swal.fire({
        title: 'Are you sure wants to change password of User # ' + _usr_name + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f0ad4e',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Change Password',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {
            imgloadpwd.hide();
            $('#data_Modal_pwd').modal('show');

            $("#txt_id_pwd").html(_usr_id);
            $("#txt_nam_pwd").html(_usr_name);

        }
    });

})
//Change Password End


//Discon Password Start
function discon_pwd() {
    document.getElementById('change_form_password').reset();

    $("#txt_id_pwd").html('');
    $("#txt_nam_pwd").html('');
    $("#txt_pwd").html('');
    $("#txt_con_pwd").html('');
    $('#data_Modal_pwd').modal('hide');

    imgloadpwd.hide();
};
//Discon Password End

// Change Password API Start
function changepassword() {

    Swal.fire({
        title: 'Are you sure you want to change password?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Save',
        showClass: {
            popup: 'animated fadeInDown faster'
        },
        hideClass: {
            popup: 'animated fadeOutUp faster'
        }
    }).then((result) => {
        if (result.value) {

            var urlStr = apiUrl + '/System_Setup/User/New_User/ChangePassword';
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "ID": $("#txt_id_pwd").html(),
                    "Name": $("#txt_nam_pwd").html(),
                    "Password": $("#txt_con_pwd").val()
                }),
                beforeSend: function () {
                    imgloadpwd.show();
                },
                success: function (response) {
                    var jres = response;
                    if (jres[0].status == 1) {
                        imgloadpwd.hide();

                        btnsav.show();
                        $('#data_Modal').modal('hide');
                        discon_pwd();

                        Swal.fire({
                            title: `${jres[0].Remarks}`,

                            icon: 'success',
                            showConfirmButton: false,
                            // timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                    else {
                        imgloadsav.hide();
                        btnsav.show();
                        Swal.fire({
                            title: `${response[0].Remarks}`,

                            icon: 'error',
                            showConfirmButton: false,
                            //timer: 1500,
                            showClass: {
                                popup: 'animated fadeInDown faster'
                            },
                            hideClass: {
                                popup: 'animated fadeOutUp faster'
                            }

                        })
                    }
                },
                error: function (error) {
                    imgloadpwd.hide();
                    console.log('Error ' + error)
                    Swal.fire({
                        title: 'Error ' + error,

                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonColor: '#5cb85c',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Save',
                        showClass: {
                            popup: 'animated fadeInDown faster'
                        },
                        hideClass: {
                            popup: 'animated fadeOutUp faster'
                        }
                    })
                },
            })
            return true;
        }
    })
}
// Change Password API End


//Add Group Start
$('#txt_group').on("select2-selected", function (e) {


    detailsTableBody = $("#raw_detailsTable_GROUP tbody");
    var productItem = '<tr><td><a data-itemId="0" href="#" class="deleteItem">Remove</a></td><td>' + '[' + $("#txt_group").select2('data').id + ']-' + $("#txt_group").select2('data').text + '</td></tr>';
    detailsTableBody.append(productItem);
    $('#raw_material_form').submit(function (e) {
        e.preventDefault();
        $('#data_Modal').modal({
            backdrop: 'static',
            keyboard: false,
        });
    });
    txt_group = $("#txt_group");
    txt_group.select2('val', '');
    txt_group.html('');
    txt_group.select2('focus');
});

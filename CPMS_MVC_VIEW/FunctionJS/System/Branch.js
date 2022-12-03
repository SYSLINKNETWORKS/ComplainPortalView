var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnupd = $("#btn_update");
var taxid = $("#txt_id");
var _Com_ID = 0;
var _Com_Name = '';


$(document).on("click", '#btn_new', function () {
    document.getElementById('create_form').reset();
    $('#data_Modal').modal('show');
    btnsav.show();
    btnupd.hide();
    imgloadsav.hide();
});


$(document).ready(function () {
    discon();
    ComponentsDropdowns.init();
});

//Onload Start
function Onload() {
    var _menid = document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/System_Setup/Branch/GetBranch',
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
                        { data: 'Name' },
                        { data: 'Phone' },
                        { data: 'Email' }                    
                    ],
                    "order": [[1, "asc"]],
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
    var pho = $("#txt_pho").val();
    var mob = $("#txt_mob").val();
    var fax = $("#txt_fax").val();
    var email = $("#txt_email").val();
    var web = $("#txt_web").val();
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

            var urlStr = apiUrl + '/System_Setup/Branch/create';
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "Name": $("#txt_nam").val(),
                    "Address": $("#txt_add").val(),
                    "Phone": pho,
                    "Mobile": mob,
                    "Fax": fax,
                    "Email": email,
                    "Web": web,
                    "Company_ID": $("#txt_com").select2('data').id,
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
    var pho = $("#txt_pho").val();
    var mob = $("#txt_mob").val();
    var fax = $("#txt_fax").val();
    var email = $("#txt_email").val();
    var web = $("#txt_web").val();

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
            var urlStr = apiUrl + '/System_Setup/Branch/edit';
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "ID": $("#txt_id").html(),
                    "Name": $("#txt_nam").val(),
                    "Address": $("#txt_add").val(),
                    "Phone": pho,
                    "Mobile": mob,
                    "Fax": fax,
                    "Email": email,
                    "Web": web,
                    "Company_ID": $("#txt_com").select2('data').id,
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

//Fill Branch Start
function FillCompany() {
    $("#txt_com").select2({
        placeholder: "Search for a Company",
        minimumInputLength: 0,
        //triggerChange: true,
        allowClear: true,
        ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
            url: apiUrl + '/SetupCombo/FillCompany/',
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
                            text: item.Company,
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
            var data = { "id": _Com_ID, "text": _Com_Name };
            callback(data);
        },
        dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup: function (m) {
            return m;
        } // we do not want to escape markup since we are displaying html in results
    });
}
//Fill Branch End

//Select2 Start
var ComponentsDropdowns = function () {

    var handleSelect2 = function () {
        FillCompany();
    }
    return {
        //main function to initiate the module
        init: function () {
            handleSelect2();
        }
    };
}();

//Discon Start
function discon() {
    document.getElementById('create_form').reset();

    $("#txt_id").html('');

    _Com_ID = 0;
    _Com_Name = '';

    $("#txt_com").select2('val', '');
    $("#txt_com").html('');
  
    btnsav.hide();
    btnupd.hide();
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

    var _br_id = data['ID'];
    var _br_nam = data['Name'];

    Swal.fire({
        title: 'Are you sure wants to edit Branch # ' + _br_nam + '?',
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

                url: apiUrl + '/System_Setup/Branch/FetchEditBranch/' + _br_id,
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
                        txtid.html(response[0]["Result"][0]["ID"]);
                        $("#txt_nam").val(response[0]["Result"][0]["Name"]);
                        $("#txt_add").val(response[0]["Result"][0]["Address"]);
                        $("#txt_email").val(response[0]["Result"][0]["Email"]);
                        $("#txt_mob").val(response[0]["Result"][0]["Mobile"]);
                        $("#txt_pho").val(response[0]["Result"][0]["Phone"]);
                        $("#txt_fax").val(response[0]["Result"][0]["Fax"]);
                        $("#txt_web").val(response[0]["Result"][0]["WebSite"]);

                        _Com_ID = response[0]["Result"][0]["Company ID"];
                        _Com_Name = response[0]["Result"][0]["Company"];
                        $('#txt_com').val(_Com_ID); // Select the option with a value of '1'
                        $('#txt_com').trigger('change'); // Notify any JS components that the value changed
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
    var _br_id = data['ID'];
    var _br_nam = data['Name'];

    Swal.fire({
        text: "Are you sure wants to delete Branch # " + _br_nam + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {
            var urlStr = apiUrl + '/System_Setup/Branch/delete/' + _br_id;
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

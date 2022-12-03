var imgload = $("#img_load");
var imgloadsav = $("#img_load_sav");
var btnnew = $("#btn_new");
var btnsav = $("#btn_sav");
var btnupd = $("#btn_update");
var taxid = $("#txt_id");


$(document).on("click", '#btn_new', function () {
    document.getElementById('create_form').reset();
    $('#data_Modal').modal('show');
    btnsav.show();
    btnupd.hide();
    imgloadsav.hide();
});


$(document).ready(function () {
    discon();
});

//Onload Start
function Onload() {
    var _menid = document.URL.split("?")[1];
    $.ajax({
        url: apiUrl + '/System_Setup/Company/GetCompany',
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

                //Delete
                    action_button += "<a href='#' class='btn-delete glyphicon glyphicon-trash' data-toggle='tooltip' title='Delete'></a> ";
                //Update
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
                        { data: 'Short_Name' },
                        { data: 'Email' }
                    ],
                    "order": [[1, "asc"]],
                    "pageLength": 10
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

            var urlStr = apiUrl + '/System_Setup/Company/create';
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "Name": $("#txt_nam").val(),
                    "Short_Name": $("#txt_snm").val(),
                    "Email": $("#txt_eml").val()
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
            var urlStr = apiUrl + '/System_Setup/Company/edit';
            $.ajax({
                url: urlStr,
                type: "Post",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    "Token": strkey,
                    "ID": $("#txt_id").html(),
                    "Name": $("#txt_nam").val(),
                    "Short_Name": $("#txt_snm").val(),
                    "Email": $("#txt_eml").val()
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

//Discon Start
function discon() {
    document.getElementById('create_form').reset();

    $("#txt_id").html('');
    btnsav.hide();
    btnupd.hide();
    Onload();
    imgload.hide();
    imgloadsav.hide();
};
//Discon End

//Edit Start
$('table').on('click', '.btn-edit', function (e) {
    e.preventDefault();
    var currentRow = $(this).closest("tr");
    var data = $('#Table_View').DataTable().row(currentRow).data();

    var _com_id = data['ID'];
    var _com_nam = data['Name'];
    Swal.fire({
        title: 'Are you sure wants to edit company # ' + _com_nam + '?',
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

                url: apiUrl + '/System_Setup/Company/FetchEditCompany/' + _com_id,
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
                        $("#txt_snm").val(response[0]["Result"][0]["Short_Name"]);
                        $("#txt_eml").val(response[0]["Result"][0]["Email"]);

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
    var _com_id = data['ID'];
    var _com_nam = data['Name'];
    
    Swal.fire({
        text: "Are you sure wants to delete Company # " + _com_nam + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.value) {
            var urlStr = apiUrl + '/System_Setup/Company/delete/' + _com_id;
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

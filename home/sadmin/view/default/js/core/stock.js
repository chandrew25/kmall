$(function(){
    //Datatables中文网[帮助]: http://datatables.club/
    if ($.dataTable) {
        var infoTable = $('#infoTable').DataTable({
            "language"  : $.dataTable.chinese,
            "processing": true,
            "serverSide": true,
            "retrieve"  : true,
            "ajax": {
                "url" : "api/web/list/stock.php",
                "data": function ( d ) {
                    d.query    = $("#input-search").val();
                    d.pageSize = d.length;
                    d.page     = d.start / d.length + 1;
                    d.limit    = d.start + d.length;
                    return d;
                },
                //可以对返回的结果进行改写
                "dataFilter": function(data){
                    return data;
                }
            },
            "responsive"   : true,
            "searching"    : false,
            "ordering"     : false,
            "dom"          : '<"top">rt<"bottom"ilp><"clear">',
            "deferRender"  : true,
            "bStateSave"   : true,
            "bLengthChange": true,
            "aLengthMenu"  : [[10, 25, 50, 100,-1],[10, 25, 50, 100,'全部']],
            "columns": [
                { data: "username" },
                { data: "mobile" },
                { data: "email" },
                { data: "addr" },
                { data: "cardNo" },
                { data: "bname" },
                { data: "baccount" },
                { data: "bstartup" },
                { data: "isDelegate" },
                { data: "money" },
                { data: "commitTime" },
                // ,{ data: "stock_id" }

            ],
            "columnDefs": [

                {"orderable": false, "targets": 8,
                 "render"   : function(data,type,row){
                    if ( data == 1 ) {
                        return '是';
                    } else {
                        return '否';
                    }
                 }
                }
                // ,
            //     {"orderable": false, "targets": 10,
            //      "render"   : function(data, type, row){
            //         var result = $.templates("#actionTmpl").render({ "id"  : data });

            //         $("body").off('click', 'a#info-view' + data);
            //         $("body").on('click', "a#info-view"+data, function(){
            //             location.href = 'index.php?go=admin.stock.view&id=' + data;
            //         });

            //         $("body").off('click', 'a#info-edit' + data);
            //         $("body").on('click', "a#info-edit"+data, function(){
            //             location.href = 'index.php?go=admin.stock.edit&id=' + data;
            //         });

            //         $("body").off('click', 'a#info-dele' + data);
            //         $("body").on('click', 'a#info-dele' + data, function(){//删除
            //             bootbox.confirm("确定要删除该:" + data + "?",function(result){
            //                 if ( result == true ){
            //                     $.get("index.php?go=admin.stock.delete&id="+data, function(response, status){
            //                         $( 'a#info-dele' + data ).parent().parent().css("display", "none");
            //                     });
            //                 }
            //             });
            //         });

            //         return result;
            //     }
            //  }
            ],
            "initComplete":function(){
                $.dataTable.filterDisplay();
            },
            "drawCallback": function( settings ) {
                $.dataTable.pageNumDisplay(this);
                $.dataTable.filterDisplay();
            }
        });
        $.dataTable.doFilter(infoTable);

        $("#btn-stock-import").click(function(){
            $("#upload_file").trigger('click');
        });

        $("#upload_file").change(function(){
            var data = new FormData();
            data.append('upload_file', $("#upload_file").get(0).files[0]);
            $.ajax({
                type: 'POST',
                url: "index.php?go=admin.stock.import",
                data: data,
                success: function(response) {
                    if (response && response.success){
                        bootbox.alert("导入成功！");
                        infoTable.draw();
                    } else {
                        bootbox.alert("导入失败！");
                    }
                    $("#upload_file").val("");

                },
                error: function(response) {
                    $("#upload_file").val("");
                },
                processData: false,
                contentType: false,
                dataType   : "json"
            });
        });

        $("#btn-stock-export").click(function(){
            $.getJSON("index.php?go=sadmin.stock.export", function(response){
                window.open(response.data);
            });
        });
    }

    if( $(".content-wrapper .edit form").length ) {
        $("input[name='isDelegate']").bootstrapSwitch();
        $('input[name="isDelegate"]').on('switchChange.bootstrapSwitch', function(event, state) {
            console.log(state);
        });

        $('#editStockForm').validate({
            errorElement: 'div',
            errorClass: 'help-block',
            // focusInvalid: false,
            focusInvalid: true,
            // debug:true,
            rules: {
                username: {
                    required: true
                }
            },
            messages: {
                username: "此项为必填项"
            },
            invalidHandler: function (event, validator) { //display error alert on form submit
                $('.alert-danger', $('.login-form')).show();
            },
            highlight: function (e) {
                $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
            },
            success: function (e) {
                $(e).closest('.form-group').removeClass('has-error').addClass('has-info');
                $(e).remove();
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            },
            submitHandler: function (form) {
                form.submit();
            }
        });
    }
});

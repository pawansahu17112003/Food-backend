$(document).ready(function () {

    $.getJSON("/food/fetch_all_food_category", function (response) {
        //  alert(JSON.stringify(response))

        response.data.map((item) => {
            $('#categoryid').append($('<option>').text(item.categoryname).val(item.categoryid))

        })


    })

    $('#categoryid').change(function () {

        $.getJSON("/food/fetch_all_food_subcategory", { categoryid: $('#categoryid').val() }, function (response) {

            $('#subcategoryid').empty()
            $('#subcategoryid').append($('<option>').text("Sub Category"))
            response.data.map((item) => {
                $('#subcategoryid').append($('<option>').text(item.subcategoryname).val(item.subcategoryid))

            })


        })

    })
    $('#flexSwitchCheckDefault').change(function () {

        if ($('#flexSwitchCheckDefault').is(':checked')) {
            // alert('true')
            $('#foodtypelabel').html("Non Vegeterian")
            $('#flexSwitchCheckDefault').val('Non Vegeterian')
        }

        else {
            // alert('false')
            $("#foodtypelabel").html('Vegeterian')
            $('#flexSwitchCheckDefault').val('Vegeterian')

        }
    })

    $('#foodpic').change(function (event) {
        //   alert(event.target.files[0])
        var pic = URL.createObjectURL(event.target.files[0])
        $('#foodimage').attr('src', pic)
    })

})
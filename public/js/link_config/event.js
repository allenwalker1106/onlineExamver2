
$(document).ready(function() {
    var index = 1;
    $('#add_option  ').click(function(){
        let query = "<div class='form-group'>"+
                    "<label for='link_quirement' style='color: black; font-size: 15px; width: 100px;'> Fields "+index+" </label>"+
                    "<input class='form-control' name='link[required_fields]' id='link_quirement' type='text' ></input>"+
                    "</div>";
        $('#option_container').append(query);
        index++;
    })
})
    

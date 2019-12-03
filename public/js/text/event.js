
$(document).ready(function() {
    var question_index = 1;
    $('#add_option  ').click(function(){
        let query = "<div class='form-group'>"+
                    "<label for='question_title' style='color: black; font-size: 15px; width: 100px;'> Keyword "+question_index+" </label>"+
                    "<input class='form-control' name='question[result]' id='question_title' type='text' ></input>"+
                    "</div>";
        $('#option_container').append(query);
        question_index++;
    })
})
    


$(document).ready(function() {
    var question_index = 1;
    $('#add_option  ').click(function(){
        let query = "<div class='form-group'>"+
                    "<label for='question_title' style='color: black; font-size: 15px; width: 100px;'> Option "+question_index+" </label>"+
                    "<input type='checkbox' name='question[result]["+question_index+"]' value='"+question_index+"'>"+
                    "<label class ='form-label'  style='color: black; font-size: 15px; margin: 0px 20px;'> Is True</label>"+
                    "<textarea class='form-control' name='question[options]' id='question_title' rows='3'></textarea>"+
                    "</div>";
        $('#option_container').append(query);
        question_index++;
    })
})
    

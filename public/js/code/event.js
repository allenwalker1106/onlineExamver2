
$(document).ready(function() {
    var question_index = 1;
    $('#add_option  ').click(function(){
        let query = "<label for='question_title' style='color: black; font-size: 15px; width: 100px;'>Sample "+question_index+"  </label>"+
                    "<div class='form-group row'>"+
                    "<div class='col'>"+
                    "<label  style='color: black; font-size: 15px; width: 100px;'>Test case</label>"+
                    "<textarea class='form-control' name='question[options]' id='question_title' rows='3'></textarea>"+
                    "</div>"+
                    "<div class='col'>  "+
                    "<label  style='color: black; font-size: 15px; width: 100px;'>Result </label>"+
                    "<textarea class='form-control' name='question[result]' id='question_title' rows='3'></textarea>"+
                    "</div>"+
                    "</div>";
        $('#option_container').append(query);
        question_index++;
    })
})
    

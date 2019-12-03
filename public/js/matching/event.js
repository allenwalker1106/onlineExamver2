
$(document).ready(function() {
    var question_index = 1;
    $('#add_option  ').click(function(){
        let query = "<label for='question_title' style='color: black; font-size: 15px; width: 100px;'>Option "+question_index+"  </label>"+
                    "<div class='form-group row'>"+
                    "<div class='col'>"+
                    "<textarea class='form-control' name='question[options]' id='question_title' rows='3'></textarea>"+
                    "</div>"+
                    "<div class='col-md-1 d-flex justify-content-center align-items-center'>"+
                    "<img class='fa' src='data/icon/arrows-alt-h-solid.svg'></img>"+
                    "</div>"+
                    "<div class='col'>  "+
                    "<textarea class='form-control' name='question[result]' id='question_title' rows='3'></textarea>"+
                    "</div>"+
                    "</div>";
        $('#option_container').append(query);
        question_index++;
    })
})
    

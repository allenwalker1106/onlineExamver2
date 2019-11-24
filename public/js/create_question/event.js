
$(document).ready(function() {
    var indx = 1;
    $('#add').click(function(){
        var query = $("<div class=\"form-group\"><label for=\"question_title\">Option "+indx+"               </label><input type='checkbox' name=\"question[result][" +indx+ "]\" value=\""+indx+"\"><label> Is result</label><textarea class=\"form-control\" name=\"question[options]\" id=\"question_title\" rows=\"3\"></textarea></div>");
        $('#option_container').append(query)
        indx +=1;
    })
})
    
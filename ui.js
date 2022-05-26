
// UI‰Šú‰»
$(document).ready( function(){

  $(".group").bind("click", select_all);
  $(":checkbox").bind("click", view_checked_icon_reset);
  view_checked_icon_reset();
  

});

function select_all(event){
  var objsIpt = $(this).parents("fieldset").find("input[type=checkbox]");
  if($(this).attr("checked")){
    objsIpt.attr("checked", "checked");
  }
  else{ objsIpt.removeAttr("checked"); }
}

function view_checked_icon(event){
  if($(this).attr("checked")){
    $(this).parent().attr("class", "checked");
  }
  else{ $(this).parent().attr("class", "unchecked"); }
}
function view_checked_icon_reset(){
  var objsChk = $(":checkbox");
  for(var i=0; i<objsChk.length; i++){
    if(objsChk.eq(i).attr("checked")){
      objsChk.eq(i).parent().attr("class", "checked");
    }
    else{ objsChk.eq(i).parent().attr("class", "unchecked"); }
    objsChk.eq(i).hide();
  }
}

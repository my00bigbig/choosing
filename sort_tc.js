// 初期化
$(document).ready( function(){
  $("#result").hide();
  $("#ui").hide();
  $("#reset").hide();
  $("#start_button").bind("click", ask_start);
  $("#reset_button").bind("click", reset_do);
  $("#left > *" ).bind("click", {win:0, lose:1}, button_click);
  $("#right > *").bind("click", {win:1, lose:0}, button_click);
  if(show_result_from_hash()){
    $("#init").hide();
    $("#reset").show();
  }

});

// 結果情報が付加されているか調べて表示
function show_result_from_hash(){
  if(location.search.length < 2){ return false; }
  var strParams = location.search.slice(1).split("-");
  Root = new CharacterItem(["!root",,,,]);
  var objPal = Root;
  for(var i=0; i<strParams.length; i++){
    for(var j=0; j<CharacterData.length; j++){
      if(strParams[i] == CharacterData[j][0]){
        var objChil = new CharacterItem(CharacterData[j]);
        objPal.add( objChil );
        objPal = objChil;
      }
    }
  }
  $("#rank_num").attr("value", strParams.length);
  show_result();
  return true;
}


// ソート開始
function ask_start(){
  QuestionCount = 0;
  NumLength = 0;
  var objFlg = {};
  var objFlt = $(":checkbox[name]");
  for(var i=0; i<objFlt.length; i++){
    objFlg[ objFlt.eq(i).attr("name") ] = (objFlt.eq(i).attr("checked")) ? true : false;
  }
  Root = new CharacterItem(["!root",,,,]);
  for(var i = 0; i < CharacterData.length; i++){
    var on = false;
    if(CharacterData[i][4].indexOf("?") >= 0 && !objFlg["none_name"]){ continue; }
    for(var j=0; j<CharacterData[i][4].length; j++){
      if(objFlg[ CharacterData[i][4].substr(j, 1) ] == true){
       on = true; break;
      }
    }
    if(on){
      Root.add( new CharacterItem(CharacterData[i]) );
      NumLength++;
    }
    
  }
  

  ask_next();
  
  $("#init").hide(0);
  $("#ui").fadeIn(1000);
  $("#reset").show();

}
// 次の質問
function ask_next(){
  QuestionCount++;
//  $("#samp").html(Root.toString());
  Question = Root.ask();
  $("#count").text(QuestionCount);
  if(Question){
    if(Question[1].rank() - 1 > parseInt( $("#rank_num").attr("value") )){ return false; }
    view_character("#left",  Question[0]);
    view_character("#right", Question[1]);
    return true;
  }
  return false;
}

function view_character(id, data){
  $(id + " img").attr("src", "https://my00bigbig.github.io/" + data.img + ".jpg")
  $(id + " img").attr("alt", data.name)
  $(id + " p").text(data.name);
  $(id + " h3").text(data.nick);
}

function view_progress(){

}

// 選択
function button_click(arg){
  $("#left").fadeOut(0);
  $("#right").fadeOut(0);
  Question[arg.data.win].add(Question[arg.data.lose]);
  if(ask_next() == false){ show_result(); }
  $("#left").fadeIn(500);
  $("#right").fadeIn(500);

}

// どっちも知らない
function remove_both(){
 Question[0].remove();
 Question[1].remove();
  if(ask_next() == false){ show_result(); }
}


function auto_sort(){
  var i=0;
  while(ask_next()){
    Question[0].add(Question[1]);
    i++;
  }
//  show_result();
  $("#times").html(i.toString() + ":" + NumLength + "/" + parseInt( $("#rank_num").attr("value") ));
  reset_do();
}

function reset_do(){
  
  $("#init").removeAttr("style");
  $("#ui").hide();
  $("#result").hide();
  $("#reset").hide();
  Question = null;
  Root = null;
  document.location = location.pathname;
}

// 結果表示
function show_result(){
  $("#ui").hide();
  $("#result").html("");
  var aryRanks = [];
  var objCur = Root.children[0];
  for(var i=0; i<parseInt( $("#rank_num").attr("value")); i++){
    aryRanks.push(objCur);
    if(objCur.children.length > 0){
      objCur = objCur.children[0];
    }else{ break; }
  }
  var strHtm = "";
  var strResults = [];
  strHtm += '\n<h2>排行結果發表！</h2>\n<ul class="rs_1st">\n';
  for(var i=0; i<aryRanks.length; i++){
    if(i==1){strHtm += '</ul>\n<ul class="rs_2nd">\n';}
    if(i==4){strHtm += '</ul>\n<ul class="rs_3rd">\n';}
    if(i>=10 && i%10 == 0){strHtm += '</ul>\n<ul class="rs_4th">\n';}
    strHtm += '<li><h3>' + (i+1).toString() +  '</h3><img src="https://my00bigbig.github.io/' + aryRanks[i].img  +  '.jpg" alt="' + aryRanks[i].nick + '"><br>' + aryRanks[i].name + '</li>\n';
    strResults.push(aryRanks[i].id);
  }
  //這邊記得可以改
  strHtm += '</ul>\n<div class="clear"><br>[<a href="?' + strResults.join("-") + //'">獲得是次結果連結</a>]<br>(可把連結轉貼至blog等地方)<br>如結果未能顯示，請於連結結尾加上「-0」後按ENTER。<br>「-0」的數量為(1, 4, 10, 20, 50和100)減去排行結果的總名次，<br>如最少正整數大於十或不存在，則必須自行擷取結果畫面。</div>\n';
  $("#result").html(strHtm);
  $("#result").fadeIn(1000);
}

// データクラス
function CharacterItem(data){
  if(!data){return;}
  this.id = data[0];
  this.name = data[1]; 
  this.nick = data[2];
  this.img  = data[3];
  this.attr = data[4];
  this.parent = null;
  this.children = [];
  this.rank = function(){  return (this.parent) ? this.parent.rank() + 1 : 1;  }

  // 子ノードに追加
  this.add = function(child){
    if(child.parent){
     child.parent.children.splice(jQuery.inArray(child, child.parent.children), 1);
    }
    this.children.push( child );
    child.parent = this;
  }

  // 文字列表示
  this.toString = function(){
  var str = "<li>" + this.name;
  if(this.children.length > 0){
    str += "<ul>";
    for(var i = 0; i < this.children.length; i++){
      str += this.children[i].toString();
    }
    str += "</ul>";
  }
  str += "</li>";
  return str;
  }

  // 子ノードを絞込み
  this.ask = function(){
    if(this.children.length == 0){ return false; }
    if(this.children.length == 1){ return this.children[0].ask(); }
    var both = [0, 0]
    while(true){
      if(both[0] != both[1]){ break; }
      for(var i in [0,1]){
        both[i] = Math.floor(Math.random() * this.children.length);
      }
    }
    return [this.children[both[0]], this.children[both[1]]];
  }

  // 削除
  this.remove = function(){
   while(this.children.length > 0){
    this.parent.add(this.children[0]);
   }   
   this.parent.children.splice(jQuery.inArray(this, this.parent.children), 1);
  }

}
// // clock関数 start
// function clock(){
//   var now = new Date();
   
//   var canvas = document.getElementById("clock");
//   var ctx = canvas.getContext('2d');
//   ctx.save();
   
//   canvas.width = 200;
//   canvas.height = 200;
//   var w = canvas.width;
//   var h = canvas.height;
//   var center = {x : w / 2, y : h / 2};
//   var rads = w * 0.375; 
//   ctx.clearRect(0, 0, w, h);
   
//   // 時計の外側の丸
//   ctx.save();
//   ctx.strokeStyle = '#FFF';
//   ctx.shadowBlur = 10;
//   ctx.shadowColor = '#6c757d';
//   ctx.translate(center.x,center.y);
//   ctx.beginPath();
//   ctx.arc(0, 0, w * 0.45, 0, Math.PI * 2, false);
//   ctx.fillStyle = '#6c757d';
//   ctx.fill();
//   ctx.stroke();
//   /* circle white */
//   ctx.beginPath();
//   ctx.arc(0, 0, w * 0.3, 0, Math.PI * 2, false);
//   ctx.fillStyle ="#FFF";
//   ctx.fill();
//   ctx.restore();
   
//   // 文字盤
//   ctx.save();
//   ctx.font = "15px 'sans-serif'";
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
//   ctx.fillStyle = "#FFF";
//   ctx.shadowBlur = 4;
//   ctx.shadowColor = "#FFF";
//   for (var i = 0; i < 12; i++) {
//     var radian = i * Math.PI / 6;
//     var x = center.x + rads * Math.sin(radian);
//     var y = center.y - rads * Math.cos(radian);
//     var text = "" + (i == 0 ? "12" : i);
//     ctx.fillText(text, x, y);
//   }
//   ctx.restore();
   
//   //  中心を移動
//   ctx.translate(center.x,center.y);
   
//   // 分
//   ctx.save();
//   ctx.strokeStyle = '#6c757d';
//   ctx.lineWidth = 1;
//   ctx.beginPath();
//   for (var i=0;i<60;i++){
//     if (i%5!=0) {
//       ctx.moveTo(w * 0.275, 0);
//       ctx.lineTo(w * 0.3, 0);
//     }
//     ctx.rotate(Math.PI/30);
//   }
//   ctx.stroke();
   
//   // 時間
//   ctx.strokeStyle = '#6c757d';
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   for (var i=0;i<60;i++){
//     ctx.moveTo(w * 0.25, 0);
//     ctx.lineTo(w * 0.3, 0);
//     ctx.rotate(Math.PI/6);
//   }
//   ctx.stroke();
//   ctx.restore();
   
//   // 針の設定
//   var sec = now.getSeconds();
//   var min = now.getMinutes();
//   var hr= now.getHours();
//   hr = hr>=12 ? hr-12 : hr;
//   ctx.fillStyle = "#999";
   
//   // 短針
//   ctx.save();
//   ctx.rotate( hr*(Math.PI/6) + (Math.PI/360)*min + (Math.PI/21600)*sec )
//   ctx.lineWidth = 7;
//   ctx.strokeStyle = '#6c757d';
//   // ctx.shadowBlur = 5;
//   // ctx.shadowColor = "#666";
//   ctx.beginPath();
//   ctx.moveTo(w * -0.01, w * 0.075);
//   ctx.lineTo(0, w * -0.2);
//   // ctx.lineTo(w * 0.01, w * 0.075);
//   ctx.stroke();
//   ctx.restore();
   
//   // 長針
//   ctx.save();
//   ctx.rotate( (Math.PI/30)*min + (Math.PI/1800)*sec )
//   ctx.lineWidth = 3;
//   ctx.strokeStyle = '#6c757d';
//   // ctx.shadowBlur = 10;
//   // ctx.shadowColor = "#999";
//   ctx.beginPath();
//   ctx.moveTo(w * -0.005, w * 0.075);
//   ctx.lineTo(0, w * -0.25);
//   // ctx.lineTo(w * 0.005, w * 0.075);
//   ctx.stroke();
//   ctx.restore();
   
//   // 秒針
//   ctx.save();
//   ctx.rotate(sec * Math.PI/30);
//   ctx.strokeStyle = '#6c757d';
//   ctx.lineWidth = 1;
//   ctx.beginPath();
//   ctx.moveTo(0,w * 0.01);
//   ctx.lineTo(0,w * -0.3);
//   ctx.stroke();
//   ctx.restore();
   
//   // 時計の中心の丸
//   ctx.save();
//   ctx.beginPath();
//   ctx.lineWidth = 2;
//   ctx.strokeStyle = "#FFF";
//   ctx.fillStyle   = "#FFF";
//   ctx.arc(w * 0.007, 0, w * 0.0075, 0, Math.PI*2, true);
//   // ctx.arc(w * 0.007, w * -0.01,w * 0.0075,0,Math.PI*2,true);
//   ctx.stroke();
//   ctx.fill();
//   ctx.restore();
   
//   ctx.restore();
   
// }

window.addEventListener("load", function(){
  // setInterval(clock, 1000);
  setInterval(now_line, 1100);
  setInterval(today, 60000);
  setInterval(now, 30000);
}, false);

var now = function(){
  var elem = $(".navbar-text");
  var now_time = time()[5] + "/" + time()[4] + "/" + time()[3] + " " + time()[0] + ":" + time()[1]
  elem.text(now_time);
}

var time = function(){
  const now = new Date();
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const second = now.getSeconds().toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString().slice(-2)
  return [hour, minute, second, day, month, year]
}

var elemtop = function(hour, minute, second, day){
  let navbar = $(".navbar").innerHeight();
  let elem = $(".dhm_" + day + hour + minute);
  if(elem.length){
    let sheight = elem.innerHeight() / 60;
    let elemtop = Math.floor(elem.offset().top) - navbar + sheight * Number(second);
    let text = time()[0] + ":" + time()[1] + ":" + time()[2];
    return [elemtop, text]
  }else{
    elem = $(".axis").height();
    let elemtop = elem - $(".now-line").innerHeight() * 3 / 2;
    let text = "end";
    return [elemtop, text]
  }
}

function now_line(){
  if($(".now-line").length){
    const nowtop = elemtop(time()[0], time()[1], time()[2], time()[3]);
    $(".now-line").css("top", nowtop[0]);
    $(".now-line").text(nowtop[1]);
    // if(nowtop){
    //   $(".now-line").text(time()[0] + ":" + time()[1] + ":" + time()[2].toString().padStart(2, "0"));
    // }else{
    //   $(".now-line").text("end");
    // }
  }
}

function scroll(){
  if($(".task-form").css("display") == "block"){
    var top = $(".task-form").offset().top - $(window).height() / 4;
    $(window).scrollTop(top);
  }else{
    if($(".now-line").length){
      const nowtop = elemtop(time()[0], time()[1], time()[2], time()[3]);
      $(".now-line").css("top", nowtop[0]);
      if(nowtop[1] != "end"){
        $(window).scrollTop(nowtop[0] - 200);
      }else{
        $(window).scrollTop(nowtop[0]);
      }
    }else{
      var navbar = $(".navbar").height();
      var top = Math.floor($(".task").offset().top) - navbar * 2
      $(window).scrollTop(top);
    }
  }
}

function set_task(){
  var i = 0;
  $(".task").each(function(){
    // $(".task-delete").each(function(){
      var task = $(this);
      var btn = $(this).parent().prev(".badge");
      // var task = $(this).find("div.task");
      var navbar = $(".navbar").height();
      var cname_array = task.attr("class").split(" ");
      var cname = cname_array[1].substr(5)
      var range = cname_array[2].substr(6)
      var div_height = $(":root").css("--time-div-height").slice(0, -2)
      if($(".task-form").length && range <= 40){
        var changedivheight = div_height * 35 
      }else if(range <= 15){
        var changedivheight = div_height * 20
      }
      if($(".task-form").length && range <= 40 || range <= 15){
        range = changedivheight + (range - 1) * div_height
        boolean = cname.endsWith("00");
        if(boolean){
          var changediv = $("."+cname).next().attr("class").split(" ")[0];
          $("."+changediv).css("height", changedivheight)
        }else{
          $("."+cname).css("height", changedivheight)
        }
      // }else if(range <= 15){
      //   var changedivheight = div_height * 20
      //   range = changedivheight + (range - 1) * div_height
      //   boolean = cname.endsWith("00");
      //   if(boolean){
      //     console.log(1)
      //     var changediv = $("."+cname).next().attr("class").split(" ")[0];
      //     $("."+changediv).css("height", changedivheight)
      //   }else{
      //     $("."+cname).css("height", changedivheight)
      //   }
      }else{
        range = range * div_height// - div_height / 2;
      }
      var top = Math.floor($("."+cname).offset().top) - navbar - div_height * 1.4;
      $(this).css("top", top);
      $(this).css("height", range);
      $(this).css("z-index", i);
      $(".task-form").css("z-index", 10)
      var bottom = top + range
      var btn_top = bottom - btn.innerHeight() * 0.9
      btn.css("top", btn_top);
      i += 1
  })
}

$(function(){
  today(false);
  draw();
  set_task();
  scroll();
})

function draw() {
  var canvas = document.getElementById('plus');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');

    var x = canvas.height;
    var y = canvas.width;

    ctx.beginPath();
    ctx.arc(x*0.5, y*0.5, x*0.45, 0, Math.PI * 2, true); // 外の円
    ctx.fillStyle = "#6c757d"
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "white"
    ctx.arc(x/2, y*5/20, x*1/20, 0, Math.PI, true);
    ctx.arc(x/2, y*15/20, x*1/20, Math.PI, Math.PI*2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x*5/20, y/2, y*1/20, Math.PI/2, Math.PI*3/2, false);
    ctx.arc(x*15/20, y/2, y*1/20, Math.PI*3/2, Math.PI/2, false);
    ctx.fill();
  }
}

function today(zero) {
  var canvas = document.getElementById('today');
  if(zero){
    var time = $(".today-view").attr("class").split(" ")[2].split("-")
  }else{
    var time = $(".today-view").attr("class").split(" ")[1].split("-")
  }
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');

    var x = canvas.height;
    var y = canvas.width;

    // ctx.beginPath();
    // ctx.strokeStyle = "#6c757d";
    // ctx.lineWidth = 3;
    roundedRect(ctx, 5, 15, 110, 70, 30);
    // ctx.closePath();
    date = time[0] + "/" + time[1] + "/" + time[2]
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#6c757d";
    if(zero){
      ctx.fillText(date, 60, 50)
    }else{
      ctx.fillText(date, 60, 50)
    }
    // ctx.stroke();

    // ctx.fillStyle = "#6c757d"
    // ctx.fill();
    // ctx.beginPath();
  }
}

function roundedRect(ctx, x, y, width, height, radius) { //角丸四角の描画
  ctx.beginPath();
  ctx.strokeStyle = "#6c757d";
  ctx.lineWidth = 5;
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.fill();
}

$(window).scroll(function() {
  var navbar = $(".navbar").height();
  var window_top = $(this).scrollTop() + navbar * 2;
  var tomorrow = $(".tomorrow").offset().top;
  if(window_top > tomorrow){
    today(true)
  }else{
    today(false)    
  }
});



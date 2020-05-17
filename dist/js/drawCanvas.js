function drawCanvas() {
  var width = 3
  var strokeStyle = "#757575"
  var fillStyle = "black";
  //开始画多边形
  //开始路径
  ctx.font = "40px 微软雅黑";
  ctx.fillText("分数：", 20, 40);
  ctx.beginPath();
  ctx.moveTo(verts[0].x, verts[0].y);
  for (let i = 1; i < num; i++) {
    ctx.lineTo(verts[i].x, verts[i].y);
    if (i == num - 1) {
      ctx.lineTo(verts[0].x, verts[0].y);
    }
  }
  ctx.closePath();

  //路径闭合
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.stroke();
  }
  //画多边形结束
  //画节点圆心
  for (var i = 0; i < num; i++) {
    ctx.beginPath();
    ctx.arc(verts[i].x, verts[i].y, 20, 0, 2 * Math.PI);
    ctx.strokeStyle = "#757575";
    ctx.fillStyle = "#fff";
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = "#000";
    ctx.font = "20px Georgia";
    ctx.fillText((verts[i].val).toString(), verts[i].x - 5, verts[i].y + 5);
  }

  //画操作符
  for (var i = 0; i < num; i++) {
    if (i == verts.length - 1) {
      var newX = (verts[i].x + verts[0].x) / 2 + 5;
      var newY = (verts[i].y + verts[0].y) / 2 + 5;
    } else {
      var newX = (verts[i].x + verts[i + 1].x) / 2 + 5;
      var newY = (verts[i].y + verts[i + 1].y) / 2 + 5;
    }
    /*
    if(verts[i].edge1 == 0) {
        continue;
    }
    */
    ctx.fillStyle = "#000";
    ctx.font = "20px Georgia";
    ctx.fillText(verts[i].operate, newX, newY);
  }
  status = 0; //当前状态为0  
}
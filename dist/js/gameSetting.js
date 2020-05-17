//画布初始化
let [x, y, r] = [530, 225, 150] // ES6解构赋值
// let canvas = $("#canvas") //jquery object
let canvas = document.getElementById("canvas") //DOM  element
canvas.width = 700
canvas.height = 450
canvas.onmouseover = function () {
  this.style.cursor = "pointer"
}
//获取上下文
// let ctx = canvas[0].getContext("2d") //这里要注意 canvas是jquery object，并不是DOM element
let ctx = canvas.getContext("2d")
// *****************解决移动端糊的问题
let dpr = window.devicePixelRatio; // 假设dpr为2
// 获取css的宽高
let {
  width: cssWidth,
  height: cssHeight
} = canvas.getBoundingClientRect();
// 根据dpr，扩大canvas画布的像素，使1个canvas像素和1个物理像素相等
canvas.style.width = canvas.width + 'px';
canvas.style.height = canvas.height + 'px';

canvas.width = dpr * cssWidth;
canvas.height = dpr * cssHeight;
// 由于画布扩大，canvas的坐标系也跟着扩大，如果按照原先的坐标系绘图内容会缩小
// 所以需要将绘制比例放大
ctx.scale(dpr, dpr);
// **************************

// dom
let gameDesTitle1 = $("#game-describe-title li:nth-child(1)") //新游戏按钮
let gameDesTitle2 = $("#game-describe-title li:nth-child(2)") //自定义游戏按钮
let gameDescribeDetail1 = $("#game-describe-detail")
let gameDesign = $("#game-design")
let startGame = $("#start")
let endGame = $("#end")

let vValueSet = $("#vValue-set")
let eValueSet = $("#eValue-set")

let background1 = $("#background1")
let close1 = $("#background1 span:nth-child(1)")
let confirm1 = $("#confirm")
let cancel1 = $("#cancel")

let background2 = $("#background2")
let close2 = $("#background2 span:nth-child(1)")
let confirm2 = $("#confirm2")
let cancel2 = $("#cancel2")

let background3 = $("#background3")
let close3 = $("#background3 span:nth(1)")
let confirm3 = $("#confirm3")

let bestWay = $("#best-way")

let string = "";
let check1 = 0; //用户是否确定要使用自定义的顶点值
let check2 = 0; //用户是否确定要使用自定义的边运算符值

//绑定
let vert = function (x, y, edge1, val, operate, num) {
  this.x = x
  this.y = y
  this.edge1 = edge1
  this.val = val
  this.operate = operate
  this.num = num
}

let gameMode = 1 //游戏还未新游戏模式为1，自定义游戏模式为2
let num = 0 //多边形的边数
let status = 0 //游戏有三个状态，0是用户未点击过多边形，1是用户已经去掉了多边形的一条边，2是用户正在消除边的过程中, 3为最佳方案演示的过程


gameDesTitle1.click(function () {
  gameMode = 1
  console.log("game1 随机模式", gameMode)
  $(this).css({
    "color": "#fff",
    "backgroundColor": "#16A085"
  })
  gameDesTitle2.css({
    "color": "#16A085",
    "backgroundColor": "#fff"
  })
  gameDescribeDetail1.css({
    "display": "block"
  })
  gameDesign.css({
    "display": "none"
  })
})

gameDesTitle2.click(function () {
  gameMode = 2
  console.log("game2 自由模式", gameMode)
  $(this).css({
    "color": "#fff",
    "backgroundColor": "#16A085"
  })
  gameDesTitle1.css({
    "color": "#16A085",
    "backgroundColor": "#fff"
  })
  gameDescribeDetail1.css({
    "display": "none"
  })
  gameDesign.css({
    "display": "block"
  })
})

//设置一
vValueSet.click(function () {
  background1.css({
    "display": "block"
  })
})

close1.click(function () {
  background1.css({
    "display": "none"
  })
})

confirm1.click(function () {
  background1.css({
    "display": "none"
  })
  check1 = 1;
  console.log("confirm1 check1", check1)
})

cancel1.click(function () {
  background1.css({
    "display": "none"
  })
  console.log("cancel1 check1", check1)
})

//设置二
eValueSet.click(function () {
  background2.css({
    "display": "block"
  })
})

close2.click(function () {
  background2.css({
    "display": "none"
  })
})

confirm2.click(function () {
  background2.css({
    "display": "none"
  })
  check2 = 1;
  console.log("confirm2 check2", check2)
})

cancel2.click(function () {
  background2.css({
    "display": "none"
  })
  console.log("cancel2 check2", check2)
})

confirm3.click(function (){
  background3.css({
    "display": "none"
  })
})

close3.click(function (){
  background3.css({
    "display": "none"
  })
})
//变量的数据结构
let vertX = [] //节点的x坐标
let vertY = [] //节点的y坐标
let edge1 = [] //用于判断边是否第一次时被删除
let edge2 = [] //用于判断边是否为非第一次时被删除
let verts = [] //节点对象数组
let vertsB = [] //用于计算最佳路径的节点对象数组
let val = []
let operate = []
let operator = ["+", "x"];
let delEdge = [] //被删除的边
let delList = [] //被删除的边的队列
let rightTag = 0

//清除函数
function allClear() {
  num = 0
  status = 0
  //会改变原数组  splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。
  vertX.splice(0, vertX.length)
  vertY.splice(0, vertY.length)
  edge1.splice(0, edge1.length)
  val.splice(0, val.length)
  operate.splice(0, operate.length)
  verts.splice(0, verts.length)
  vertsB.splice(0, vertsB.length)
  delEdge.splice(0, delEdge.length)
  rightTag = 0
  delList.splice(0, delList.length)
  delLeft = 0
  delRight = 0

  // vertX    = []
  // vertY    = []
  // edge1    = []
  // val      = []
  // operate  = []
  // verts    = []
  // vertsB   = []
  // delEdge  = []
  // rightTag = 0
  // delList  = []
  // delLeft  = 0
  // delRight = 0 
}

startGame.click(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height) //clearRect() 方法清空给定矩形内的指定像素。
  //随机模式
  if (gameMode === 1) {
    allClear()
    //随机产生多少个点
    num = parseInt(Math.random() * (10 - 3 + 1) + 3, 10) //以十进制的方式解析 parseInt(string, radix) 解析参数
    for (let i = 0; i < num; i++) {
      vertX[i] = x + r * Math.cos(2 * Math.PI * i / num)
      vertY[i] = y + r * Math.sin(2 * Math.PI * i / num)
    }
    for (let i = 0; i < num; i++) {
      edge1[i] = 1;
    }
    for (let i = 0; i < num; i++) {
      val[i] = parseInt(Math.random() * (10 - 1 + 1) + 1, 10);
    }
    //产生随机运算符号
    for (let i = 0; i < num; i++) {
      operate[i] = operator[Math.round(Math.random())]; //Mathi.round取整
    }
    //记录随机产生的节点
    for (let i = 0; i < num; i++) {
      verts[i] = new vert(vertX[i], vertY[i], edge1[i], val[i], operate[i], i) //用在记录当前每个节点
      vertsB[i] = new vert(vertX[i], vertY[i], edge1[i], val[i], operate[i], i) //用在计算最佳路径
    }
    console.log('开始游戏', '随机产生的点的数量num:', num)
    console.log("随机运算符号operate:", operate, "随机产生的节点verts:", verts)
    drawCanvas(ctx)
  } else if (gameMode === 2) {
    allClear()
    num = parseInt($("#vert-num select")[0].value)
    for (let i = 0; i <= num; i++) {
      vertX[i] = x + r * Math.cos(2 * Math.PI * i / num)
      vertY[i] = y + r * Math.sin(2 * Math.PI * i / num)
    }
    for (let i = 0; i < num; i++) {
      edge1[i] = 1
    }
    if (check1 == 1) {
      for (let i = 0; i < num; i++) {
        val[i] = parseInt($("#vert-value input")[i].value)
      }
    } else {
      for (let i = 0; i < num; i++) {
        val[i] = 1;
      }
    }
    if (check2 == 1) {
      for (let i = 0; i < num; i++) {
        operate[i] = $("#edge-value select")[i].value
      }
    } else {
      for (let i = 0; i < num; i++) {
        operate[i] = "+";
      }
    }
    for (let i = 0; i < num; i++) {
      verts[i] = new vert(vertX[i], vertY[i], edge1[i], val[i], operate[i], i);
      vertsB[i] = new vert(vertX[i], vertY[i], edge1[i], val[i], operate[i], i);
    }
    console.log('自定义的节点数目',num,'每个节点的值',val,'每个节点的运算符',operate)
    drawCanvas(ctx)
  }
})

endGame.click(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  allClear()
  console.log('结束游戏')
})


bestWay.click(() =>{
  console.log("最佳方案为：");
  status = 3;
  setBestChoice();
})

// var delList = new Array();  //被删除的边的队列
var delLeft = 0;
var delRight = 0;

function drawBestWay(first, way1, score) {
    var n = vertsB.length;
    var wayBest = new Array();
    var way = new Array();
    var highestScore = score;
    if(first == 1) {
        var firstE = n - 1;
    } else {
        var firstE = first - 2;
    }
    delLeft = firstE;
    for(var i = 0; i < way1.length; i++) {
        if(way1[i] == 1) {
            way[i] = n - 1;
        } else {
            way[i] = way1[i] - 2;
        }
    }

    while(way.length != 0) {
        wayBest.push(way.splice(way.length - 1, 1));
        
    }
    console.log("first edge: " + firstE);
    console.log("best way:");
    for(var i = 0; i < wayBest.length; i++) {
        console.log(wayBest[i] + " ");
    }
    for(var i = 0; i < wayBest.length + 2; i++) {
        dosetTimeout(i);
    }

    function dosetTimeout(i) {
        setTimeout(function() {
            if(i <= 1) {
                drawBest(firstE, null, highestScore, i);
            } else {
                drawBest(firstE, wayBest[i - 2], highestScore, i);
            }
        }, 1000 * i);
    }
    setTimeout(function() {
        //设置定时器
        background3.css({
          "display": "block"
        })
        $("#res-title h2").html("如图所示")
        var resString = "";
        resString = resString + "最高分为：" + highestScore.toString() + "</br>";
        resString = resString + "删除的第一条边为：" + (firstE + 1).toString() + "</br>";
        resString = resString + "剩余边的删除顺序为：</br>";
        for(var i = 0; i < wayBest.length; i++) {
            if(i == wayBest.length - 1) {
                resString = resString + (parseInt(wayBest[i]) + 1).toString();
            } else {
                resString = resString + (parseInt(wayBest[i]) + 1).toString() + " → ";
            } 
        }
        // resultText.innerHTML = resString;
        $("#content").html(resString)
    }, 1000 *(wayBest.length + 2));
}

function drawBest(firstE, wayDel, score, times) {
    //以下画图所用
    var width = 3;
    var score = score;
    var strokeStyle = "#757575";
    var fillStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //开始画多边形
    //开始路径
    ctx.font = "20px 微软雅黑";
    ctx.fillText("最高分为：" + score.toString(), 20, 40);
    var string = "";
    var tag;
    if(times > 1) {
        string = string + "times: " + times.toString() + " wayDel: " + wayDel.toString();
    } else {
        string = string + "times: " + times.toString();
    }
    if(times > 1) {
        delList.push(wayDel);
        for(var i = 0; i < vertsB.length; i++) {
            if(wayDel == vertsB[i].num) {
                if(vertsB[i].num == delRight) {
                    if(i == 0) {
                        delRight = vertsB[vertsB.length - 1].num;
                    } else {
                        delRight = vertsB[i].num - 1;
                    }
                }
                if(i == (vertsB.length - 1)) {
                    if(vertsB[i].operate == "+") {
                        vertsB[0].val += vertsB[i].val;
                    } else {
                        vertsB[0].val *= vertsB[i].val;
                    }
                } else {
                    if(vertsB[i].num != delRight) {
                        if(vertsB[i].operate == "+") {
                            vertsB[i + 1].val += vertsB[i].val;
                        } else {
                            vertsB[i + 1].val *= vertsB[i].val;
                        }
                    }
                }
                wayDel = i;
                tag = wayDel;
                break;
            }
        }
        vertsB.splice(wayDel, 1);
        if(wayDel - 1 == delLeft) {
            delLeft += 1;
        }
    }
    string = string + " delLeft: " + delLeft.toString() + " delRight: " + delRight.toString() + " leftEdge: ";
    for(var i = 0; i < vertsB.length; i++) {
        string = string + vertsB[i].num.toString() + " ";
    }
    console.log(string);
    ctx.beginPath();
    ctx.moveTo(vertsB[0].x, vertsB[0].y);
    for(var i = 0; i < vertsB.length; i++) {
        if(times == 0) {
            ctx.lineTo(vertsB[i].x, vertsB[i].y);
        } else if(times == 1) {
            delLeft = firstE;
            delRight = firstE;
            if(vertsB[i].num - 1 == firstE) {
                ctx.moveTo(vertsB[i].x, vertsB[i].y);
            } else {
                ctx.lineTo(vertsB[i].x, vertsB[i].y);
            }
            if((i == vertsB.length - 1) && (vertsB[i].num != firstE)) {
                ctx.lineTo(vertsB[0].x, vertsB[0].y);
            }
        } else {
            if(vertsB[i].num - 1 == firstE) {
                ctx.moveTo(vertsB[i].x, vertsB[i].y);
            //} else if((i != vertsB.length - 1) && (vertsB[i].num - 1 == delLeft)) {
            } else if(vertsB[i].num - 1 == delLeft) {
                ctx.moveTo(vertsB[i].x, vertsB[i].y);
            } else {
                ctx.lineTo(vertsB[i].x, vertsB[i].y);
            }
            if((i == vertsB.length - 1) && (vertsB[i].num != firstE)) {
                ctx.lineTo(vertsB[0].x, vertsB[0].y);
            }
        }
        
    }
    if(times == 0) {
        ctx.closePath();
    }
    if(strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = width;
        ctx.lineJoin = "round";
        ctx.stroke();
    }
    //画多边形结束

    //画节点圆心
    for(var i = 0; i < vertsB.length; i++) {
        ctx.beginPath();
        ctx.arc(vertsB[i].x, vertsB[i].y, 20, 0, 2 * Math.PI);
        ctx.strokeStyle = "#757575";
        ctx.fillStyle = "#fff";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = "#000";
        ctx.font = "20px Georgia";
        ctx.fillText((vertsB[i].val).toString(), vertsB[i].x - 5, vertsB[i].y + 5);
    }

    //画操作符
    for(var i = 0; i < vertsB.length; i++) {
        if(i == vertsB.length - 1) {
            var newX = (vertsB[i].x + vertsB[0].x) / 2 + 5;
            var newY = (vertsB[i].y + vertsB[0].y) / 2 + 5;
        } else {
            var newX = (vertsB[i].x + vertsB[i + 1].x) / 2 + 5;
            var newY = (vertsB[i].y + vertsB[i + 1].y) / 2 + 5;
        }
        ctx.fillStyle = "#000";
        ctx.font = "20px Georgia";
        if((times != 0) && (vertsB[i].num == delRight)) {          //该节点的前一个节点的边是否是第一次被删除的，是的话就跳过
            continue;
        }
        ctx.fillText(vertsB[i].operate, newX, newY);
    }
}
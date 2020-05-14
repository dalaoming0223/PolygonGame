let gameMode = 1 //游戏还未新游戏模式为1，自定义游戏模式为2
let num      = 0 //多边形的边数
let status   = 0 //游戏有三个状态，0是用户未点击过多边形，1是用户已经去掉了多边形的一条边，2是用户正在消除边的过程中, 3为最佳方案演示的过程

//绑定
let vert = function (x, y, edge1, val, operate, num) {
  this.x = x
  this.y = y
  this.edge1 = edge1
  this.val = val
  this.operate = operate
  this.num = num
}



//画布初始化
let [x, y, r] = [530, 225, 150] // ES6解构赋值
let canvas = $("#canvas") //jquery object
// let canvas = document.getElementById("canvas")  //DOM  element
canvas.width = 700
canvas.height = 450
canvas.onmouseover = function () {
  this.style.cursor = "pointer"
}

//获取上下文
let ctx = canvas[0].getContext("2d") //这里要注意 canvas是jquery object，并不是DOM element

// dom
let gameDesTitle1 = $("#game-describe-title li:nth-child(1)") //新游戏按钮
let gameDesTitle2 = $("#game-describe-title li:nth-child(2)") //自定义游戏按钮
let gameDescribeDetail1 = $("#game-describe-detail")
let gameDesign = $("#game-design")
let startGame = $("#start")
let endGame   = $("#end")

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
let close3 = $("#background3 span:nth-child(1)")
let confirm3 = $("confirm3")


let string = "";
let check1 = 0; //用户是否确定要使用自定义的顶点值
let check2 = 0; //用户是否确定要使用自定义的边运算符值


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
    for(let i = 0; i < num; i++){
      vertX[i] = x + r * Math.cos(2 * Math.PI * i / num)
    }
  }
  console.log('开始游戏')
})

endGame.click(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  allClear()
  console.log('结束游戏')
})
var firstDelEdge;
var stack;
var bestScore;
var n;
var m;
var cut;
var op;
var v;
var minf;
var maxf;
function setBestChoice() {
    firstDelEdge = 0;
    stack = new Array();
    bestScore = 0;
    n = vertsB.length;
    m = new Array(n + 1);
    cut = new Array(n + 1);
    op = new Array(n + 1);
    v = new Array(n + 1);
    minf = 0;
    maxf = 0;

    console.log("节点值为：")
    for(var i = 0; i < n; i++) {
        console.log(vertsB[i].val + " ");
    }

  //最佳路径
  for (let i = 0; i < n + 1; i++) {
    m[i] = new Array(n + 1)
    for (let j = 0; j < n + 1; j++) {
      m[i][j] = new Array(2)
    }
  }

  for (let i = 0; i < n + 1; i++) {
    for (let j = 0; j < n + 1; j++) {
      for (let s = 0; s < n + 1; s++) {
        m[i][j][s] = 0
      }
    }
  }

  for (let i = 0; i < n + 1; i++) {
    cut[i] = new Array(n + 1)
    for (let j = 0; j < n + 1; j++) {
      cut[i][j] = new Array(2)
    }
  }

  //符号
  for (let i = 1; i <= n; i++) {
    if (i == 1) {
      op[i] = vertsB[n - 1].operate
    } else {
      op[i] = vertsB[i - 2].operate
    }
    v[i] = vertsB[i - 1].val
  }

  for (let i = 1; i <= n; i++) {
    m[i][1][0] = m[i][1][1] = v[i]
  }
  /*
    for (let i = 1; i <= n; i++) {
    console.log(op[i] + " " + v[i])
  }
  */

  console.log('之前的m:', m)
  for (let j = 2; j <= n; j++) {
    for (let i = 1; i <= n; i++) {
      for (let s = 1; s < j; s++) {
        MinMax(i, s, j, m, n, op)
        if (m[i][j][0] > minf) {
          m[i][j][0] = minf
          cut[i][j][0] = s //记录该链取得最小值的断点
        }
        if (m[i][j][1] < maxf) {
          m[i][j][1] = maxf
          cut[i][j][1] = s //记录该链取得最大值的断点
        }
      }
    }
  }
  console.log('后来的m:', m)
  bestScore = m[1][n][1]
  firstDelEdge = 1
  for (var i = 2; i <= n; i++) {
    if (bestScore < m[i][n][1]) {
      bestScore = m[i][n][1]
      firstDelEdge = i //如果一开始删除第i边有更优的结果，则更新
    }
  }  
  console.log('cut:', cut)
  console.log('op:', op)
  getBestChoice(firstDelEdge, n, true)
  drawBestWay(firstDelEdge, stack, bestScore)

}

function getBestChoice(i, j, needMax) {
  console.log('getbestChoice:->m:',m)
  let s, r;
  let e = new Array(5);
  if (j == 1) return; //链中只有一个顶点，直接返回
  if (j == 2) {
    s = cut[i][j][1];
    r = (i + s - 1) % n + 1;
    stack.push(r);
    return;
  }
  s = needMax ? cut[i][j][1] : cut[i][j][0];
  r = (i + s - 1) % n + 1;
  stack.push(r);
  //链中有两个以上的顶点时，将最优的边入栈
  if (op[r] == "+") {
    if (needMax) { //如果合并得到的父链需要取得最大值
      getBestChoice(i, s, true);
      getBestChoice(r, j - s, true);
    } else {
      getBestChoice(i, s, false);
      getBestChoice(r, j - s, false);
    }
  } else {
    let a = m[i][s][0];
    let b = m[i][s][1];
    let c = m[r][j - s][0];
    let d = m[r][j - s][1];
    e[1] = a * c;
    e[2] = a * d;
    e[3] = b * c;
    e[4] = b * d;
    let mergeMax = e[1];
    let mergeMin = e[1];
    for (let k = 2; k < 5; k++) {
      if (mergeMin > e[k]) {
        mergeMin = e[k];
      }
      if (mergeMax < e[k]) {
        mergeMax = e[k];
      }
    }
    let merge = needMax ? mergeMax : mergeMin;
    if (merge == e[1]) { //子链1和子链2都取最小
      getBestChoice(i, s, false);
      getBestChoice(r, j - s, false);
    } else if (merge == e[2]) { //子链1取最小，子链2取最大
      getBestChoice(i, s, false);
      getBestChoice(r, j - s, true);
    } else if (merge == e[3]) { //子链1取最大，子链2取最小
      getBestChoice(i, s, true);
      getBestChoice(r, j - s, false);
    } else { //子链1和子链2都取最大
      getBestChoice(i, s, true);
      getBestChoice(r, j - s, true);
    }
  }
}
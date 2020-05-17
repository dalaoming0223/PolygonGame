function MinMax(i , s, j, m, n, op) {
  let e = new Array(5);
    let a = m[i][s][0];
    let b = m[i][s][1];
    let r = (i + s - 1) % n + 1;
    let c = m[r][j - s][0];
    let d = m[r][j - s][1];
    if(op[r] == "+") {
        minf = a + c;
        maxf = b + d;
    } else {
        e[1] = a * c;
        e[2] = a * d;
        e[3] = b * c;
        e[4] = b * d;
        minf = e[1];
        maxf = e[1];
        for(let k = 2; k < 5; k++) {
            if(minf > e[k]) {
                minf = e[k];
            }
            if(maxf < e[k]) {
                maxf = e[k];
            }
        }
    }
}
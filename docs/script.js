var t = [[4,0,3,0,0,2,0,0,0],[5,0,0,0,6,0,1,2,0],[9,0,0,0,0,0,0,0,4],[0,0,8,0,7,0,0,0,0],[0,0,0,2,0,3,0,0,8],[0,3,6,0,0,0,7,0,0],[0,7,0,9,2,0,0,0,0],[0,0,0,0,0,5,0,9,6],[0,0,0,8,0,4,5,0,0]];
// var t = [
//     [2,6,0,9,7,0,4,8,0],
//     [0,0,4,8,5,2,0,0,6],
//     [3,0,5,0,4,0,2,7,9],
//     [0,4,0,7,0,0,9,2,3],
//     [0,3,0,0,2,9,5,6,0],
//     [0,2,9,0,3,5,0,4,0],
//     [0,5,0,3,0,4,6,0,2],
//     [4,9,2,0,6,8,0,0,0],
//     [6,0,3,2,0,7,8,0,4]];

var tCols = t.map((r,ir)=>r.map((_,ic)=>t[ic][ir]));
var m = document.querySelector('.map');

t.reduce((acc, r, rindex) => {
    var row =  document.createElement('div');
    row.classList.add('row');
    acc.appendChild(r.reduce((acc, c, cindex) => {
        var cel = document.createElement('div');
        cel.classList.add('cell');
        var inp = document.createElement('input');
        inp.addEventListener('input', function () {
            t[rindex][cindex] = +this.value;
            tCols[cindex][rindex] = +this.value;
        });
        inp.value = t[rindex][cindex];
        cel.appendChild(inp);
        acc.appendChild(cel);
        return acc;
    },row));
    return acc;
}, m);

var counter = 0;
function solve(){
    counter++;
    if(check(t, tCols)) {
        var cells = document.querySelectorAll('.cell input');
        var index = 0;
        t.forEach(r=>r.forEach(c=>cells[index++].value = c));
        return true;
    }

    var aa = t.reduce((acc, r, ir)=>acc.concat(r.map((c,ic)=>({
        val : c,
        guess : getAvailableValues(t,ir,ic),
        col: ic,
        row: ir
    }))),[]).filter(el=>el.guess.length).sort((a,b)=>a.guess.length-b.guess.length);

    for(var i=0;i<aa.length;i++){
        var el = aa[i];
        for(var j=0;j<el.guess.length;j++){
            t[el.row][el.col] = el.guess[j];
            tCols[el.col][el.row] = el.guess[j];
            if(solve()) return true;
            t[el.row][el.col] = 0;
            tCols[el.col][el.row] = 0;
        }
    }

    return false;
}
function getAvailableValues(arr, r,c){
    if(arr[r][c]) return [];

    var val = new Set();
    for(var i=0;i<9;i++){
        if(i!=r && arr[i][c]!=0) val.add(arr[i][c]);
        if(i!=c && arr[r][i]!=0) val.add(arr[r][i]);
        var ci = i % 3; var ri= (i-ci)/3;
        var cci = ci+Math.trunc(c/3)*3;
        var rri = ri+Math.trunc(r/3)*3;
        if(cci != c && rri != r && arr[rri][cci] != 0) val.add(arr[rri][cci]);
    }

    return [1,2,3,4,5,6,7,8,9].filter(el=>!val.has(el));
}
function check(rows,cols){
    return checkLines(rows) && checkLines(cols) && checkRects(rows);
    function checkLines(arr){
        return arr.every(r=>r.slice().sort((a,b)=>a-b).join('')=='123456789');
    }
    function checkRects(arr){
        for(var k=0;k<9;k++){
            var rect = [];
            for(var i=0;i<3;i++)
            for(var j=0;j<3;j++){
                rect.push(arr[i+Math.trunc(k/3)][j+k%3]);
            }
            if(!rect.sort((a,b)=>a-b).join('')=='123456789') return false;
        }
        return true;
    }
}


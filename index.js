let express = require('express');
let fs = require('fs');
let xlsx = require('node-xlsx');
let cors = require('cors');
let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


 //冒泡排序
function sortFc (arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j][1] > arr[j + 1][1]) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
 
    }
}
app.post('/getData',function(req,res){
    let {Aitem,Bitem,message} = req.body;
    if(message==='基本配合'){
        sortFc(Aitem);
        sortFc(Bitem);
        console.log(Aitem,Bitem,message);
        let ToleranceArray = [];
        for(let i = 0;i<20;i++){
            ToleranceArray.push([(Aitem[i][0]+''+Bitem[i][0]),Math.abs(Aitem[i][1]-Bitem[i][1]).toFixed(3)]);
        }
        sortFc(ToleranceArray);
        res.send({status:200,msg:'请求成功',elitem:{Aitem,Bitem},ToleranceArray});
    }else if(message==='差最小的十组配合'){
        sortFc(Aitem);
        sortFc(Bitem);
        let ToleranceArray = [];
        for(let i = 0;i<20;i++){
            ToleranceArray.push([(Aitem[i][0]+''+Bitem[i][0]),Math.abs(Aitem[i][1]-Bitem[i][1]).toFixed(3)]);
        }
        sortFc(ToleranceArray);//差完再次冒泡排序
        ToleranceArray=ToleranceArray.slice(0,10);
        res.send({status:200,msg:'请求成功',ToleranceArray});
    }else{
        res.send({status:200,msg:'暂无此配套方案'})
    }
})


//写入excel
app.post('/writeExcel',function(req,res){
    console.log(req.body.ToleranceArray);
    let ToleranceArray = req.body.ToleranceArray;
    let ToleranceMax = ToleranceArray[ToleranceArray.length-1][1];
    let ToleranceMin = ToleranceArray[0][1];
    let ToleranceAver = 0;
    let ToleranceArrayData = [];
    let obj = {
        name:'sheet1',
        data:[
            [
                '配合',
                '公差'
            ]
        ]
    }
    for(let i = 0;i<ToleranceArray.length;i++){
       obj.data.push(ToleranceArray[i]);
       ToleranceAver+=parseFloat(ToleranceArray[i][1]);
    }
    //平均数
    ToleranceAver = (ToleranceAver/ToleranceArray.length).toFixed(3);
    console.log(ToleranceAver);
    obj.data.push(['最大差值','最小差值','平均差值']);
    obj.data.push([ToleranceMax,ToleranceMin,ToleranceAver]);
    ToleranceArrayData.push(obj);
    let buffer = xlsx.build(ToleranceArrayData);
    fs.writeFileSync('C://Users//lenovo//Desktop//优选优配.xls',buffer);
res.send({status:200,msg:'写入成功'});
})









app.listen(8082, () => {
    console.log("服务器成功开启,端口号是8082");
  });
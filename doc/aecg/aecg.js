var AECG = {

    temp: {
        //总高度
        mainHeight: 0,

        mainWidth: 0,

        //画布宽度
        drawWidth:0,

        mainStartX: 0,


        //多少导
        stepNumber: 12,

        //每导高度
        stepHeight: 0,

        context: null,

        backCanvas:null,

        dataSecond: 20,

        //竖向小格数量
        boxNumber: 4,
        //横向小格数量
        boxSize:5,
        //竖向相小格高度
        boxHeight: 0,


        //展示数据
        dataShow: [],

        dataLength:0,


        timerInterval:null,
        timerLeft:0,
       

        //当前画的秒数
        currentSecond: 0


    },



    display: function (sXmlFile) {

       
        
        //AECG.init();

         //AECG.simpleLine();

        AECG.loadXml(sXmlFile);





    },


    loadXml: function (sXmlFile) {





        $.get(sXmlFile, function (data) {

            $(data).find('sequenceSet').find('component').each(function (index, ele) {

                var titles = $(ele).find('sequence').find('code');

                var sCode = titles.attr('code');
                if (sCode !== "TIME_ABSOLUTE") {


                    var sDigits = $(ele).find('value').find('digits').text();
                    var aArray = sDigits.split(' ');



                    var aShow = [];
                    var iSumStep = 0;
                    for (var i = 0, j = aArray.length; i < j; i++) {

                        //这里由于数据的单位为0.001s 展示数据为0.04s步进 因此重新格式化数据
                        if (i % 40 === 39) {

                            aShow.push(Math.ceil(iSumStep / 40));

                            iSumStep = 0;
                        } else {
                            iSumStep += parseInt(aArray[i]);
                        }

                    }
                    //console.log(aShow.length)

                    AECG.temp.dataLength=aShow.length;
                    AECG.temp.dataShow.push(aShow);


                }

            });

            AECG.init();
            //开始画数据
            AECG.dataDraw();

            AECG.timer();

        });
    },

    dataDraw: function () {

        for (var i = 0, j = AECG.temp.dataShow.length; i < j; i++) {

            var aShow = AECG.temp.dataShow[i];
            var iNowStart = AECG.temp.currentSecond * 25;

            for (var n = iNowStart + 1, m = iNowStart + 500; n < m; n++) {
                var iStartX = AECG.temp.mainStartX + (n - 1) * AECG.temp.boxHeight / 5;
                var iStartY = (aShow[n - 1] / 500 + 2) * AECG.temp.boxHeight + i * AECG.temp.boxNumber *
                    AECG.temp.boxHeight;

                var iEndX = AECG.temp.mainStartX + (n) * AECG.temp.boxHeight / 5;
                var iEndY = (aShow[n] / 500 + 2) * AECG.temp.boxHeight + i * AECG.temp.boxNumber * AECG.temp
                    .boxHeight;
                AECG.drawLine({
                    startX: iStartX,
                    startY: iStartY,
                    endX: iEndX,
                    endY: iEndY,
                    lineColor: '#22b228',
                    lineWidth: 2
                });

            }



        }


    },

    timer:function(){

        //setInterval();
        

        AECG.temp.timerInterval=  setInterval(AECG.changeLeft,50);

        

    },

    changeLeft:function(){
        //$("#show").animate({marginLeft:"-300px"},{speed:2000});

        AECG.temp.timerLeft=AECG.temp.timerLeft-AECG.temp.stepHeight/AECG.temp.boxNumber/4;

       if(AECG.temp.timerLeft<=0-(AECG.temp.drawWidth-AECG.temp.mainWidth)){
        clearInterval(AECG.temp.timerInterval);
       }
       else{
        
        document.getElementById('show').style.marginLeft=AECG.temp.timerLeft;
       }


        

    },


    logText:function(sText){
        $('#text').text(sText);
    },


    init: function () {


        var main=document.getElementById('main');

        AECG.temp.mainHeight = main.clientHeight;

        AECG.temp.mainWidth = main.clientWidth;
        
        AECG.temp.stepHeight = AECG.temp.mainHeight / AECG.temp.stepNumber;

        var canvas = document.getElementById("canvas_front");

        var canvasBack=document.getElementById("canvas_back");

        canvasBack.width=AECG.temp.mainWidth;
        canvasBack.height=AECG.temp.mainHeight;

        AECG.temp.backCanvas = canvasBack.getContext("2d");

        var show=document.getElementById('show');


        AECG.temp.drawWidth=AECG.temp.dataLength*AECG.temp.stepHeight/AECG.temp.boxNumber/AECG.temp.boxSize;

        show.style.width=AECG.temp.drawWidth+'px';
        show.style.height=AECG.temp.mainHeight;

        show.style.marginLeft=AECG.temp.mainWidth;
        AECG.temp.timerLeft=AECG.temp.mainWidth;


        canvas.width = AECG.temp.drawWidth;
        canvas.height = AECG.temp.mainHeight;
        

        

        //画横线
        AECG.temp.boxHeight = AECG.temp.stepHeight / AECG.temp.boxNumber;



        AECG.temp.context = canvas.getContext("2d");



       // AECG.temp.mainStartX = AECG.temp.mainWidth % (AECG.temp.stepHeight*1.25);


        //画横线
        {
            var iStartCell = AECG.temp.boxHeight;
            var iEveryStep = 1;
            while (iStartCell < AECG.temp.mainHeight) {
                var bFlagBig = iEveryStep % AECG.temp.boxNumber === 0;
                AECG.drawBack({
                    startX: bFlagBig ? 0 : AECG.temp.mainStartX,
                    startY: iStartCell,
                    endX: AECG.temp.mainWidth,
                    endY: iStartCell,
                    lineColor: bFlagBig ? '#454545' : '#363636',
                    lineWidth: bFlagBig ? 0.4 : 0.3
                });

                iEveryStep++;
                iStartCell = iStartCell + AECG.temp.boxHeight;


            }

        }


        //画竖线
        {
            var iStartCell = AECG.temp.mainStartX;
            var iEveryStep = 0;
            while (iStartCell < AECG.temp.drawWidth) {


                var bFlagBig = iEveryStep % AECG.temp.boxSize === 0;

                AECG.drawBack({
                    startX: iStartCell,
                    startY: 0,
                    endX: iStartCell,
                    endY: AECG.temp.mainHeight,
                    lineColor: bFlagBig ? '#454545' : '#363636',
                    lineWidth: bFlagBig ? 0.4 : 0.3
                });

                iEveryStep++;
                iStartCell = iStartCell + AECG.temp.boxHeight;

            }
        }

    },
    drawBack: function (oSet) {

        /*
        var oDefault = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            lineColor: 'green',
            lineWidth: 1
        }

        //oSet = Object.assign(oDefault, oSet);
        */
        
        AECG.temp.backCanvas.beginPath();
        AECG.temp.backCanvas.moveTo(oSet.startX, oSet.startY);
        AECG.temp.backCanvas.lineTo(oSet.endX, oSet.endY);
        AECG.temp.backCanvas.lineWidth = oSet.lineWidth;
        AECG.temp.backCanvas.closePath();
        AECG.temp.backCanvas.strokeStyle = oSet.lineColor;
        AECG.temp.backCanvas.stroke();
        
        
        

    },

    drawLine: function (oSet) {

        /*
        var oDefault = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            lineColor: 'green',
            lineWidth: 1
        }

        //oSet = Object.assign(oDefault, oSet);
        */
        
        AECG.temp.context.beginPath();
        AECG.temp.context.moveTo(oSet.startX, oSet.startY);
        AECG.temp.context.lineTo(oSet.endX, oSet.endY);
        AECG.temp.context.lineWidth = oSet.lineWidth;
        AECG.temp.context.closePath();
        AECG.temp.context.strokeStyle = oSet.lineColor;
        AECG.temp.context.stroke();
        
        
        

    }




};



AECG.display('demo.xml');

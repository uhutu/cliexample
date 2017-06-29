var AECG = {

    temp: {
        //盒子高度
        mainHeight: 0,

        mainWidth: 0,

        mainStartX: 0,


        //多少导
        stepNumber: 12,
        stepHeight: 0,

        context: null,

        dataSecond: 20,

        //横小格数量
        boxNumber: 4,
        //横小格高度
        boxHeight: 0,


        //展示数据
        dataShow: [],



        //当前画的秒数
        currentSecond: 0


    },



    display: function (sXmlFile) {

        AECG.simpleLine();
        this.init();

        this.loadXml(sXmlFile);


    },


    loadXml: function (sXmlFile) {





        $.get(sXmlFile, function (data) {

            $(data).find('sequenceSet').find('component').each(function (index, ele) {

                var titles = $(ele).find('sequence').find('code');

                let sCode = titles.attr('code');
                if (sCode !== "TIME_ABSOLUTE") {


                    let sDigits = $(ele).find('value').find('digits').text();
                    let aArray = sDigits.split(' ');



                    let aShow = [];
                    let iSumStep = 0;
                    for (var i = 0, j = aArray.length; i < j; i++) {

                        //这里由于数据的单位为0.001s 展示数据为0.04s步进 因此重新格式化数据
                        if (i % 40 === 39) {

                            aShow.push(Math.ceil(iSumStep / 40));

                            iSumStep = 0;
                        } else {
                            iSumStep += parseInt(aArray[i]);
                        }

                    }
                    console.log(aShow.length)
                    AECG.temp.dataShow.push(aShow);


                }

            });

            //开始画数据
            AECG.dataDraw();

        });
    },

    dataDraw: function () {

        for (var i = 0, j = this.temp.dataShow.length; i < j; i++) {

            let aShow = this.temp.dataShow[i];
            let iNowStart = this.temp.currentSecond * 25;

            for (var n = iNowStart + 1, m = iNowStart + 500; n < m; n++) {
                let iStartX = this.temp.mainStartX + (n - 1) * this.temp.boxHeight / 5;
                let iStartY = (aShow[n - 1] / 500 + 2) * this.temp.boxHeight + i * this.temp.boxNumber *
                    this.temp.boxHeight;

                let iEndX = this.temp.mainStartX + (n) * this.temp.boxHeight / 5;
                let iEndY = (aShow[n] / 500 + 2) * this.temp.boxHeight + i * this.temp.boxNumber * this.temp
                    .boxHeight;
                this.drawLine({
                    startX: iStartX,
                    startY: iStartY,
                    endX: iEndX,
                    endY: iEndY,
                    lineColor: 'green',
                    lineWidth: 1
                });

            }



        }


    },


    simpleLine: function () {

        var c = document.getElementById("canvas");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(400, 400);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ff0000";
        ctx.stroke();

    },



    init: function () {
        var canvas = document.getElementById("canvas");
        this.temp.mainHeight = canvas.clientHeight;

        this.temp.mainWidth = canvas.clientWidth;


        canvas.width = this.temp.mainWidth;
        canvas.height = this.temp.mainHeight;

        this.temp.stepHeight = this.temp.mainHeight / this.temp.stepNumber;

        //画横线
        this.temp.boxHeight = this.temp.stepHeight / this.temp.boxNumber;



        this.temp.context = canvas.getContext("2d");



        this.temp.mainStartX = this.temp.mainWidth % this.temp.stepHeight + 1 * this.temp.stepHeight;



        //画横线
        {
            let iStartCell = this.temp.boxHeight;
            let iEveryStep = 1;
            while (iStartCell < this.temp.mainHeight) {
                let bFlagBig = iEveryStep % this.temp.boxNumber === 0;
                this.drawLine({
                    startX: bFlagBig ? 0 : this.temp.mainStartX,
                    startY: iStartCell,
                    endX: this.temp.mainWidth,
                    endY: iStartCell,
                    lineColor: bFlagBig ? '#454545' : '#363636',
                    lineWidth: bFlagBig ? 0.4 : 0.3
                });

                iEveryStep++;
                iStartCell = iStartCell + this.temp.boxHeight;


            }

        }


        //画竖线
        {
            let iStartCell = this.temp.mainStartX;
            let iEveryStep = 0;
            while (iStartCell < this.temp.mainWidth) {


                let bFlagBig = iEveryStep % this.temp.boxNumber === 0;

                this.drawLine({
                    startX: iStartCell,
                    startY: 0,
                    endX: iStartCell,
                    endY: this.temp.mainHeight,
                    lineColor: bFlagBig ? '#454545' : '#363636',
                    lineWidth: bFlagBig ? 0.4 : 0.3
                });

                iEveryStep++;
                iStartCell = iStartCell + this.temp.boxHeight;

            }
        }

    },

    drawLine: function (oSet) {

        let oDefault = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            lineColor: 'green',
            lineWidth: 1
        }

        oSet = Object.assign(oDefault, oSet);

        this.temp.context.beginPath();
        this.temp.context.moveTo(oSet.startX, oSet.startY);
        this.temp.context.lineTo(oSet.endX, oSet.endY);
        this.temp.context.lineWidth = oSet.lineWidth;
        this.temp.context.closePath();
        this.temp.context.strokeStyle = oSet.lineColor;
        this.temp.context.stroke();

    }




};



AECG.display('http://mediciner.oss-cn-beijing.aliyuncs.com/demos/aecg/demo.xml');

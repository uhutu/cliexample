import React, { Component } from "react"
import {
    FlatList,
    View,
    ScrollView,
    Image
} from 'react-native';
import Svg, {
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Use,
    Defs,
    Stop
} from 'react-native-svg';





const configDemo = {
    //每秒宽度
    width: 50,
    //步进值
    step: 2,
    //图高度
    height: 50
}




export default class SvgExample extends Component {
    constructor(props) {
        super(props);

        let aData = [];

        for (var i = 0; i < 100; i++) {

            aData.push({ key: i, index: i, pathAll: this.randomAll() });
        }

        this.state = {
            data: aData
        }

    }


    randomAll() {
        let aReturn = [];
        for (var i = 0; i < 12; i++) {
            aReturn.push(this.randomPath(i));
        }
        return aReturn;

    }



    tempLast = []


    randomPath(iIndex) {

        let aX = [], aY = [];

        for (var i = 0; i <= parseInt(configDemo.width / configDemo.step); i++) {
            aX.push(i * configDemo.step);

            let iY = parseInt(Math.random() * configDemo.height);

            let iHalf = parseInt(configDemo.height / 2);
            if ((iY > configDemo.height * 0.1 && iY < configDemo.height * 0.9) || iY < configDemo.height * 0.05||iY>configDemo.height*0.95) {
                iY = iHalf + (Math.random() * 3 - 2);
            }


            aY.push(iY + iIndex * configDemo.height);


        }

        if (this.tempLast[iIndex] === undefined) {
            this.tempLast[iIndex] = { x: -1, y: -1 };
        }


        if (this.tempLast[iIndex].y !== -1) {
            //aX[0] = this.tempLast[iIndex].x;
            aY[0] = this.tempLast[iIndex].y;
        }

        //this.tempLast[iIndex].x = aX[aX.length - 1];
        this.tempLast[iIndex].y = aY[aY.length - 1];


        let aReturn = [];

        for (var i = 0, j = aX.length; i < j; i++) {

            aReturn.push((i === 0 ? 'M' : "L") + aX[i] + ' ' + aY[i]);
        }

        return aReturn.join('');



    }






    _renderItem({ item }) {

        let aItem = [];
        for (var i =0, j = configDemo.width / configDemo.step / 5; i < j; i++) {
            aItem.push(
                <Line
                    key={'row' + i}
                    stroke={i % 5 === 0 ? '#e98885' : '#ffcccc'}
                    strokeWidth={i % 5 === 0 ? 1 : 0.5}
                    x1={i * configDemo.step * 5}
                    y1="0"
                    x2={i * configDemo.step * 5}
                    y2={item.pathAll.length * configDemo.height}
                />
            )
        }

        for (var i = 0, j = configDemo.height * item.pathAll.length / configDemo.step / 5; i < j; i = i + 1) {
            aItem.push(
                <Line
                    key={'cell' + i}
                    stroke={i % 5 === 0 ? '#e98885' : '#ffcccc'}
                     strokeWidth={i % 5 === 0 ? 0.8 : 0.5}
                    x1="0"
                    y1={i * configDemo.step * 5}
                    x2={configDemo.width}
                    y2={i * configDemo.step * 5}
                />
            )
        }


        item.pathAll.forEach((fItem) => {
            aItem.push(<Path
                key={fItem}
                d={fItem}
                fill="none"
                stroke="black"
            />)
        });





        return (
            <Svg style={{ width: configDemo.width, height: configDemo.height * 12, backgroundColor: '#f8eeee' }}>

                {aItem}



            </Svg>);
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, marginTop: 50 }}>
            <FlatList style={{ flex: 1 }}
                data={this.state.data}
                getItemLayout={(data, index) =>{return {length: 50, offset: 50 * index, index}}}
                horizontal={true}

                renderItem={this._renderItem}
            />
            </ScrollView>

        );
    }
}
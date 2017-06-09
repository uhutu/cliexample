import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    FlatList,
    View,
} from 'react-native';

import * as Progress from 'react-native-progress';

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#fff',
        paddingVertical: 20,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    circles: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2784cf'
    },
    progress: {

        margin: 10
    },
});

export default class Example extends Component {
    constructor(props) {
        super(props);

        this.state = {
            progress: 0,
            data: ['aaa'],
            indeterminate: true,
        };
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        let progress = 0;
        let aData = this.state.data;
        this.setState({ progress });
        setTimeout(() => {
            this.setState({ indeterminate: false });
            setInterval(() => {
                progress += Math.random() / 5;
                if (progress > 1) {
                    progress = 1;


                } else {

                    aData.splice(0, 0, 'xxxx'+progress);

                }
                this.setState({ progress: progress, data: aData });

            }, 500);
        }, 1500);
    }

    render() {
        return (
            <View style={styles.container}>
<Progress.Pie
            style={styles.progress}
            progress={this.state.progress}
            indeterminate={this.state.indeterminate}
          />
                <View style={styles.circles}>
                    <Progress.Circle
                        style={styles.progress}
                        progress={this.state.progress}
                        showsText={true}
                        formatText={() => { return Math.ceil(this.state.progress * 100) + '%' }}
                        color="#ffffff"
                        borderColor="#fefefe"

                        size={200}
                        indeterminate={this.state.indeterminate}
                    />

                </View>
                <View style={styles.circles}>
                    <Progress.CircleSnail
                        style={styles.progress}
                    />
                    <Progress.CircleSnail
                        style={styles.progress}
                        color={[
                            '#F44336',
                            '#2196F3',
                            '#009688',
                        ]}
                    />
                </View>

                <View style={{ height:50 }}>
                <FlatList 
                    data={this.state.data}
                    getItemLayout={(data, index) => { return { length: 50, offset: 50 * index, index } }}


                    renderItem={this._renderItem}
                />
                </View>
            </View>

        );
    }

    _renderItem({ item }) {
        return (<View><Text>{item}</Text></View>)
    }
}
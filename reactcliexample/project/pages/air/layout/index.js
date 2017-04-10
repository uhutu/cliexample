import React, { Component } from "react";
import { PlusItem,PlusFunc } from 'uhutu-plus';
import {
    TextInput,
    View,
    DatePickerIOS,
    TouchableOpacity,
    Picker,
    Image,
    Text

} from 'react-native';
/**
 * Hello
 */
export default class extends Component {


  constructor(props)
  {
    super(props);
    //PlusFunc.Request().post('aaa');
    //console.warn(JSON.stringify(PlusFunc));
    PlusFunc.Request.post('aaaa');
  }

    render() {
        return (<View>
        <PlusItem.Text></PlusItem.Text>
        <Text>aaa</Text>

      </View>);
    }
}

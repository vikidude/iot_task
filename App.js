/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  processColor,
} from 'react-native';
// import {
//   LineChart,
//   BarChart
// } from "react-native-chart-kit";
import axios from 'react-native-axios';
import {BarChart} from 'react-native-charts-wrapper';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      month: ["January", "February", "March", "April", "May", "June"],
      yAxis1: [
        4, 20, 5, 18, 30, 45
      ],
      yAxis2: [
        7,
        18,
        9,
        5,
        3,
        25
      ],
      dateArray: [],
      yAxisArray1: [],
      yAxisArray2: [],
      yAxisArray3: [],
      dateReceived: false,
      channel: '',
      line: true,
      apiMsg:'',
      legend: {
        enabled: true,
        textSize: 14,
        form: "SQUARE",
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        wordWrapEnabled: true
      },
      data: {
        dataSets: [{
          values: [5, 40, 77, 81, 43],
          label: 'Pressure',
          config: {
            drawValues: false,
            colors: [processColor('red')],
          }
        }, {
          values: [40, 5, 50, 23, 79],
          label: 'Temperature',
          config: {
            drawValues: false,
            colors: [processColor('green')],
          }
        }, {
          values: [10, 55, 35, 90, 82],
          label: 'Energy',
          config: {
            drawValues: false,
            colors: [processColor('blue')],
          }
        }],
        config: {
          barWidth: 0.2,
          group: {
            fromX: 0,
            groupSpace: 0.1,
            barSpace: 0.1,
          },
        }
      },
      xAxis: {
        valueFormatter: ['07/04/20 04:30', '07/04/20 04:50', '07/04/20 05:10', '07/04/20 05:30', '07/04/20 05:50'],
        granularityEnabled: true,
        granularity: 1,
        axisMaximum: 5,
        axisMinimum: 0,
        centerAxisLabels: true
      },

      marker: {
        enabled: true,
        markerColor: processColor('#F0C0FF8C'),
        textColor: processColor('black'),
        markerFontSize: 14,
      },
    }
  }

  componentDidMount() {
    setTimeout(() => {
      //console.log('hi from counter')
      if(this.state.dateArray.length === 0){
        if(this.state.dateReceived){
        this.setState({apiMsg:'No data available'});
        }else{
          this.setState({dateReceived:true,apiMsg:'Server error'})
        }
      }
      
    }, 3000);
    // console.log('Before timer finishes');
    // this.setTimeout(() => {
    //   console.log('This is timer function call after 1s');
    // }, 1000);
    this.getData();
  }

  getData() {
    var self = this;
    axios.get('https://api.thingspeak.com/channels/1023166/feeds.json?api_key=A3EHCB68NAMPXWFD&results=')
      .then(function (response) {
        var data = response.data.feeds;
        console.log(data);
        self.setState({ channel: response.data.channel });
        self.state.xAxis.valueFormatter = [];
        self.state.data.dataSets[0].values = [];
        self.state.data.dataSets[1].values = [];
        self.state.data.dataSets[2].values = [];
        for (let t = 0; t < 6; t++) {
          var d = (data[t].created_at).split("T")[1];
          self.state.xAxis.valueFormatter.push(d.replace('Z', ''));
          self.state.data.dataSets[0].values.push(data[t].field1);
          self.state.data.dataSets[1].values.push(data[t].field2);
          self.state.data.dataSets[2].values.push(data[t].field3);
        }
        self.setState({ dateReceived: true });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // chartOption(type) {
  //   switch (type) {
  //     case 'line': {
  //       this.setState({ line: true, bar: false, pie: false });
  //       break;
  //     }
  //     case 'bar': {
  //       this.setState({ line: false, bar: true, pie: false });
  //       break;
  //     }
  //     case 'pie': {
  //       this.setState({ line: false, bar: false, pie: true });
  //       break;
  //     }
  //     default: {
  //       this.setState({ line: true, bar: false, pie: false });
  //     }
  //   }
  // }


  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null})
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    }

    console.log(event.nativeEvent)
  }
  render() {

    return (
      <View style={{flex: 1}}>
             {this.state.dateReceived ? (
<ImageBackground source={require('./assets/images/bg.jpg')} style={{ width: "100%", height: "100%", }}>
        <View style={{height:80}}>
        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: '3%' }}>IOT Device Dashboard</Text>
        </View>

        <View style={{ backgroundColor: 'lightgrey', paddingHorizontal: '10%', paddingVertical: '5%', marginVertical: '5%', marginHorizontal: '3%' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text>Name        :</Text>
                  <Text>{'  '}{this.state.channel.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: '2%' }}>
                  <Text>Id               :</Text>
                  <Text>{'  '}{this.state.channel.id}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: '1%' }}>
                  <Text>Latittude   :</Text>
                  <Text>{'  '}{this.state.channel.latitude}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: '1%' }}>
                  <Text>Longitude :</Text>
                  <Text>{'  '}{this.state.channel.longitude}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: '1%' }}>
                  <Text>Field1       :</Text>
                  <Text>{'  '}Pressure</Text>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: '1%' }}>
                  <Text>Field1       :</Text>
                  <Text>{'  '}Temperature</Text>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: '1%' }}>
                  <Text>Field1       :</Text>
                  <Text>{'  '}Energy</Text>
                </View>
              </View>

        <View style={styles.container}>
          <BarChart
            style={styles.chart}
            xAxis={this.state.xAxis}
            data={this.state.data}
            legend={this.state.legend}
            drawValueAboveBar={false}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
            highlights={this.state.highlights}
            marker={this.state.marker}
          />
        </View>
        </ImageBackground>
             ):(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {this.state.apiMsg === '' ? (
                <ActivityIndicator color="greenyellow" size="large" />
              ) : (
                  <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>
                    {this.state.apiMsg}
                  </Text>
                )}
            </View>
             )}
        </View>
  
      // <View style={{ flex: 1 }}>
      //   <ImageBackground source={require('./assets/images/bg.jpg')} style={{ width: "100%", height: "100%", }}>
      //     <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: '3%' }}>IOT Device Dashboard</Text>
      //     {this.state.dateReceived ? (
      //       <View>
      //         <View style={{ backgroundColor: 'lightgrey', paddingHorizontal: '10%', paddingVertical: '5%', marginVertical: '5%', marginHorizontal: '3%' }}>
      //           <View style={{ flexDirection: 'row' }}>
      //             <Text>Name        :</Text>
      //             <Text>{'  '}{this.state.channel.name}</Text>
      //           </View>
      //           <View style={{ flexDirection: 'row', marginVertical: '2%' }}>
      //             <Text>Id               :</Text>
      //             <Text>{'  '}{this.state.channel.id}</Text>
      //           </View>
      //           <View style={{ flexDirection: 'row', marginVertical: '1%' }}>
      //             <Text>Latittude   :</Text>
      //             <Text>{'  '}{this.state.channel.latitude}</Text>
      //           </View>
      //           <View style={{ flexDirection: 'row', marginVertical: '1%' }}>
      //             <Text>Longitude :</Text>
      //             <Text>{'  '}{this.state.channel.longitude}</Text>
      //           </View>
      //           <View style={{ flexDirection: 'row', marginVertical: '1%' }}>
      //             <Text>Field1       :</Text>
      //             <Text>{'  '}Pressure</Text>
      //           </View>
      //           <View style={{ flexDirection: 'row', marginVertical: '1%' }}>
      //             <Text>Field1       :</Text>
      //             <Text>{'  '}Temperature</Text>
      //           </View>
      //           <View style={{ flexDirection: 'row', marginVertical: '1%' }}>
      //             <Text>Field1       :</Text>
      //             <Text>{'  '}Energy</Text>
      //           </View>
      //         </View>

      //         {this.state.dateArray.length>0?(
      //           <LineChartComponent dateArray={this.state.dateArray} yAxisArray1={this.state.yAxisArray1}
      //             yAxisArray2={this.state.yAxisArray2} yAxisArray3={this.state.yAxisArray3}
      //             dataPointClick= {(value,datasets)=>alert(value.value)} />
      //             ):(
      //               <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //                 <Text style={{fontSize:18,color:'white',fontWeight:'bold'}}>
      //                   {this.state.apiMsg}
      //                 </Text>
      //             </View>
      //             )}
      //       </View>
      //     ) : (
      //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //           {this.state.apiMsg === ''?(
      //           <ActivityIndicator color="greenyellow" size="large" />
      //           ):(
      //             <Text style={{fontSize:18,color:'white',fontWeight:'bold'}}>
      //             {this.state.apiMsg}
      //           </Text>
      //           )}
      //         </View>
      //       )}
      //   </ImageBackground>
      // </View>
    );
  }
}

const LineChartComponent = (props) => {
  return (
    <LineChart
      onDataPointClick = {(value,datasets)=>props.dataPointClick(value,datasets)}
      data={{
        labels: props.dateArray,
        datasets: [
          {
            data: props.yAxisArray1
          },
          {
            data: props.yAxisArray2
          },
          {
            data: props.yAxisArray3
          }
        ]
      }}

      width={Dimensions.get("window").width} // from react-native
      height={300}
      yAxisLab el=""
      yAxisSuffix=""
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#ffa726"
        }
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  }
});
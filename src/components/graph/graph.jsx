import React from 'react';
import axios from 'axios';
import {url} from '../../backend';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'
import './graph.css'
// import Utils from 'https://www.chartjs.org/samples/2.9.4/utils.js'

const Graph = ({arr}) => {
  const down = (ctx, value) =>{
    console.log(ctx)
    const ind = ctx.p0DataIndex
    // console.log('abc', arr[ind].original_value.$numberDecimal>=arr[ind].min_band.$numberDecimal && arr[ind].original_value.$numberDecimal<=arr[ind].max_band.$numberDecimal, arr[ind].original_value.$numberDecimal, arr[ind].min_band.$numberDecimal , arr[ind].original_value.$numberDecimal, arr[ind].max_band.$numberDecimal)
    if((Number(arr[ind].original_value.$numberDecimal)>=Number(arr[ind].min_band.$numberDecimal) && Number(arr[ind].original_value.$numberDecimal)<=Number(arr[ind].max_band.$numberDecimal)) && (Number(arr[ind+1].original_value.$numberDecimal)>=Number(arr[ind+1].min_band.$numberDecimal) && Number(arr[ind+1].original_value.$numberDecimal)<=Number(arr[ind+1].max_band.$numberDecimal))) return value;
    else return '#d94810'
  };
  arr = arr.slice(0,600)
  const labels = arr.map((object)=>{
    var ts = object.timestamp
    ts = ts.split(/[, : \- T ]/)
    // console.log(ts)
    return ts[2]+'/'+ts[1]+'/'+ts[0]+', '+ts[3]+':'+ts[4]
  });
  // console.log(arr[0].original_value.$numberDecimal)
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Original Value',
      fill: false,
      backgroundColor: '#6174d0',
      borderColor: '#6174d0',
      data: arr.map((object)=>{
        return object.original_value.$numberDecimal
      }),
      segment: {
        borderColor: ctx => down(ctx, '#6174d0') || '#6174d0'
      },
    }, 
    // {
    //   label: 'Forcasted Value',
    //   fill: false,
    //   backgroundColor: 'green',
    //   borderColor: 'green',
    //   borderDash: [5, 5],
    //   data: arr.map((object)=>{
    //     return object.forecast_value.$numberDecimal||0
    //   }),
    // }, 
    {
      label: 'Min Band',
      backgroundColor: 'white',
      borderColor: 'white',
      data: arr.map((object)=>{
        return object.min_band.$numberDecimal
      }),
      fill: true,
      tension: 0.1,
    },
    {
      label: 'Max Band',
      backgroundColor: '#e1e4e8',
      borderColor: '#e1e4e8',
      data: arr.map((object)=>{
        return object.max_band.$numberDecimal
      }),
      fill: true,
      tension:0.1,
    }
  ]
};

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      },
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value'
        }
      }
    }
  },
};
  return (
    <div className="container center">
      <Line data={data} />
    </div>
  );
};

export default Graph;

import React, { Component } from 'react';
import axios from 'axios';
import VideoContainer from '../VideoContainer';
import './G3Control.css';

class G3Control extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resistance: 4,
      currVoltage: 0,
      sliderVal: "0"
    };
    this.setResistance = this.setResistance.bind(this);
    this.setSliderVal = this.setSliderVal.bind(this);
    this.sendValues = this.sendValues.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('g3SensorData', data => {
      this.setState({ currVoltage: parseInt(data.iotData.voltage) });
    });
  }

  setResistance(event) {
    this.setState({ resistance: parseInt(event.target.value) });
  }

  setSliderVal(event) {
    this.setState({ sliderVal: `${event.target.value}` });
  }

  sendValues() {
    axios.post('/g3/data', {
      brightness: parseInt(this.state.sliderVal),
      resistance: this.state.resistance
    }).catch(err => {
      console.error(err);
    })
  }

  render() {
    return (
      <div className="g3-control">
        {window.location.protocol === 'https' ? <p className="proto-warn">NOTE: for video streams to work you must switch from https to http in your address bar</p> : <></>}
        <VideoContainer url="http://129.2.94.100:6092/stream" />
        <form className="g3-form">
          <label htmlFor="resistance" id="resistance-label">Choose a resistance:</label>
          <select id="resistance" name="resistance" onChange={this.setResistance}>
            <option value="4">3.9</option>
            <option value="5">4.9</option>
            <option value="8">7.6</option>
            <option value="9">8.8</option>
            <option value="10">9.8</option>
            <option value="11">10.8</option>
            <option value="15">14.8</option>
            <option value="16">16.3</option>
            <option value="20">20.4</option>
            <option value="23">23.3</option>
            <option value="36">36.2</option>
            <option value="47">47.1</option>
            <option value="144">143.7</option>
            <option value="4000">3893</option>
          </select>
          <div className="slide-container">
            <label htmlFor="brightness">Brightness: {this.state.sliderVal}</label>
            <input
              id="brightness-slider"
              type="range"
              min="0" max="255"
              name="brightness"
              onInput={this.setSliderVal}
              style={{
                width: '100%'
              }}
            />
          </div>
          <input
            type="button"
            value="set values"
            onClick={this.sendValues}
            style={{
              width: '100%'
            }}
          />
        </form>
        <div className="voltage-display">
          <p>Voltage: {this.state.currVoltage}mV</p>
        </div>
      </div>
    );
  }
}

export default G3Control;

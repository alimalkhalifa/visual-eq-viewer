import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import Slider from 'rc-slider'
import RaceCodes from '../constants/raceCodeConstants.json'

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const SliderwTooltip = createSliderWithTooltip(Slider)

function getRaceName(code) {
  for (let raceNum in RaceCodes) {
    let name = RaceCodes[raceNum].raceName
    if (RaceCodes[raceNum].male === code) {
      return `${name} (Male)`
    } else if (RaceCodes[raceNum].female === code) {
      return `${name} (Female)`
    } else if (RaceCodes[raceNum].neutral === code) {
      return `${name}`
    }
  }
  return "Unknown"
}

function getRaceID(code) {
  for (let raceNum in RaceCodes) {
    if (RaceCodes[raceNum].male === code || RaceCodes[raceNum].female === code || RaceCodes[raceNum].neutral === code) {
      return `${raceNum}`
    }
  }
  return `-1`
}

class VisualEQNPCInfoBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pickBy: 'by-clientID'
    }
  }

  changePickBy(id) {
    this.setState({
      pickBy: id
    })
  }

  render() {
    return (
      <div id="info-box" style={{
        minWidth: 200,
        width: '30%',
        height: '100%',
        overflow: 'auto',
        padding: 30
      }}>
        <h5 className="monospace mb-3">NPC</h5>
        <form>
          <div style={{textAlign: 'left'}}>
            <label>Select Race By:</label><br />
            <div class="form-check form-check-inline">
              <input type="radio" class="form-check-input" id="by-clientID" name="pickBy" value="by-clientID" checked={this.state.pickBy === "by-clientID"} onClick={() => this.changePickBy("by-clientID")} />
              <label class="form-check-label" for="by-clientID">Client ID</label>
            </div>

            <div class="form-check form-check-inline">
              <input type="radio" class="form-check-input" id="by-serverID" name="pickBy" value="by-serverID" checked={this.state.pickBy === "by-serverID"} onClick={() => this.changePickBy("by-serverID")} />
              <label class="form-check-label" for="by-serverID">Server ID</label>
            </div>

            <div class="form-check form-check-inline">
              <input type="radio" class="form-check-input" id="by-name" name="pickBy" value="by-name" checked={this.state.pickBy === "by-name"} onClick={() => this.changePickBy("by-name")} />
              <label class="form-check-label" for="by-name">Name</label>
            </div>
          </div> <br />

          { this.state.pickBy === "by-clientID" &&
            <select value={this.props.race} className="custom-select cusom-select-lg mb-3" onChange={this.props.changeRace}>
              <option value="select" disabled>Select race</option>
              {
                this.props.races.map(value => {
                  return <option key={value} value={value}>{`${value} | ${getRaceName(value)} | ${getRaceID(value)}`}</option>
                })
              }
            </select>
          }

          { this.state.pickBy === "by-serverID" &&
            <select value={this.props.race} className="custom-select cusom-select-lg mb-3" onChange={this.props.changeRace}>
              <option value="select" disabled>Select race</option>
              {
                this.props.races.map(value => {
                  return <option key={value} value={value}>{`${getRaceID(value)} | ${value} | ${getRaceName(value)}`}</option>
                })
              }
            </select>
          }

          { this.state.pickBy === "by-name" &&
            <select value={this.props.race} className="custom-select cusom-select-lg mb-3" onChange={this.props.changeRace}>
              <option value="select" disabled>Select race</option>
              {
                this.props.races.map(value => {
                  return <option key={value} value={value}>{`${getRaceName(value)} | ${value} | ${getRaceID(value)}`}</option>
                })
              }
            </select>
          }

          <div className="form-group">
            <label>Texture</label>
            <SliderwTooltip min={0} max={this.props.body > 0 ? this.props.modelSpecs.maxBodyTexture : this.props.modelSpecs.maxTexture} defaultValue={0} tipFormatter={value => `${value}`} value={this.props.texture} onChange={this.props.changeTexture} />
          </div>
          <div className="form-group">
            <label>Face</label>
            <SliderwTooltip min={0} max={this.props.modelSpecs.maxFace} defaultValue={0} tipFormatter={value => `${value}`} value={this.props.face} onChange={this.props.changeFace} />
          </div>
          <div className="form-group">
            <label>Helm</label>
            <SliderwTooltip min={0} max={this.props.modelSpecs.maxHelm} defaultValue={0} tipFormatter={value => `${value}`} value={this.props.helm} onChange={this.props.changeHelm} />
          </div>
          <div className="form-group">
            <label>Body</label>
            <SliderwTooltip min={0} max={this.props.modelSpecs.maxBody} defaultValue={0} tipFormatter={value => `${value}`} value={this.props.body} onChange={this.props.changeBody} />
          </div>
          <div className="form-group">
            <label>Camera Distance</label>
            <SliderwTooltip min={5} max={50} defaultValue={0} tipFormatter={value => `${value}`} value={this.props.distance} onChange={this.props.changeDistance} />
          </div>
          <div className="form-group">
            <label>Animation</label>
            <select value={this.props.anim} className="custom-select cusom-select-lg mb-3" onChange={this.props.changeAnim}>
              <option value="">No Animation</option>
              {
                this.props.animList.map(value => {
                  return <option key={value} value={value}>{value}</option>
                })
              }
            </select>
          </div>
        </form>
        <ButtonGroup aria-label="Export Buttons">
          <Button variant="primary" onClick={() => this.props.exportModel('gltf', 'basic')}>Export glTF (Basic)</Button>
          <Button variant="primary" onClick={() => this.props.exportModel('gltf', 'principled')}>Export glTF (Principled)</Button>
        </ButtonGroup>
      </div>
    )
  }
}

export default VisualEQNPCInfoBox
import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import RaceCodes from '../constants/raceCodeConstants.json'

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

class VisualEQNPCInfoBox extends React.Component {
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
          <select value={this.props.race} className="custom-select cusom-select-lg mb-3" onChange={this.props.changeRace}>
            <option value="select" disabled>Select race</option>
            {
              this.props.races.map(value => {
                return <option key={value} value={value}>{value}</option>
              })
            }
          </select>
          <select value={this.props.race} className="custom-select cusom-select-lg mb-3" onChange={this.props.changeRace}>
            <option value="select" disabled>Select race</option>
            {
              this.props.races.map(value => {
                return <option key={value} value={value}>{getRaceName(value)}</option>
              })
            }
          </select>
          <div className="form-group">
            <label>Texture</label>
            <input type="number" className="form-control" value={this.props.texture} onChange={this.props.changeTexture} />
            <small className="form-text text-muted">Maximum valid texture is {this.props.body > 0 ? this.props.modelSpecs.maxBodyTexture : this.props.modelSpecs.maxTexture}.</small>
          </div>
          <div className="form-group">
            <label>Face</label>
            <input type="number" className="form-control" value={this.props.face} onChange={this.props.changeFace} />
            <small className="form-text text-muted">Maximum valid face is {this.props.modelSpecs.maxFace}.</small>
          </div>
          <div className="form-group">
            <label>Helm</label>
            <input type="number" className="form-control" value={this.props.helm} onChange={this.props.changeHelm} />
            <small className="form-text text-muted">Maximum valid helm is {this.props.modelSpecs.maxHelm}.</small>
          </div>
          <div className="form-group">
            <label>Body</label>
            <input type="number" className="form-control" value={this.props.body} onChange={this.props.changeBody} />
            <small className="form-text text-muted">Maximum valid body is {this.props.modelSpecs.maxBody}.</small>
          </div>
          <div className="form-group">
            <label>Camera Distance</label>
            <input type="number" className="form-control" value={this.props.distance} onChange={this.props.changeDistance} />
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
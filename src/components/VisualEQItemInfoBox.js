import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const SliderwTooltip = createSliderWithTooltip(Slider)

class VisualEQItemInfoBox extends React.Component {
  render() {
    return (
      <div id="info-box" style={{
        minWidth: 200,
        width: '30%',
        height: '100%',
        overflow: 'auto',
        padding: 30
      }}>
        <h5 className="monospace mb-3">Item</h5>
        <form>
          <select value={this.props.item} className="custom-select cusom-select-lg mb-3" onChange={this.props.changeItem}>
            <option value="select" disabled>Select item</option>
            {
              this.props.items.map(value => {
                return <option key={value} value={value}>{value}</option>
              })
            }
          </select>
          <div className="form-group">
            <label>Camera Distance</label>
            <SliderwTooltip min={5} max={50} defaultValue={0} tipFormatter={value => `${value}`} value={this.props.distance} onChange={this.props.changeDistance} />
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

export default VisualEQItemInfoBox
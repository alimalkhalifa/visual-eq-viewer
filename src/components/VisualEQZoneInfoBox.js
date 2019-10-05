import React from 'react'

class VisualEQZoneInfoBox extends React.Component {
  render() {
    return (
      <div id="info-box" style={{
        minWidth: 200,
        width: '30%',
        height: '100%',
        overflow: 'auto',
        padding: 30
      }}>
        <h5 className="monospace mb-3">Zone</h5>
        <form>
          <select value={this.props.zone} className="custom-select cusom-select-lg mb-3" onChange={this.props.changeZone}>
            <option value="select" disabled>Select item</option>
            {
              this.props.zones.map(value => {
                return <option key={value} value={value}>{value}</option>
              })
            }
          </select>
        </form>
        <h6 className="monospace mb-3">Controls</h6>
        <p style={{textAlign: 'left'}}>
          * WASD to move laterally<br />
          * QE to move vertically<br />
          * Hold right click to move camera<br />
          * Hold shift to double speed
        </p>
      </div>
    )
  }
}

export default VisualEQZoneInfoBox
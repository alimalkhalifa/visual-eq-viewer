import React from 'react'

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
            <input type="number" className="form-control" value={this.props.distance} onChange={this.props.changeDistance} />
          </div>
        </form>
      </div>
    )
  }
}

export default VisualEQItemInfoBox
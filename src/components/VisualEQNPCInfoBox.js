import React from 'react'

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
        <h5 className="monospace mb-3">Visual EQ NpcViewer</h5>
        <form>
          <select value={this.props.race} className="custom-select cusom-select-lg mb-3" onChange={this.props.changeRace}>
            <option value="select" disabled>Select race</option>
            {
              this.props.races.map(value => {
                return <option key={value} value={value}>{value}</option>
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
        </form>
      </div>
    )
  }
}

export default VisualEQNPCInfoBox
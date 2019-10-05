import React from 'react'
import VisualEQZone from './VisualEQZone'
import VisualEQInfoBox from './VisualEQZoneInfoBox'

class VisualZoneViewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      zones: ['crushbone'],
      zone: 'crushbone',
    }
    this.changeZone = this.changeZone.bind(this)
    this.getZones = this.getZones.bind(this)
  }
  render() {
    return (
      <div id="container" style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%'
      }}>
        <VisualEQZone zone={this.state.zone} store={this.props.store} />
        <VisualEQInfoBox changeZone={this.changeZone}
          zones={this.state.zones}
          zone={this.state.zone}
        />
      </div>
    )
  }
  componentDidMount() {
    this.getZones()
  }
  changeZone(event) {
    this.setState({ 
      zone: event.target.value,
    })
  }
  getZones() {
    fetch(`${this.props.store}/zones.json`).then(res => res.json()).then(body => {
      this.setState({ zones: body.zones })
    }).catch(err => {
      throw new Error(err)
    })
  }
}

export default VisualZoneViewer
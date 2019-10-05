import React from 'react'
import VisualEQModelViewer from './VisualEQModelViewer'
import VisualEQInfoBox from './VisualEQItemInfoBox'

class VisualItemViewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: ['IT42'],
      item: 'IT42',
      modelSpecs: {},
      distance: 10
    }
    this.changeItem = this.changeItem.bind(this)
    this.changeDistance = this.changeDistance.bind(this)
    this.getModels = this.getModels.bind(this)
    this.getModelSpecs = this.getModelSpecs.bind(this)
  }
  render() {
    return (
      <div id="container" style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%'
      }}>
        <VisualEQModelViewer race={this.state.item} helm={0} texture={0} face={0} modelSpecs={0} distance={this.state.distance} store={this.props.store} imageSpecs={this.state.modelSpecs.imageSpecs} />
        <VisualEQInfoBox changeItem={this.changeItem}
          changeDistance={this.changeDistance}
          items={this.state.items}
          item={this.state.item}
          distance={this.state.distance}
          modelSpecs={this.state.modelSpecs}
        />
      </div>
    )
  }
  componentDidMount() {
    this.getModels()
    this.getModelSpecs(this.state.item)
  }
  changeItem(event) {
    this.setState({ 
      item: event.target.value,
    })
    this.getModelSpecs(event.target.value)
  }
  changeDistance(event) {
    let distance = parseInt(event.target.value)
    if (distance < 0) distance = 0
    this.setState({ distance })
  }
  getModelSpecs(item) {
    fetch(`${this.props.store}/${item}.json`).then(json => json.json()).then(modelSpecs => {
      this.setState({ modelSpecs })
    })
  }
  getModels() {
    fetch(`${this.props.store}/items.json`).then(res => res.json()).then(body => {
      this.setState({ items: body.items })
    }).catch(err => {
      throw new Error(err)
    })
  }
}

export default VisualItemViewer
import React from 'react'
import VisualEQModelViewer from './VisualEQModelViewer'
import VisualEQInfoBox from './VisualEQItemInfoBox'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
import { MeshStandardMaterial } from 'three';

var saveData = (function () {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (data, fileName) {
      var json = JSON.stringify(data),
          blob = new Blob([json], {type: "octet/stream"}),
          url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
  };
}());

class VisualItemViewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: ['IT42'],
      item: 'IT42',
      subject: null,
      modelSpecs: {},
      distance: 10
    }
    this.changeItem = this.changeItem.bind(this)
    this.changeDistance = this.changeDistance.bind(this)
    this.getModels = this.getModels.bind(this)
    this.getModelSpecs = this.getModelSpecs.bind(this)
    this.setSubject = this.setSubject.bind(this)
    this.exportModel = this.exportModel.bind(this)
  }
  render() {
    return (
      <div id="container" style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%'
      }}>
        <VisualEQModelViewer race={this.state.item} helm={0} texture={0} face={0} modelSpecs={0} distance={this.state.distance} store={this.props.store} imageSpecs={this.state.modelSpecs.imageSpecs}
          setSubject={this.setSubject}
        />
        <VisualEQInfoBox changeItem={this.changeItem}
          changeDistance={this.changeDistance}
          items={this.state.items}
          item={this.state.item}
          distance={this.state.distance}
          modelSpecs={this.state.modelSpecs}
          exportModel={this.exportModel}
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
  setSubject(subject) {
    this.setState({subject})
  }
  exportModel(type = "gltf", shader = "basic") {
    let model = this.state.subject.clone()
    model.rotation.set(0, 0, 0)
    if (type === "gltf") {
      this.exportGlTF(model, shader)
    }
    if (type === "obj") {
      this.exportOBJ(model)
    }
  }
  exportGlTF(model, shader) {
    if (shader === "principled") {
      model.traverse(child => {
        if (child.material) {
          child.material = new MeshStandardMaterial({
            map: child.material.map
          })
        }
      })
    }
    let exporter = new GLTFExporter()
    exporter.parse(model, gltf => {
      saveData(gltf, `${this.state.item}.gltf`)
    }, {
      embedImages: true,
      onlyVisible: true
    })
  }
}

export default VisualItemViewer
import React from 'react'
import VisualEQZone from './VisualEQZone'
import VisualEQInfoBox from './VisualEQZoneInfoBox'
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

class VisualZoneViewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      zones: ['crushbone'],
      zone: 'crushbone',
      subject: null
    }
    this.changeZone = this.changeZone.bind(this)
    this.getZones = this.getZones.bind(this)
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
        <VisualEQZone zone={this.state.zone}
          store={this.props.store}
          setSubject={this.setSubject}
        />
        <VisualEQInfoBox changeZone={this.changeZone}
          zones={this.state.zones}
          zone={this.state.zone}
          exportModel={this.exportModel}
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
  setSubject(subject) {
    this.setState({subject})
  }
  exportModel(type = "gltf", shader = "basic") {
    let model = this.state.subject.clone()
    for (let child of model.children) {
      child.rotateX(-Math.PI/2)
    }
    if (type === "gltf") {
      this.exportGlTF(model, shader)
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
      saveData(gltf, `${this.state.zone}.gltf`)
    }, {
      embedImages: true,
      onlyVisible: true
    })
  }
}

export default VisualZoneViewer
import React from 'react'
import VisualEQModelViewer from './VisualEQModelViewer'
import VisualEQInfoBox from './VisualEQNPCInfoBox'
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

class VisualNPCViewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      races: ['ORC'],
      race: 'ORC',
      subject: null,
      modelSpecs: {},
      anim: "",
      animList: [],
      texture: 0,
      helm: 0,
      face: 0,
      body: 0,
      distance: 10
    }
    this.getModels = this.getModels.bind(this)
    this.changeRace = this.changeRace.bind(this)
    this.changeTexture = this.changeTexture.bind(this)
    this.changeHelm = this.changeHelm.bind(this)
    this.changeFace = this.changeFace.bind(this)
    this.changeBody = this.changeBody.bind(this)
    this.changeDistance = this.changeDistance.bind(this)
    this.setSubject = this.setSubject.bind(this)
    this.exportModel = this.exportModel.bind(this)
    this.setAnimList = this.setAnimList.bind(this)
    this.changeAnim = this.changeAnim.bind(this)
  }
  render() {
    return (
      <div id="container" style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%'
      }}>
        <VisualEQModelViewer race={this.state.race} helm={this.state.helm} texture={this.state.texture}
          face={this.state.face} modelSpecs={this.state.modelSpecs} distance={this.state.distance}
          store={this.props.store} imageSpecs={this.state.modelSpecs.imageSpecs}
          setSubject={this.setSubject}
          setAnimList={this.setAnimList}
        />
        <VisualEQInfoBox changeRace={this.changeRace}
          changeTexture={this.changeTexture}
          changeHelm={this.changeHelm}
          changeFace={this.changeFace}
          changeBody={this.changeBody}
          changeDistance={this.changeDistance}
          races={this.state.races}
          race={this.state.race} helm={this.state.helm}
          texture={this.state.texture} face={this.state.face}
          body={this.state.body} distance={this.state.distance}
          modelSpecs={this.state.modelSpecs}
          exportModel={this.exportModel}
          animList={this.state.animList}
          changeAnim={this.changeAnim}
          anim={this.state.anim}
        />
      </div>
    )
  }
  componentDidMount() {
    this.getModels()
    this.getModelSpecs(this.state.race)
  }
  changeRace(event) {
    this.setState({ 
      race: event.target.value,
      texture: 0,
      face: 0,
      helm: 0,
      anim: ""
    })
    this.getModelSpecs(event.target.value)
  }
  changeTexture(texture) {
    if (this.state.body) {
      if (texture <  10) texture = 10
      if (texture > this.state.modelSpecs.maxBodyTexture) texture = this.state.modelSpecs.maxBodyTexture
    } else {
      if (texture < 0) texture = 0
      if (texture > this.state.modelSpecs.maxTexture) texture = this.state.modelSpecs.maxTexture
    }
    this.setState({ texture })
  }
  changeHelm(helm) {
    if (helm < 0) helm = 0
    if (helm > this.state.modelSpecs.maxHelm) helm = this.state.modelSpecs.maxHelm
    this.setState({ helm })
  }
  changeFace(face) {
    if (face < 0) face = 0
    if (face > this.state.modelSpecs.maxFace) face = this.state.modelSpecs.maxFace
    this.setState({ face })
  }
  changeBody(body) {
    if (body < 0) body = 0
    if (body > this.state.modelSpecs.maxBody) body = this.state.modelSpecs.maxBody
    let texture = body === 0 ? 0 : 10
    this.setState({ body, texture })
  }
  changeDistance(distance) {
    if (distance < 0) distance = 0
    this.setState({ distance })
  }
  getModelSpecs(race) {
    fetch(`${this.props.store}/${race}.json`).then(json => json.json()).then(modelSpecs => {
      this.setState({ modelSpecs })
    })
  }
  getModels() {
    fetch(`${this.props.store}/races.json`).then(res => res.json()).then(body => {
      this.setState({ races: body.races })
    }).catch(err => {
      throw new Error(err)
    })
  }
  setSubject(subject) {
    this.setState({subject})
  }
  exportModel(type = "gltf", shader = "basic") {
    let model = this.state.subject.clone()
    let child = null
    for (let c of model.children) {
      child = c
    }
    let base = null
    for (let c of child.children) {
      let searchString = this.state.race + '_'
      if (c.name.indexOf(searchString) !== -1) {
        base = c
      }
    }
    let list = []
    if (base) {
      for (let c of child.children) {
        if (c !== base) list.push(c)
      }
    }
    for (let c of list) {
      c.parent.remove(c)
      base.add(c)
    }
    base.rotateX(-Math.PI/2)
    this.exportGlTF(base, shader)
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
      saveData(gltf, `${this.state.race}.gltf`)
    }, {
      embedImages: true,
      onlyVisible: true,
    })
  }
  setAnimList(animList) {
    this.setState({animList})
  }
  changeAnim(event) {
    let anim = event.target.value
    this.setState({ anim })
  }
}

export default VisualNPCViewer
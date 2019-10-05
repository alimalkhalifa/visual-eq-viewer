import React from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import FlyCamera from './FlyCamera'

class VisualEQZone extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      locOffsetTop: 10,
    }
    this.timeUpdate = 0
    this.destroyed = false
  }
  render() {
    return (
      <div ref={ref => (this.mount = ref)} style={{
        width: '100%',
        height: '100%'
      }}>
        <div id="loc" ref={ref => (this.locElement = ref)} style={{
          position: "absolute",
          left: 10,
          top: this.state.locOffsetTop,
          color: "magenta"
        }}>0.00, 0.00, 0.00</div>
      </div>
    )
  }
  componentDidMount() {
    this.create()
  }
  componentWillUnmount() {
    this.destroy(true)
  }
  create() {
    this.setState({ locOffsetTop: this.mount.offsetTop + 10 })
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color().setHex(0x82eaff)
    this.scene.fog = new THREE.Fog(new THREE.Color().setHex(0x82eaff), 1000, 1500)
    this.camera = new FlyCamera(this, this.mount)
    this.scene.add(this.camera.object)
    this.clock = new THREE.Clock()
    if (this.props.store && this.props.zone) this.loadZone(this.props.zone)
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer()
      this.mount.appendChild(this.renderer.domElement)
    }
    this.renderer.gammaOutput = true
    this.renderer.gammaFactor = 2.2
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight)
    this.animate()
    this.connect()
  }
  destroy(alsoRenderer) {
    this.destroyed = true
    this.scene.dispose()
    if (alsoRenderer) {
      this.renderer.forceContextLoss()
      //this.renderer.context = null
      this.renderer.domElement = null
      this.renderer.dispose()
    }
  }
  connect() {
    
  }
  loadZone(zone) {
    let loader = new GLTFLoader()
    loader.load(`${this.props.store}/${zone}/${zone}.glb`, gltf => {
      this.subject = gltf.scene
      this.scene.add(this.subject)
    })
  }
  componentDidUpdate() {
    if (this.props.store && this.props.zone) this.loadZone(this.props.zone)
  }
  animate() {
    if (this.destroyed) return
    requestAnimationFrame(() => this.animate())
    this.cullScene()
    let delta = this.clock.getDelta()
    this.camera.updateCamera(delta)
    this.timeUpdate -= delta
    this.locElement.innerText = this.camera.object.position.toArray().map(value => value.toFixed(2)).join(', ')
    this.renderThree()
  }
  cullScene() {
    this.scene.children.forEach(child => {
      if (child !== this.subject) {
        this.scene.remove(child)
      }
    })
  }
  renderThree() {
    this.renderer.render(this.scene, this.camera.object)
  }
}

export default VisualEQZone
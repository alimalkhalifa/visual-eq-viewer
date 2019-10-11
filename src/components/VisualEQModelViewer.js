import React from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import path from 'path'

class VisualEQModelViewer extends React.PureComponent {
  render() {
    return (
      <div ref={ref => (this.mount = ref)} style={{
        width: '100%',
        height: '100%'
      }}>
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
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x111111)
    this.camera = new THREE.PerspectiveCamera(70, this.mount.clientWidth / this.mount.clientHeight, 1, 100)
    this.camera.up.set(0, 0, 1)
    let quat = new THREE.Quaternion()
    quat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
    this.camera.quaternion.copy(quat)
    this.camera.position.set(this.props.distance || 10, 0, 0)
    this.camera.lookAt(0, 0, 0)
    this.scene.add(this.camera)
    this.clock = new THREE.Clock()
    this.loadModel(this.props.race)
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer()
      this.mount.appendChild(this.renderer.domElement)
    }
    this.renderer.gammaOutput = true
    this.renderer.gammaFactor = 2.2
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight)
    this.animate()
  }
  destroy(alsoRenderer) {
    this.scene.dispose()
    if (alsoRenderer) {
      this.renderer.forceContextLoss()
      //this.renderer.context = null
      this.renderer.domElement = null
      this.renderer.dispose()
    }
  }
  loadModel(race) {
    let loader = new GLTFLoader()
    loader.load(`${this.props.store}/${race}.glb`, gltf => {
      this.subject = gltf.scene
      this.props.setSubject(gltf.scene)
      let baseName = gltf.scene.children[0].name
      gltf.scene.traverse(mesh => {
        let type = 0
        if (mesh.name.indexOf(baseName + '_') !== -1) // base
          type = 1
        if (mesh.name.indexOf(baseName + 'HE') !== -1) // head
          type = 2
        if (mesh.name.indexOf(baseName + '0') !== -1) // body
          type = 3
        if (type === 2) {
          let helm = parseInt(mesh.name.substr(5, 2))
          if (helm !== this.props.helm) {
            mesh.visible = false
          }
        } else {
          if (this.props.texture < 10) {
            if (type === 3) {
              mesh.visible = false
            }
          } else {
            if (type === 1) {
              mesh.visible = false
            }
          }
        }
        if (mesh.material && mesh.visible && mesh.parent.visible && (this.props.texture > 0 || this.props.face > 0)) {
          let name = mesh.name.indexOf('mesh') !== -1 ? mesh.parent.name : mesh.name
          let body = false
          if (this.props.texture >= 10) body = true
          let texture = body ? this.props.texture - 6 : this.props.texture
          let src = mesh.material.map.image.src
          let base = path.basename(src)
          let url = src.substr(0, src.indexOf(base))
          let newbase
          if (name.indexOf('HE', 3) !== -1 && base.indexOf(this.props.race.toLowerCase()) !== -1) {
            if (this.props.imageSpecs[base].maxTexture < texture) texture = String(this.props.imageSpecs[base].maxTexture)
            texture = String(texture)
            while (texture.length < 2) {
              texture = '0' + texture
            }
            let face = String(this.props.face)
            if (this.props.imageSpecs[base].maxFace < face) face = String(this.props.imageSpecs[base].maxFace)
            newbase = base.substr(0, 5) + texture + face + base.substr(8)
          } else if (name.indexOf('HE', 3) !== -1) {
            newbase = base
          } else if (body && base.indexOf(this.props.race.toLowerCase()) !== -1) {
            newbase = base
          } else {
            if (this.props.imageSpecs[base].maxTexture < texture) texture = String(this.props.imageSpecs[base].maxTexture)
            texture = String(texture)
            while (texture.length < 2) {
              texture = '0' + texture
            }
            let startNumber = base.search(/[0-9]/)
            newbase = base.substr(0, startNumber) + texture + base.substr(startNumber+2)
          }
          url += newbase
          mesh.material.map.image.onload = () => {
            mesh.material.map.needsUpdate = true
          }
          mesh.material.map.image.src = url
        }
      })
      this.scene.add(gltf.scene)
    })
  }
  componentDidUpdate() {
    this.loadModel(this.props.race)
    this.setDistance(this.props.distance)
  }
  setDistance(distance) {
    this.camera.position.set(distance || 10, 0, 0)
    this.camera.lookAt(0, 0, 0)
  }
  animate() {
    requestAnimationFrame(() => this.animate())
    let delta = this.clock.getDelta()
    if (this.subject) this.subject.rotateZ(delta * Math.PI / 4)
    this.cullScene()
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
    this.renderer.render(this.scene, this.camera)
  }
}

export default VisualEQModelViewer
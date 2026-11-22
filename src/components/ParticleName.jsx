import { useEffect, useRef } from 'react'

// Reference interaction: delayed brush, random scatter, depth lift, spring return.
const VERTEX = `
attribute vec3 position;
attribute vec4 color;
uniform vec2 resolution;
uniform float size;
uniform float focal;
varying vec4 tint;
void main() {
  float depth = focal / max(10.0, focal - position.z);
  vec2 point = resolution * .5 + (position.xy - resolution * .5) * depth;
  gl_Position = vec4((point / resolution * 2.0 - 1.0) * vec2(1., -1.), 0., 1.);
  gl_PointSize = size * (.8 + dot(color.rgb, vec3(.299, .587, .114)) * .4) * depth;
  tint = color;
}`
const FRAGMENT = `
precision mediump float;
varying vec4 tint;
void main() {
  float distance = length(gl_PointCoord - vec2(.5));
  if (distance > .5) discard;
  gl_FragColor = vec4(tint.rgb, tint.a * (1.0 - smoothstep(.3, .5, distance)));
}`

export default function ParticleName({ nameRef, progress }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false })
    if (!gl) return
    let disposed = false, frame = 0, particles = [], width = 0, height = 0, last = 0
    let positions = new Float32Array(), pointer = null, brush = null
    const shaders = []
    const compile = (type, source) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      shaders.push(shader)
      return shader
    }
    const program = gl.createProgram()
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach(shader => gl.deleteShader(shader))
      gl.deleteProgram(program)
      return
    }
    const positionBuffer = gl.createBuffer(), colorBuffer = gl.createBuffer()
    const uniforms = Object.fromEntries(['resolution', 'size', 'focal'].map(name => [name, gl.getUniformLocation(program, name)]))
    const bind = (buffer, name, count, data, usage) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, data, usage)
      const attribute = gl.getAttribLocation(program, name)
      gl.enableVertexAttribArray(attribute)
      gl.vertexAttribPointer(attribute, count, gl.FLOAT, false, 0, 0)
    }
    const reset = () => {
      if (disposed || progress.get() >= .3) return
      width = canvas.clientWidth
      height = canvas.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      const name = nameRef.current
      if (!name || !width || !height) return
      const drawWidth = width, drawHeight = height
      const density = Math.min(1000, Math.ceil(width * dpr))
      const sample = document.createElement('canvas')
      sample.width = density
      sample.height = Math.round(density * height / width)
      const ctx = sample.getContext('2d', { willReadFrequently: true })
      ctx.scale(sample.width / width, sample.height / height)
      // Render the existing DOM typography, including each line's tracking and scaleX.
      const root = canvas.getBoundingClientRect()
      const scaleX = root.width / width, scaleY = root.height / height
      for (const line of name.querySelectorAll(':scope > span')) {
        const style = getComputedStyle(line)
        const rect = line.getBoundingClientRect()
        const fontSize = parseFloat(style.fontSize)
        ctx.save()
        ctx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`
        ctx.fillStyle = getComputedStyle(name).color
        ctx.letterSpacing = style.letterSpacing
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'
        const metrics = ctx.measureText(line.textContent.toUpperCase())
        const ascent = metrics.fontBoundingBoxAscent ?? fontSize * .8
        const descent = metrics.fontBoundingBoxDescent ?? fontSize * .2
        const baseline = (rect.top - root.top) / scaleY + (parseFloat(style.lineHeight) - ascent - descent) / 2 + ascent
        const center = (rect.left - root.left + rect.width / 2) / scaleX + parseFloat(style.paddingLeft) * .4
        ctx.translate(center, baseline)
        ctx.scale(.8, 1)
        ctx.fillText(line.textContent.toUpperCase(), 0, 0)
        ctx.restore()
      }
      const pixels = ctx.getImageData(0, 0, sample.width, sample.height).data
      particles = []
      const colors = []
      for (let y = 0; y < sample.height; y++) for (let x = 0; x < sample.width; x++) {
        const pixel = (y * sample.width + x) * 4
        if (pixels[pixel + 3] < 50) continue
        const homeX = (width - drawWidth) / 2 + (x + .5 + (Math.random() - .5) * .8) / density * drawWidth
        const homeY = (height - drawHeight) / 2 + (y + .5 + (Math.random() - .5) * .8) / sample.height * drawHeight
        particles.push({ homeX, homeY, x: homeX, y: homeY, z: 0, vx: 0, vy: 0, vz: 0 })
        colors.push(pixels[pixel] / 255, pixels[pixel + 1] / 255, pixels[pixel + 2] / 255, pixels[pixel + 3] / 255)
      }
      positions = new Float32Array(particles.length * 3)
      gl.useProgram(program)
      bind(positionBuffer, 'position', 3, positions, gl.DYNAMIC_DRAW)
      bind(colorBuffer, 'color', 4, new Float32Array(colors), gl.STATIC_DRAW)
      gl.uniform1f(uniforms.size, Math.max(.5, drawWidth / density * 2.25) * dpr)
      pointer = brush = null
      wake()
    }
    const draw = (time) => {
      frame = 0
      if (disposed || document.hidden || progress.get() >= .3 || !particles.length) return
      // The reference physics are 60 Hz; cap delta after an inactive tab.
      const dt = Math.min(2, Math.max(.25, (time - last) / (1000 / 60)))
      last = time
      const previous = brush && { ...brush }
      if (pointer) {
        brush ||= { ...pointer }
        brush.x += (pointer.x - brush.x) * (1 - Math.pow(.55, dt))
        brush.y += (pointer.y - brush.y) * (1 - Math.pow(.55, dt))
      }
      const scale = Math.min(width, height) / 800, radius = 160 * scale
      const dx = previous && brush ? brush.x - previous.x : 0
      const dy = previous && brush ? brush.y - previous.y : 0
      const length = dx * dx + dy * dy
      let moving = false
      particles.forEach((p, index) => {
        if (pointer && brush) {
          const t = length ? Math.max(0, Math.min(1, ((p.homeX - previous.x) * dx + (p.homeY - previous.y) * dy) / length)) : 1
          const bx = previous ? previous.x + t * dx : brush.x
          const by = previous ? previous.y + t * dy : brush.y
          const distance = Math.hypot(p.homeX - bx, p.homeY - by)
          if (distance < radius && Math.random() > .2) {
            const force = (Math.cos(distance * Math.PI / radius) + 1) * .5 * scale * dt
            p.vx += (Math.random() - .5) * 9 * force
            p.vy += (Math.random() - .5) * 9 * force
            p.vz += (Math.random() * .6 + .4) * force
          }
        }
        const damping = Math.pow(.72, dt)
        p.vx = (p.vx + (p.homeX - p.x) * .005 * dt) * damping
        p.vy = (p.vy + (p.homeY - p.y) * .005 * dt) * damping
        p.vz = (p.vz - p.z * .005 * dt) * damping
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt
        const unsettled = Math.abs(p.homeX - p.x) + Math.abs(p.homeY - p.y) + Math.abs(p.z) > .03
        moving ||= unsettled
        if (!unsettled && !pointer) { p.x = p.homeX; p.y = p.homeY; p.z = p.vx = p.vy = p.vz = 0 }
        positions[index * 3] = p.x
        positions[index * 3 + 1] = p.y
        positions[index * 3 + 2] = p.z
      })
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.enable(gl.BLEND)
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      gl.useProgram(program)
      gl.uniform2f(uniforms.resolution, width, height)
      gl.uniform1f(uniforms.focal, 1000 * scale)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions)
      gl.drawArrays(gl.POINTS, 0, particles.length)
      nameRef.current?.setAttribute('data-particles-ready', '')
      if (moving || pointer) frame = requestAnimationFrame(draw)
    }
    function wake() {
      if (!frame && !disposed && progress.get() < .3) { last = performance.now() - 1000 / 60; frame = requestAnimationFrame(draw) }
    }
    const move = event => {
      const portrait = document.querySelector('.hero-cinema-photo')?.getBoundingClientRect()
      if (portrait && event.clientX >= portrait.left && event.clientX <= portrait.right && event.clientY >= portrait.top && event.clientY <= portrait.bottom) { pointer = brush = null; return }
      const rect = canvas.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) { pointer = brush = null; return }
      pointer = { x: (event.clientX - rect.left) * width / rect.width, y: (event.clientY - rect.top) * height / rect.height }
      wake()
    }
    const leave = () => { pointer = brush = null }
    const visibility = () => { leave(); wake() }
    const unsubscribe = progress.on('change', () => { leave(); wake() })
    const observer = new ResizeObserver(reset)
    observer.observe(canvas)
    document.fonts.ready.then(reset)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', leave)
    window.addEventListener('blur', leave)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      disposed = true
      nameRef.current?.removeAttribute('data-particles-ready')
      cancelAnimationFrame(frame)
      observer.disconnect()
      unsubscribe()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', leave)
      window.removeEventListener('blur', leave)
      document.removeEventListener('visibilitychange', visibility)
      gl.deleteBuffer(positionBuffer); gl.deleteBuffer(colorBuffer)
      shaders.forEach(shader => gl.deleteShader(shader))
      gl.deleteProgram(program)
    }
  }, [nameRef, progress])
  return <canvas ref={canvasRef} className="hero-name-particles" aria-hidden="true" />
}

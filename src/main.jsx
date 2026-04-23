import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const canvas = document.createElement('canvas')
canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;'
document.body.appendChild(canvas)
document.body.style.cssText = 'margin:0;background:#000005;overflow-x:hidden;'

const ctx = canvas.getContext('2d')
let stars = [], armStars = [], W = 0, H = 0

function resize() {
  W = canvas.width = window.innerWidth
  H = canvas.height = window.innerHeight
  const cx = W/2, cy = H/2

  stars = Array.from({length: 320}, () => ({
    x: Math.random()*W, y: Math.random()*H,
    r: Math.random()<0.72 ? Math.random()*0.7+0.15 : Math.random()*1.4+0.6,
    alpha: Math.random()*0.55+0.12,
    twinkle: Math.random()*0.018+0.004,
    offset: Math.random()*Math.PI*2,
  }))

  armStars = Array.from({length: 500}, () => {
    const arm = Math.floor(Math.random()*2)
    const base = arm * Math.PI
    const t2 = Math.random()
    const spread = (Math.random()-0.5)*0.55
    const dist = 80 + t2*Math.min(W,H)*0.44
    const angle = base + t2*2.6 + spread
    const COLS = ['#ff8855','#cc55ff','#00dd88','#00ccff','#ffcc00','#ff3d8a','#ffffff']
    return {
      x: cx + Math.cos(angle)*dist,
      y: cy + Math.sin(angle)*dist*0.52,
      r: Math.random()*0.9+0.15,
      alpha: (1-t2*0.65)*(0.18+Math.random()*0.35),
      col: COLS[Math.floor(Math.random()*COLS.length)],
      twinkle: Math.random()*0.012+0.003,
      offset: Math.random()*Math.PI*2,
    }
  })
}

resize()
window.addEventListener('resize', resize)

function hexToRgb(hex) {
  if(hex==='#ffffff') return {r:200,g:210,b:255}
  return { r:parseInt(hex.slice(1,3),16), g:parseInt(hex.slice(3,5),16), b:parseInt(hex.slice(5,7),16) }
}

let t = 0
function draw() {
  ctx.clearRect(0,0,W,H)
  ctx.fillStyle='#000005'
  ctx.fillRect(0,0,W,H)
  t += 0.012

  stars.forEach(s => {
    const a = s.alpha + Math.sin(t*s.twinkle*50 + s.offset)*0.1
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.04,Math.min(0.85,a))})`
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2)
    ctx.fill()
  })

  ctx.save()
  ctx.filter = 'blur(22px)'
  const cx = W/2, cy = H/2
  const neb = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*0.5)
  neb.addColorStop(0,'rgba(60,20,100,0.22)')
  neb.addColorStop(0.35,'rgba(20,8,55,0.14)')
  neb.addColorStop(1,'transparent')
  ctx.fillStyle = neb
  ctx.fillRect(0,0,W,H)
  ctx.restore()

  armStars.forEach(s => {
    const a = s.alpha + Math.sin(t*s.twinkle*50 + s.offset)*0.07
    const {r,g,b} = hexToRgb(s.col)
    ctx.fillStyle = `rgba(${r},${g},${b},${Math.max(0.03,Math.min(0.75,a))})`
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2)
    ctx.fill()
  })

  requestAnimationFrame(draw)
}
draw()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
import { defineCustomElement } from 'vue'
import RoomElvesCard from './RoomElvesCard.vue'

// ── 1. 获取 Vue 生成的原生 Custom Element 基类 ──
const VueCardElement = defineCustomElement(RoomElvesCard)

// ── 2. 继承基类，桥接 Home Assistant 生命周期 ──
class RoomElvesHACard extends VueCardElement {
  // ✅ 拦截 HA 的 setConfig，将其转化为 Vue 的 config prop
  setConfig(config: any) {
    // 这会触发 Vue 内部的 prop setter，自动响应式更新！
    ;(this as any).config = config
  }
  
  // ✅ 拦截 HA 的 getCardSize
  getCardSize() {
    return 3
  }
}

// ── 3. 注册我们包装后的类，而不是原始的 VueCardElement ──
customElements.define('my-room-elves-card', RoomElvesHACard)
console.log("注册成功")
// ── 4. Register with Home Assistant card picker ──
const w = window as any
w.customCards = w.customCards || []
w.customCards.push({
  type: 'room-elves-card',
  name: 'Room Elves Card',
  description: 'Room Elves card system built with Vue 3',
})


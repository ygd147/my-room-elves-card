<template>
  <div class="re-html-card" ref="containerRef" v-html="sanitizedContent"></div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Hass } from '../../common/types'

const props = defineProps<{
  hass?: Hass | null
  content?: string
  template?: string
}>()

const containerRef = ref<HTMLElement | null>(null)

const allowedTags = new Set([
  'div', 'span', 'p', 'br', 'b', 'i', 'u', 'strong', 'em',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody',
  'a', 'img', 'button', 'input', 'textarea', 'label', 'form',
  'svg', 'path', 'circle', 'rect', 'line', 'g', 'text',
])

const allowedAttrs = new Set([
  'style', 'class', 'id', 'title', 'src', 'href', 'target', 'alt',
  'icon', 'colspan', 'rowspan', 'align', 'valign',
  'width', 'height', 'type', 'name', 'value', 'placeholder',
  'disabled', 'checked', 'selected', 'min', 'max', 'step',
  'data-entity', 'data-action', 'data-service',
])

const rawContent = computed(() => {
  return props.content || props.template || ''
})

const sanitizedContent = computed(() => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${rawContent.value}</body>`, 'text/html').body

  function sanitizeNode(node: Node): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      if (!allowedTags.has(el.tagName.toLowerCase())) {
        el.replaceWith(...Array.from(el.childNodes))
        return
      }
      Array.from(el.attributes).forEach(attr => {
        if (!allowedAttrs.has(attr.name)) {
          el.removeAttribute(attr.name)
        }
      })
    }
    Array.from(node.childNodes).forEach(child => sanitizeNode(child))
  }

  sanitizeNode(doc)
  return doc.innerHTML
})
</script>

<style scoped>
.re-html-card {
  padding: 12px;
  border-radius: 16px;
  background: var(--room-card-bg, rgba(255,255,255,0.8));
  font-size: 13px;
  line-height: 1.5;
  overflow-x: auto;
}
</style>

import type { ComputedRef, WatchSource } from 'vue'

export function useCarousel<T>(slides: ComputedRef<T[]>, resetOn?: WatchSource) {
  const currentIndex = ref(0)

  const currentSlide = computed(() => slides.value[currentIndex.value])

  const progressText = computed(() => {
    const total = slides.value.length
    const active = currentIndex.value + 1
    return `${String(active).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
  })

  const prevSlide = () => {
    const total = slides.value.length
    currentIndex.value = (currentIndex.value - 1 + total) % total
  }

  const nextSlide = () => {
    const total = slides.value.length
    currentIndex.value = (currentIndex.value + 1) % total
  }

  if (resetOn) {
    watch(resetOn, () => {
      currentIndex.value = 0
    })
  }

  return { currentIndex, currentSlide, progressText, prevSlide, nextSlide }
}

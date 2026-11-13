import { ref } from 'vue'

export const searchOpen = ref(false)

export function openSearch() {
  searchOpen.value = true
}

export function closeSearch() {
  searchOpen.value = false
}

export function toggleSearch() {
  searchOpen.value = !searchOpen.value
}
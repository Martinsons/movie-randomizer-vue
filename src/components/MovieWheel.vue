<template>
  <div class="bg-surface rounded-lg p-6 shadow-lg">
    <h2 class="text-xl font-semibold mb-4">Movie Wheel</h2>

    <!-- Canvas Wheel -->
    <div class="relative">
      <div class="relative">
        <canvas
          ref="wheelCanvas"
          width="500"
          height="500"
          class="max-w-full h-auto mx-auto"
        ></canvas>

        <!-- Fixed Pointer -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <svg
            width="30"
            height="40"
            viewBox="0 0 30 40"
            class="fill-red-600"
          >
            <path d="M0 0 L30 0 L15 30 Z" />
          </svg>
        </div>
      </div>

      <!-- Spin Button -->
      <button
        @click="spinWheel"
        :disabled="isSpinning || store.selectedMovies.length < 2"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
               bg-primary hover:bg-primary/80 disabled:bg-gray-600 
               text-white px-6 py-3 rounded-full transition-colors
               font-semibold text-lg shadow-lg transform hover:scale-105
               disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        {{ isSpinning ? 'Spinning...' : 'Spin' }}
      </button>

      <!-- Winner Display -->
      <Transition name="fade">
        <div
          v-if="winner"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center 
                 justify-center p-4 z-50"
          @click="closeWinner"
        >
          <div
            class="bg-surface p-6 rounded-lg shadow-xl max-w-md w-full
                   text-center transform scale-100"
            @click.stop
          >
            <h3 class="text-2xl font-bold mb-4">
              <template v-if="isFinalWinner">
                🏆 Tournament Winner! 🏆
              </template>
              <template v-else>
                Winner!
              </template>
            </h3>
            <div class="relative w-48 h-72 mx-auto mb-4">
              <img
                :src="winner.poster_path 
                  ? `https://image.tmdb.org/t/p/w400${winner.poster_path}`
                  : '/placeholder.png'"
                :alt="winner.title"
                class="w-full h-full object-cover rounded-lg shadow-lg"
              />
              <div
                v-if="isFinalWinner"
                class="absolute -top-4 -right-4 bg-yellow-500 text-black 
                       w-12 h-12 rounded-full flex items-center justify-center 
                       font-bold text-xl transform rotate-12 shadow-lg"
              >
                #1
              </div>
            </div>
            <p class="text-xl font-semibold mb-2">{{ winner.title }}</p>
            <p v-if="isFinalWinner" class="text-yellow-500 font-medium mb-4">
              First to reach {{ store.winsNeeded }} wins! 🎉
            </p>
            <div v-if="isFinalWinner" class="mb-4">
              <p class="text-sm text-gray-400">All wins have been reset. Ready for a new tournament!</p>
            </div>
            <button
              @click="closeWinner"
              class="mt-4 bg-primary hover:bg-primary/80 text-white px-6 
                     py-2 rounded-full transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Win Mode Settings -->
    <div class="mt-6 space-y-4">
      <div class="flex items-center justify-between">
        <label class="text-text-secondary">Win Mode:</label>
        <select
          v-model="store.winMode"
          class="bg-background text-text-primary px-4 py-2 rounded-lg 
                 border border-gray-700"
          @change="store.updateWinMode($event.target.value)"
        >
          <option value="single">Single Spin</option>
          <option value="first-to">First to X Wins</option>
        </select>
      </div>

      <div
        v-if="store.winMode === 'first-to'"
        class="flex items-center justify-between"
      >
        <label class="text-text-secondary">Wins needed:</label>
        <select
          v-model="store.winsNeeded"
          class="bg-background text-text-primary px-4 py-2 rounded-lg 
                 border border-gray-700"
          @change="store.updateWinsNeeded(Number($event.target.value))"
        >
          <option v-for="n in 5" :key="n" :value="n">{{ n }} Wins</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useMovieStore } from '../stores/movieStore'
import gsap from 'gsap'

const store = useMovieStore()
const wheelCanvas = ref(null)
const ctx = ref(null)
const isSpinning = ref(false)
const winner = ref(null)

const isFinalWinner = computed(() => {
  if (!winner.value) return false
  const wins = store.movieWins.get(winner.value.id)
  return wins >= store.winsNeeded
})

onMounted(() => {
  ctx.value = wheelCanvas.value.getContext('2d')
  drawWheel()
})

watch(() => store.selectedMovies, drawWheel, { deep: true })

function drawWheel() {
  if (!ctx.value) return

  const canvas = wheelCanvas.value
  const context = ctx.value
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = Math.min(centerX, centerY) - 20

  context.clearRect(0, 0, canvas.width, canvas.height)

  const segments = store.selectedMovies.length > 0 
    ? store.selectedMovies 
    : [{ title: 'Add movies!' }]
  
  const anglePerSegment = (2 * Math.PI) / segments.length

  segments.forEach((movie, index) => {
    context.save()
    context.beginPath()
    context.moveTo(centerX, centerY)
    context.arc(
      centerX,
      centerY,
      radius,
      index * anglePerSegment,
      (index + 1) * anglePerSegment
    )
    context.closePath()

    // Fill segment with gradient
    const gradient = context.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    )
    gradient.addColorStop(0, index % 2 === 0 ? '#4f46e5' : '#4338ca')
    gradient.addColorStop(1, index % 2 === 0 ? '#3730a3' : '#312e81')
    context.fillStyle = gradient
    context.fill()
    
    // Add subtle border
    context.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    context.lineWidth = 2
    context.stroke()

    // Add text
    context.save()
    context.translate(centerX, centerY)
    context.rotate(index * anglePerSegment + anglePerSegment / 2)
    context.textAlign = 'right'
    context.fillStyle = '#FFFFFF'
    context.font = 'bold 14px Inter'
    const title = movie.title?.length > 20 
      ? movie.title.substring(0, 17) + '...' 
      : movie.title
    context.fillText(title || 'Add movies!', radius - 30, 5)
    context.restore()

    context.restore()
  })
}

function spinWheel() {
  if (isSpinning.value || store.selectedMovies.length < 2) return

  isSpinning.value = true
  winner.value = null
  const spins = 5 // Number of full rotations
  const extraDegrees = Math.random() * 360 // Random extra rotation
  const totalRotation = spins * 360 + extraDegrees

  // Reset the wheel's rotation first
  gsap.set(wheelCanvas.value, { rotation: 0 })

  gsap.to(wheelCanvas.value, {
    rotation: totalRotation,
    duration: 5,
    ease: 'power2.out',
    onUpdate: () => {
      ctx.value.save()
      ctx.value.translate(wheelCanvas.value.width / 2, wheelCanvas.value.height / 2)
      ctx.value.rotate((wheelCanvas.value.rotation * Math.PI) / 180)
      ctx.value.translate(-wheelCanvas.value.width / 2, -wheelCanvas.value.height / 2)
      drawWheel()
      ctx.value.restore()
    },
    onComplete: () => {
      isSpinning.value = false
      
      // Calculate the final position
      const finalRotation = totalRotation % 360
      const segmentSize = 360 / store.selectedMovies.length
      
      // Adjust the calculation to account for the pointer at top (270 degrees)
      let winningIndex = Math.floor(((360 - finalRotation + 270) % 360) / segmentSize)
      
      // Ensure the index is within bounds
      winningIndex = winningIndex % store.selectedMovies.length
      
      const winningMovie = store.selectedMovies[winningIndex]
      store.recordWin(winningMovie.id)

      // Check if we have an overall winner
      if (store.winMode === 'first-to') {
        const wins = store.movieWins.get(winningMovie.id)
        if (wins >= store.winsNeeded) {
          // Show final winner
          winner.value = winningMovie
          // Wait for user to close the winner display
          // Wins will be reset when they close it
          return
        }
      }
      
      // Show regular winner if not final winner
      winner.value = winningMovie
    }
  })
}

function closeWinner() {
  // If this was the final winner, reset wins
  if (isFinalWinner.value) {
    store.resetWins()
  }
  winner.value = null
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

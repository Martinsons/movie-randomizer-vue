<template>
  <div class="bg-surface rounded-lg p-6 shadow-lg">
    <h2 class="text-xl font-semibold mb-4">Add Movies to Wheel</h2>
    
    <!-- Search Input -->
    <div class="relative">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Search for movies..."
        class="w-full bg-background text-text-primary px-4 py-2 rounded-lg 
               border border-gray-700 focus:border-primary focus:ring-1 
               focus:ring-primary outline-none"
      />
      <div v-if="store.isSearching" 
           class="absolute right-3 top-1/2 -translate-y-1/2">
        <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>

    <!-- Search Results -->
    <TransitionGroup
      name="list"
      tag="div"
      class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      <div
        v-for="movie in store.searchResults"
        :key="movie.id"
        class="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
        @click="addMovie(movie)"
      >
        <div class="aspect-[2/3] relative">
          <img
            :src="movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/placeholder.png'"
            :alt="movie.title"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   flex flex-col items-center justify-end p-4 text-white"
          >
            <h3 class="text-lg font-semibold text-center mb-2 line-clamp-2">{{ movie.title }}</h3>
            <p class="text-sm mb-3 text-gray-300">{{ new Date(movie.release_date).getFullYear() }}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-medium">
                ★ {{ movie.vote_average.toFixed(1) }}
              </span>
            </div>
            <button
              class="bg-primary hover:bg-primary/80 text-white px-6 py-2 
                     rounded-full transition-colors font-medium"
            >
              Add to Wheel
            </button>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMovieStore } from '../stores/movieStore'
import { TransitionGroup } from 'vue'

const store = useMovieStore()
const searchQuery = ref('')

const handleSearch = () => {
  store.searchMovies(searchQuery.value)
}

const addMovie = (movie) => {
  store.addMovie(movie)
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

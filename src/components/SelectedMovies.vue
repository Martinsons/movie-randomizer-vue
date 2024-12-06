<template>
  <div class="bg-surface rounded-lg p-6 shadow-lg">
    <h2 class="text-xl font-semibold mb-4 flex items-center justify-between">
      Selected Movies
      <span class="bg-primary px-3 py-1 rounded-full text-sm">
        {{ store.selectedMovies.length }}
      </span>
    </h2>

    <TransitionGroup
      name="list"
      tag="div"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      <div
        v-for="movie in store.selectedMovies"
        :key="movie.id"
        class="relative group overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
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
            <button
              @click="removeMovie(movie.id)"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 
                     rounded-full transition-colors font-medium"
            >
              Remove
            </button>
          </div>
        </div>

        <!-- Win Counter -->
        <div
          v-if="store.movieWins.get(movie.id)"
          class="absolute top-2 right-2 bg-primary text-white rounded-full 
                 w-8 h-8 flex items-center justify-center font-bold
                 shadow-lg transform -rotate-12"
        >
          {{ store.movieWins.get(movie.id) }}
        </div>
      </div>
    </TransitionGroup>

    <!-- Empty State -->
    <div
      v-if="store.selectedMovies.length === 0"
      class="text-center text-text-secondary py-8"
    >
      No movies selected. Search and add movies to get started!
    </div>
  </div>
</template>

<script setup>
import { useMovieStore } from '../stores/movieStore'
import { TransitionGroup } from 'vue'

const store = useMovieStore()

const removeMovie = (movieId) => {
  store.removeMovie(movieId)
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

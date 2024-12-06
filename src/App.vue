<template>
  <div class="min-h-screen bg-background text-text-primary">
    <div class="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Panel -->
      <div class="space-y-6">
        <MovieSearch />
        <SelectedMovies />
      </div>
      
      <!-- Right Panel -->
      <div>
        <MovieWheel />
      </div>
    </div>
  </div>
</template>

<script setup>
import MovieSearch from './components/MovieSearch.vue'
import SelectedMovies from './components/SelectedMovies.vue'
import MovieWheel from './components/MovieWheel.vue'
import { useMovieStore } from './stores/movieStore'
import { onMounted } from 'vue'

const store = useMovieStore()

onMounted(() => {
  store.loadFromLocalStorage()
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>

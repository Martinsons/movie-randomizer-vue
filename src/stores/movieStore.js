import { defineStore } from 'pinia'
import axios from 'axios'
import { config as tmdbConfig } from '../config/tmdb.js'

export const useMovieStore = defineStore('movie', {
  state: () => ({
    selectedMovies: [],
    searchResults: [],
    isSearching: false,
    movieWins: new Map(),
    currentRotation: 0,
    isSpinning: false,
    winMode: 'single',
    winsNeeded: 2,
  }),

  actions: {
    async searchMovies(query) {
      if (!query) {
        this.searchResults = []
        return
      }

      this.isSearching = true
      try {
        const response = await axios.get(`${tmdbConfig.baseUrl}/search/movie`, {
          params: {
            api_key: tmdbConfig.apiKey,
            query,
            language: 'en-US',
            page: 1
          }
        })
        this.searchResults = response.data.results
      } catch (error) {
        console.error('Error searching movies:', error)
        this.searchResults = []
      } finally {
        this.isSearching = false
      }
    },

    addMovie(movie) {
      if (!this.selectedMovies.some(m => m.id === movie.id)) {
        this.selectedMovies.push(movie)
        this.saveToLocalStorage()
      }
    },

    removeMovie(movieId) {
      this.selectedMovies = this.selectedMovies.filter(m => m.id !== movieId)
      this.movieWins.delete(movieId)
      this.saveToLocalStorage()
    },

    updateWinMode(mode) {
      this.winMode = mode
      this.saveToLocalStorage()
    },

    updateWinsNeeded(wins) {
      this.winsNeeded = wins
      this.saveToLocalStorage()
    },

    recordWin(movieId) {
      const currentWins = this.movieWins.get(movieId) || 0
      this.movieWins.set(movieId, currentWins + 1)
      this.saveToLocalStorage()
    },

    resetWins() {
      this.movieWins.clear()
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('movieRandomizer', JSON.stringify({
        selectedMovies: this.selectedMovies,
        movieWins: Array.from(this.movieWins.entries()),
        winMode: this.winMode,
        winsNeeded: this.winsNeeded
      }))
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('movieRandomizer')
      if (saved) {
        const data = JSON.parse(saved)
        this.selectedMovies = data.selectedMovies
        this.movieWins = new Map(data.movieWins)
        this.winMode = data.winMode
        this.winsNeeded = data.winsNeeded
      }
    }
  }
})

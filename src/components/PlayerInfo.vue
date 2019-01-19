<template>
  <div>
    <h1>{{ player.name }}</h1>
    <router-link v-bind:to="'/teams/' + player.team_id"><h4>{{ this.team_name }}</h4></router-link>
    <div class="history">
      <h3>Club History:</h3>
      <div v-for="club in filteredHistory" class="club">
        <router-link v-bind:to="'/teams/' + club.team_id"><p>{{ club.name }}</p></router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerInfo',
  data () {
    return {
      player: {
        history: []
      },
      id: this.$route.params.id,
      team_name: this.$route.params.team,
      players: [],
      teams: []
    }
  },
  created () {
    // call app backend to get data
    this.$http.post('https://alphafx-code-test-api.herokuapp.com/api/teams/players', {
    }).then(data => {
      return data.json()
    }).then(data => {
      this.players = data.data
    }).then(() => {
      for (let i in this.players) {
        if (this.players[i].id === this.id) {
          this.player = this.players[i]
        }
      }
    })

    this.$http.post('https://alphafx-code-test-api.herokuapp.com/api/teams', {
    }).then(data => {
      return data.json()
    }).then(data => {
      this.teams = data.data
    })
  },
  methods: {

  },
  computed: {
    filteredHistory: function () {
      return this.player.history.filter(team => {
        for (let i in this.teams) {
          if (team.team_id === this.teams[i].id) {
            return team.name = this.teams[i].name
          }
        }
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>

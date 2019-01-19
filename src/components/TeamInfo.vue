<template>
  <div>
    <div class="header-wrap">
      <router-link to="/">All teams</router-link>
      <div v-bind:style="team.colour.length === 6 ? 'background: #' + team.colour : 'background:' + team.colour" class="heading">
        <h1>{{ team.name }}</h1>
      </div>
      <img v-bind:src="team.logo_url" v-bind:alt="team.name + ' badge'">
    </div>
    <div class="wrapper squad">
      <h4>Squad:</h4>
      <div class="squad-filter">
        <div>
          <p>Age:</p>
          <label>Minimum age</label>
          <input type="number" v-model="minAge" value="18" placeholder="min age">
          <label>Maximum age</label>
          <input type="number" v-model="maxAge" value="40" placeholder="max age">
        </div>
        <div>
          <p>Position:</p>
          <label>All</label>
          <input type="radio" v-model="position" value="" checked>
          <label>Goalkeeper</label>
          <input type="radio" v-model="position" value="GK">
          <label>Defender</label>
          <input type="radio" v-model="position" value="DF">
          <label>Midfielder</label>
          <input type="radio" v-model="position" value="MF">
          <label>Forward</label>
          <input type="radio" v-model="position" value="FW">
        </div>
      </div>
      <div v-for="player in filteredPlayers" class="player">
        <img v-bind:src="player.flag_url" v-bind:alt="player.nationality + ' flag'"><p><router-link v-bind:to="'/teams/' + team.name + '/' + player.id">{{ player.name }}</router-link></p><p> - {{ player.position }}</p>
      </div>
    </div>
    <div class="wrapper">
      <h4>Enter new result:</h4>
      <form>
        <label>Team:</label>
        <select v-model="newGame.team_two_id" >
          <option v-for="team in filteredTeams" v-bind:value="team.id">{{ team.name }}</option>
        </select>
        <label>{{ team.name }}:</label>
        <input type="number" v-model="newGame.team_one_goals" value="">
        <label>Opponent:</label>
        <input type="number" v-model="newGame.team_two_goals" value="">
        <button v-on:click.prevent="post">Add game</button>
      </form>
      <hr>
      <p>Points: {{ calcPoints() }}</p>
      <p>Goals for: {{ calcFor() }} | Goals against: {{ calcAgainst() }}</p>
      <hr>
      <h4>Results:</h4>
      <div v-for="result in filteredResults">
        <div v-bind:class="[result.team_one_goals > result.team_two_goals ? winClass : '', result.team_two_goals > result.team_one_goals ? lossClass : '', 'result']">
          <p>{{ team.name }} vs <router-link v-bind:to="'/teams/' + result.team_two_id">{{ result.team_two_name }}</router-link></p>
          <p><span class="for">{{ result.team_one_goals }}</span> - <span class="against">{{ result.team_two_goals }}</span></p>
          <p>{{ result.date | moment("DD/MM/YY") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeamInfo',
  data () {
    return {
      team: {
        colour: ''
      },
      id: this.$route.params.id,
      players: [],
      results: [],
      teams: [],
      newGame: {
        "id": this.newId(),
        "date": new Date(),
        "team_one_id": this.$route.params.id,
        "team_two_id": "",
        "team_one_goals": "",
        "team_two_goals": ""
      },
      minAge: 18,
      maxAge: 36,
      position: '',
      winClass: 'win-class',
      lossClass: 'loss-class'
    }
  },
  created () {
    // call app backend to get data
    this.$http.post('https://alphafx-code-test-api.herokuapp.com/api/teams', {
    }).then(data => {
      return data.json()
    }).then(data => {
      this.teams = data.data
    }).then(() => {
      for (let i in this.teams) {
        if (this.teams[i].id === this.id) {
          this.team = this.teams[i]
        }
      }
    })

    this.$http.post('https://alphafx-code-test-api.herokuapp.com/api/teams/players', {
      'team_id': this.id
    }).then(data => {
      return data.json()
    }).then(data => {
      this.players = data.data
    })

    this.$http.post('https://alphafx-code-test-api.herokuapp.com/api/teams/games', {
      'team_one_id': this.id
    }).then(data => {
      return data.json()
    }).then(data => {
      data.data.map(result => {
        for (let i in this.teams) {
          if (this.teams[i].id === result.team_two_id) {
            result.team_two_name = this.teams[i].name
          }
        }
      })
      this.results = data.data
    })
  },
  methods: {
    post: function () {
      this.$http.post('https://alphafx-code-test-api.herokuapp.com/api/teams/games/new', this.newGame).then(data => {
        for (let i in this.teams) {
          if (this.teams[i].id === this.newGame.team_two_id) {
            this.newGame.team_two_name = this.teams[i].name
          }
        }
        this.results.unshift(this.newGame)
      });
    },
    newId: function () {
      function idString() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
      }
      return idString() + idString() + '-' + idString() + '-' + idString() + '-' + idString() + '-' + idString() + idString() + idString()
    },
    calcPoints: function () {
      let total = 0
      this.results.forEach(result => {
        total += result.points
      })
      return total
    },
    calcFor: function () {
      let total = 0
      let goals = document.querySelectorAll('.for')
      goals.forEach(goal => {
        total += parseInt(goal.innerHTML)
      })
      return total
    },
    calcAgainst: function () {
      let total = 0
      let goals = document.querySelectorAll('.against')
      goals.forEach(goal => {
        total += parseInt(goal.innerHTML)
      })
      return total
    }
  },
  computed: {
    filteredResults: function () {
      function order(a,b) {
        if (a.date < b.date) {
          return 1
        }
        if (a.date > b.date) {
          return -1
        }
        return 0
      }

      this.results.sort(order)
      return this.results.filter(result => {
        result.points = 0
        if (result.team_one_id !== result.team_two_id) {
          if (result.team_one_goals > result.team_two_goals) {
            result.points = 3
          } else if (result.team_two_goals === result.team_one_goals) {
            result.points = 1
          }
          return result
        }
      })
    },
    filteredTeams: function () {
      return this.teams.filter(team => {
        return team.id !== this.id
      })
    },
    filteredPlayers: function () {
      return this.players.filter(player => {
        if (player.age <= this.maxAge && player.age >= this.minAge) {
          if (this.position !== '') {
            if (player.position === this.position) {
              return player
            }
          } else {
            return player
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
input, select {
  border: 1px solid rgba(38,71,142,0.35);
  border-radius: .3125rem;
  padding: 2px;
  font-size: 12px;
}
button {
  background-color: #f5f5f5;
  border: 0;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: darken(#f5f5f5, 15%);
  }
}
label {
  align-self: center;
}
hr {
  width: 100%;
}
h1 {
  color: gold;
}
.header-wrap {
  display: grid;
  grid-template-columns: 180px auto 220px;
  max-width: 1200px;
  grid-column-gap: 30px;
  margin: auto;
  border-radius: 4px;
  .heading {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.wrapper {
  display: inline-flex;
  width: 40%;
  min-width: 350px;
  padding: 30px;
  flex-direction: column;
  form {
    display: grid;
    grid-template-rows: repeat(6, 1fr) 1.5fr;
    grid-row-gap: 8px;
    margin: auto;
    width: 280px;
  }
  .win-class {
    background-color: lightgreen;
  }
  .loss-class {
    background-color: pink;
  }
  .squad-filter {
    display: grid;
    grid-template-columns: 1fr 1fr;
    & > div {
      display: grid;
      grid-template-columns: 85% 15%;
      grid-gap: 4px;
      p {
        grid-column: 1 / 3;
      }
    }
  }
  .player {
    display: grid;
    margin: 15px;
    grid-template-columns: 145px auto 40px;
    width: auto;
    p {
      align-self: center;
    }
  }
}
</style>

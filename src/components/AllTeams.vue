<template>
  <div>
    <input type="text" v-model="search" placeholder="search teams..." />
    <div v-for="team in filteredTeams" class="team-container">
      <router-link v-bind:to="'/teams/' + team.id"><h2>{{ team.name }}</h2></router-link>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  name: 'AllTeams',
  data () {
    return {
      teams: [],
      search: ''
    }
  },
  created () {
    // call app backend to get data
    this.$http.post('https://alphafx-code-test-api.herokuapp.com/api/teams', {}).then((data) => {
      return data.json()
    }).then((data) => {
      this.teams = data.data
    })
  },
  methods: {

  },
  computed: {
    filteredTeams: function () {
      return this.teams.filter(team => {
        const term = this.search
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        return team.name.match(term);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
input {
  border: 1px solid rgba(38,71,142,0.35);
  border-radius: .3125rem;
  padding: 12px;
  font-size: 16px;
}
.team-container {
  background-color: #f5f5f5;
  border-radius: .3125rem;
  width: 300px;
  margin: 8px auto;
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  a {
    text-decoration: none;
    h2 {
      color: #575756;
    }
  }
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(204,204,204,0.5);
    a {
      h2 {
        color: #1D2127;
      }
    }
  }
}

</style>

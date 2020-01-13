// request get
//request.open('GET', 'https://statsapi.web.nhl.com/api/v1/teams', true);

var teams = {};
var testing;
var division = {"Atlantic": [], "Central": [], "Metropolitan": [], "Pacific": []}
var num_teams = 30;


$.getJSON("https://statsapi.web.nhl.com/api/v1/teams?expand=team.stats", 
          "https://statsapi.web.nhl.com/api/v1/divisions", function(data){
  
  var i;
  var team_names_list = document.getElementById("teams");

  // team ids
  for (i = 0; i <= num_teams; i++) { 
    teams[data.teams[i].name] = data.teams[i].id;
  } 

  // Get the divisions and seperate into the divs and their teams


  for(var j = 0; j <= num_teams; j++){
    var naming = data.teams[j].division.name;
    division[naming].push(data.teams[j].name);
  }

  var divisions = ["Atlantic", "Central", "Metropolitan", "Pacific"];
  testing = data.teams;

  // display divisions
  for(var d=0; d < divisions.length; d++){
    var at_division = document.getElementById(divisions[d]);
    for(var t=0; t < division[divisions[d]].length; t++) {
      var link = document.createElement("div");
      link.setAttribute("id", teams[division[divisions[d]][t]]);
      link.setAttribute("class", "list-group-item list-group-item-action pointer");
      link.innerHTML +=  division[divisions[d]][t];
      at_division.appendChild(link);

      link.addEventListener("click", display_prop, false);
    }
  }

  // whenever a team is selected, display their properties in the team-stats div
  function display_prop() {
    var divv = document.getElementById("team-stats");
    divv.removeAttribute("class", "d-none");

    var team_id = this.getAttribute("id"); // get the id of the team clicked
    var display_team_name = document.getElementById("team_name");
    var tname = document.getElementById(team_id).innerHTML;
    display_team_name.innerHTML = tname; // display the team name

    // display all properties in table
    getData(team_id);


  }

});

function getData(id){
  var url = "https://statsapi.web.nhl.com/api/v1/teams/"+id+"?expand=team.stats";
  $.getJSON(url, function(data){
    // row 1
    document.getElementById("city").innerHTML = "<b>City: </b>" + data.teams[0].locationName;
    document.getElementById("building").innerHTML = "<b>Building Name: </b>" + data.teams[0].venue.name;

    // row 2
    //console.log(data.teams[0].teamStats[0].splits[0].stat.gamesPlayed);
    document.getElementById("position").innerHTML = "<b>Position: </b>" + data.teams[0].teamStats[0].splits[1].stat.pts;
    document.getElementById("games").innerHTML = "<b>Games Played: </b>" + data.teams[0].teamStats[0].splits[0].stat.gamesPlayed;
    document.getElementById("wins").innerHTML = "<b>Wins: </b>" + data.teams[0].teamStats[0].splits[0].stat.wins;
    document.getElementById("loss").innerHTML = "<b>Losses: </b>" + data.teams[0].teamStats[0].splits[0].stat.losses;
    document.getElementById("ot_loss").innerHTML = "<b>OT losses: </b>" + data.teams[0].teamStats[0].splits[0].stat.ot;
    document.getElementById("points").innerHTML = "<b>Points: </b>" + data.teams[0].teamStats[0].splits[0].stat.pts;
  });

  var url2 = "https://statsapi.web.nhl.com/api/v1/teams/"+id+"?expand=team.roster";
  $.getJSON(url2, function(data){
    // loop through players
    var roster = data.teams[0].roster.roster;
    let playerid = 0;
    let ac = document.getElementById("ac");
    ac.innerHTML = "<b>Alternate Captains: </b>"
    for(var i = 0; i < roster.length; i++){
      playerid = roster[i].person.id;
      $.getJSON("https://statsapi.web.nhl.com/api/v1/people/"+playerid, function(player){
        if(player.people[0].captain === true) {
          document.getElementById("captain").innerHTML = "<b>Captain: </b>" + player.people[0].firstName + " "+ player.people[0].lastName;
        } else if (player.people[0].alternateCaptain === true){
          ac.innerHTML += player.people[0].firstName + " " + player.people[0].lastName + ", ";
        }
      });
    }

  });
}

// this is a dict that maps dimensions to their html node ids
// and yes, i'm a idiot, that's why i'm doing this from square one
dimension_card_ids = {
	0: "#dimension-card-star",
	1: "#dimension-card-difficulty",
	2: "#dimension-card-mapper",
	3: "#dimension-card-bpm"
}

dimension_content_ids = {
	0: "#dimension-content-star",
	1: "#dimension-content-difficulty",
	2: "#dimension-content-mapper",
	3: "#dimension-content-bpm"
}

var selecting_dimension;
function select_dimension(dimension_id){
	if(selecting_dimension){
		return;
	}
	selecting_dimension = true;

	$(".dimension-card").each(function(i, d){
		$(d).removeClass("selected-card");
	});

	$(dimension_card_ids[dimension_id]).addClass("selected-card");

	$(".unselected-dimension-content").each(function(i, d){
		$(d).removeClass("selected-dimension-content");
		$(d).fadeOut(100);
	})
	setTimeout(function(){
		$(dimension_content_ids[dimension_id]).addClass("selected-dimension-content");
		$(dimension_content_ids[dimension_id]).fadeIn(100);
		setTimeout(function(){
			selecting_dimension = false;
		}, 100)
	}, 100)
	
}

function user_input(){
	let user_url = $("#user-input-text").val();

	// useless fast validation, but why not
	if (user_url.indexOf("scoresaber.com")<0 || user_url.indexOf("/u/")<0){
		alert("Invalid Score Saber URL!");
	} else {
		$("#user-input-div").fadeToggle(500, complete=function(){
			window.location.href = window.location.href + "?u="+user_url.split("/u/")[1];	
		});
		
	}
}

function add_group(dimension_index, title, played_songs, total_songs, acc, pp){
	parent_div_selector = dimension_content_ids[dimension_index] + " .group-list-container";

	group_html = "<div class='group-div'><h5>"+title+"</h5> <h6>("+played_songs+"/"+total_songs+")</h6><br><h6>acc: "+acc+"</h6><br><h6>total of "+pp+"</h6></div><hr>";

	$(parent_div_selector).append(group_html);

	// creating the group content container
	$(dimension_content_ids[dimension_index]+ " .group-content-container-div").append("<div class='group-content-container'></div>");
	

}

function translate_difficulty(d){
	// returns difficulty name and its css class
	if(d == "_Easy_SoloStandard") return ["Easy", "easy"];
	
	if(d == "_Normal_SoloStandard") return ["Normal", "normal"];

	if(d == "_Hard_SoloStandard") return ["Hard", "hard"];

	if(d == "_Expert_SoloStandard")	return ["Expert", "expert"];

	if(d == "_ExpertPlus_SoloStandard") return ["Expert+", "expert-plus"];

	return ["Unknown Difficulty", ""];

}

function generate_song_html(song){
	
	s = "<div class='song "+ (song.passed ? "passed" : "unpassed") + "'>";
	s += "<img class='song-img' src=https://www.scoresaber.com" + song.image + "></img>";

	if(song.passed){
		s += "<div class='song-score'>";
		s += "<span class='song-score-pp'>"+song.score.pp.toFixed(2)+"pp </span> ";
		s += "<span class='song-score-pp-weighted'>("+(song.score.pp*song.score.weight).toFixed(2)+"pp)</span><br>";
		s += "accuracy: <span class='song-score-acc'>"+(song.score.uScore/song.score.maxScoreEx*100).toFixed(2)+"%</span>";
		if(song.score.mods.length > 0){
			s += "<span class='song-score-mods'> ("+(song.score.mods)+")</span>";
		}
		
		s += "<br><span class='song-score-date'>"+timeSince(song.score.timeset)+"</span>";

		s += "</div>";
	}
	

	s += "<div class='song-info'><span class='song-author'>" + song.songAuthorName + "</span> - ";
	s += "<span class='song-name'>" + song.name + "</span> ";
	s += "<span class='song-subname'>" + song.songSubName + "</span>";	
	s += "<br>"
	diff = translate_difficulty(song.diff);
	s += "<span class='difficulty " + diff[1] + "'>" + diff[0] + "</span> ";
	s += "<span class='song-star'>(" + song.stars + " ★, " + song.bpm + " bpm)</span> ";
	s += "<br>";	
	s += "<span class='song-mapper'>by " + song.levelAuthorName + "</span>";
	s += "<br>";

	
	s += "</div></div>";
	
	return s;
}

function add_group_content(dimension_index, group_index, song){
	parent_div_selector = dimension_content_ids[dimension_index] + " .group-content-container";

	group_html = "<div class='group-content'>"+generate_song_html(song)+"</div>";
	$($(parent_div_selector).get(group_index)).append(group_html);
}

let selecting_group = false;
function select_group(dimension_index, group_index, block_user=true){
	
	if(selecting_group){
		return;
	}
	if(block_user){selecting_group = true;}

	// select group in group list
	$(dimension_content_ids[dimension_index]+" .group-div").each(function(i, d){
		$(d).removeClass("selected-group");
	})
	$($(dimension_content_ids[dimension_index]+" .group-div").get(group_index)).addClass("selected-group");

	// show selected group content
	$(dimension_content_ids[dimension_index]+" .group-content-container").each(function(i, d){
		$(d).fadeOut(100);
	})
	setTimeout(function(){
		$($(dimension_content_ids[dimension_index]+" .group-content-container").get(group_index)).fadeIn(100);
		
		setTimeout(function(){
			selecting_group = false;
		}, 100)
	}, 100);
	
	
}

function toggle_passed(){
	$(".unpassed").fadeToggle(500);
}

function get_country_emoji(country){
	for(let i=0; i<country_flags.length; i++){
		if(country_flags[i].code == country){
			return country_flags[i].emoji;
		}
	}
}

function update_profile_info(profile, merged_data){
	
	$("#profile-avatar").attr("src", "https://new.scoresaber.com" + profile.playerInfo.avatar);
	$("#profile-country").text(get_country_emoji(profile.playerInfo.country));
	$("#profile-country-rank-indicator").text(get_country_emoji(profile.playerInfo.country));
	$("#profile-name").text(profile.playerInfo.name);
	$("#profile-pp").text(profile.playerInfo.pp);
	$("#profile-rank").text(profile.playerInfo.rank);
	$("#profile-rank-country").text(profile.playerInfo.countryRank);
	$("#profile-ranked-play-count").text(profile.scoreStats.rankedPlayCount);
	$("#profile-accuracy").text(profile.scoreStats.averageRankedAccuracy.toFixed(2));
	
	let cummulative = 0;
	let total_weight = 0;
	for(let i=0; i<merged_data.length; i++){
		item = merged_data[i];
		if(item.passed){
			total_weight += item.stars;
			cummulative += item.stars * (item.score.uScore/item.score.maxScoreEx);
		}
	}
	$("#profile-balanced-accuracy").text((100.0*(cummulative/total_weight)).toFixed(2));
	
}

// the following code is from https://stackoverflow.com/a/23259289
var timeSince = function(date) {

  if (typeof date !== 'object') {
    date = new Date(date);
  }
  
  var seconds = Math.floor((new Date() - date) / 1000);  
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'year';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'month';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hour";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minute";
          } else {
            interval = seconds;
            intervalType = "second";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }

  return interval + ' ' + intervalType + ' ago';
};
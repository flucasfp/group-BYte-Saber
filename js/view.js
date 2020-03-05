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

function add_group(dimension_index, title, played_songs, total_songs, acc){
	parent_div_selector = dimension_content_ids[dimension_index] + " .group-list-container";

	group_html = "<div class='group-div'><h5>"+title+"</h5> <h6>("+played_songs+"/"+total_songs+")</h6><br><h6>acc: "+acc+"</h6></div><hr>";

	$(parent_div_selector).append(group_html);

	// creating the group content container
	$(dimension_content_ids[dimension_index]+ " .group-content-container-div").append("<div class='group-content-container'></div>");
	console.log(dimension_content_ids[dimension_index] + " .group-content-container-div");

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
	console.log()
	s = "<div class='song "+ (song.passed ? "passed" : "unpassed") + "'>";
	s += "<img class='song-img' src=https://www.scoresaber.com" + song.image + "></img>";
	s += "<div class='song-info'><span class='song-author'>" + song.songAuthorName + "</span> - ";
	s += "<span class='song-name'>" + song.name + "</span> ";
	s += "<span class='song-subname'>" + song.songSubName + "</span>";	
	s += "<br>"
	diff = translate_difficulty(song.diff);
	s += "<span class='difficulty " + diff[1] + "'>" + diff[0] + "</span> ";
	s += "<span class='song-star'>(" + song.stars + " ★)</span> ";
	s += "<br>";	
	s += "<span class='song-mapper'>by " + song.levelAuthorName + "</span>";
	s += "<br>";
	
	s += "</div></div><hr>";
	
	return s;
}

function add_group_content(dimension_index, group_index, song){
	parent_div_selector = dimension_content_ids[dimension_index] + " .group-content-container";

	group_html = "<div class='group-content'>"+generate_song_html(song)+"</div>";
	$($(parent_div_selector).get(group_index)).append(group_html);
}

let selecting_group = false;
function select_group(dimension_index, group_index){
	if(selecting_group){
		return;
	}
	selecting_group = true;

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
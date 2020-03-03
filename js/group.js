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


function select_dimension(dimension_id){
	$(".dimension-card").each(function(i, d){
		$(d).removeClass("selected-card");
	});

	$(dimension_card_ids[dimension_id]).addClass("selected-card");

	$(".unselected-dimension-content").each(function(i, d){
		$(d).removeClass("selected-dimension-content");
	})
	$(dimension_content_ids[dimension_id]).addClass("selected-dimension-content");
}

function user_input(){
	let user_url = $("#user-input-text").val();	

	// useless fast validation, but why not
	if (user_url.indexOf("scoresaber.com")<0 || user_url.indexOf("/u/")<0){
		alert("Invalid Score Saber URL!");
	} else {
		window.location.href = window.location.href + "?u="+user_url.split("/u/")[1];	
	}
}



function create_star_dimension(cf){
	star_dimension = cf.dimension(function(d){
		return Math.floor(d.stars)+" ★";
	});

	star_group_count = star_dimension.group().reduceCount();
	counts = star_group_count.top(Infinity);
	// now sort keys in the way i want:	
	keys = [];
	for (item of counts){ keys.push(item.key)};
	keys = keys.sort(function(a,b){return b.split(" ★")[0]-a.split(" ★")[0]});
	
	return {"dimension": star_dimension, "keys": keys, "sorting_key": "stars"}
}



function create_dimensions(cf){
	dimension_list = []

	dimension_list.push(create_star_dimension(cf));	

	return dimension_list;
}

function create_groups(dimension_list){

	for(let dimension_index=0; dimension_index<dimension_list.length; dimension_index++){
		current_dimension = dimension_list[dimension_index];
		console.log(current_dimension);
		for(let group_index = 0; group_index<current_dimension.keys.length; group_index++){
			key = current_dimension.keys[group_index];
			current_dimension.dimension.filterExact(key);
			items = current_dimension.dimension.top(Infinity).sort(function(a, b){return b[current_dimension.sorting_key] - a[current_dimension.sorting_key]});

			sum_passes = items.map(item => item.passed).reduce((prev, curr) => prev + curr, 0);
			sum_acc = items.map(function(item){
				if(item.passed){
					return item.score.uScore/item.score.maxScoreEx;	
				} else {
					return 0
				};
			}).reduce((prev, curr) => prev + curr, 0);
			avg_acc = "-";
			if(sum_passes != 0) { avg_acc = (sum_acc/sum_passes*100.0).toFixed(2)+"%";};
			add_group(dimension_index, key, sum_passes, items.length, avg_acc);

			for(item of items){
				add_group_content(dimension_index, group_index, item);
			}
			
			current_dimension.dimension.filterAll();
		}
		
		$(dimension_content_ids[dimension_index]+" .group-list-container .group-div").click(function(e){
			select_group(dimension_index, $(dimension_content_ids[0]+" .group-list-container .group-div").index(this));
		});
		
		select_group(dimension_index, 0);
	}
}

function merge_data(songs, scores, key="id"){
	for(let song_index=0; song_index<songs.length; song_index++){
		songs[song_index]["passed"] = 0;
	}

	// brute force because im lazy
	for(let score_index=0; score_index<scores.length; score_index++){

		for(let song_index=0; song_index<songs.length; song_index++){
			if (scores[score_index][key] == songs[song_index][key]){
				songs[song_index]["passed"] = 1;
				songs[song_index]["score"] = scores[score_index];
				break;
			}
		}

	}

	return songs;
}
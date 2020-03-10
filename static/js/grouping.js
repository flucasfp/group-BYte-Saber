
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

function create_difficulty_dimension(cf){
	diff_dimension = cf.dimension(function(d){
		return translate_difficulty(d["diff"])[0]
	});

	diff_group_count = diff_dimension.group().reduceCount();
	
	keys = ["Expert+", "Expert", "Hard", "Normal", "Easy"];

	return {"dimension": diff_dimension, "keys": keys, "sorting_key": "stars"}

}

function create_mapper_dimension(cf){
	// now we have to do something about the feats, rip memory
	mapper_keys = [];
	maps = []

	mapper_id = 0;
	function set_mapper_key(mapper, song){
		song = Object.assign({}, song);
		song["mapper_key"] = mapper;
		maps.push(song)

		if(mapper_keys.indexOf(mapper) < 0){
			mapper_keys.push(mapper);
		}
	}
	
	for (song of songs){
		if (song["levelAuthorName"].indexOf(" & ") >= 0){
			m_feat = song["levelAuthorName"].split(" & ")
			for(m in m_feat){				
				set_mapper_key(m_feat[m], song);	
			}
		} else {
			set_mapper_key(song["levelAuthorName"], song)
		}
	}

	mapper_cf = crossfilter(maps)
	mapper_dimension = mapper_cf.dimension(function(d){
		return d["mapper_key"];
	});

	mapper_group_count = mapper_dimension.group().reduceCount();
	counts = mapper_group_count.all();
	count_dict = {};  // because facc memory
	for(let i=0; i<counts.length; i++){
		count_dict[counts[i].key] = counts[i].value
	}

	mapper_keys = mapper_keys.sort(function(a,b){return count_dict[b]-count_dict[a]});

	return {"dimension": mapper_dimension, "keys": mapper_keys, "sorting_key": "stars"}
}

function create_bpm_dimension(cf){
	bpm_dimension = cf.dimension(function(d){
		return Math.floor(d["bpm"]/50) * 50;
	})


	bpm_group_count = bpm_dimension.group().reduceCount();
	counts = bpm_group_count.top(Infinity);
	keys = [];
	for (item of counts){keys.push(item.key)};
	keys = keys.sort(function(a,b){
		if(a>1000){a=-a};  // really, Rogdude?
		if(b>1000){b=-b};  // reeeeally?
		return b-a});
	return {"dimension": bpm_dimension, "keys": keys, "sorting_key": "bpm"}
}


function create_dimensions(cf){
	dimension_list = []

	dimension_list.push(create_star_dimension(cf));	
	dimension_list.push(create_difficulty_dimension(cf));
	dimension_list.push(create_mapper_dimension(cf));
	dimension_list.push(create_bpm_dimension(cf));

	return dimension_list;
}

function create_groups(dimension_list){

	for(let dimension_index=0; dimension_index<dimension_list.length; dimension_index++){
		current_dimension = dimension_list[dimension_index];
		
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
			sum_pp = items.map(function(item){
				if(item.passed){
					return item.score.pp * item.score.weight;
				} else {
					return 0;
				}
			}).reduce((prev, curr) => prev + curr, 0)
			avg_acc = "-";
			if(sum_passes != 0) {
				avg_acc = (sum_acc/sum_passes*100.0).toFixed(2)+"%";
			};

			add_group(dimension_index, key, sum_passes, items.length, avg_acc, (sum_pp.toFixed(2)+"pp"));

			for(item of items){
				add_group_content(dimension_index, group_index, item);
			}
			
			current_dimension.dimension.filterAll();
		}
		
		$(dimension_content_ids[dimension_index]+" .group-list-container .group-div").click(function(e){
			select_group(dimension_index, $(dimension_content_ids[dimension_index]+" .group-list-container .group-div").index(this), block_user=false);
		});
		
		select_group(dimension_index, 0, block_user=false);
	}
}

function merge_data(songs, scores){
	for(let song_index=0; song_index<songs.length; song_index++){
		songs[song_index]["passed"] = 0;
	}

	// brute force because im lazy
	for(let score_index=0; score_index<scores.length; score_index++){
		for(let song_index=0; song_index<songs.length; song_index++){
			if ((scores[score_index]["id"] == songs[song_index]["id"]) && (scores[score_index]["diff"] == songs[song_index]["diff"])){
				songs[song_index]["passed"] = 1;
				songs[song_index]["score"] = scores[score_index];
				break;
			}
		}
	}
	return songs;
}
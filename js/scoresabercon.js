all_songs_api_url = "https://www.scoresaber.com/api.php?function=get-leaderboards&cat=3&page=1&limit=1000"

async function getAllRankedMaps(){

	$.ajax(all_songs_api_url, {
        success: function (data, status, xhr) {// success callback function
        	console.log(data["songs"][0]);
        	return data;           
		},		
	});
}
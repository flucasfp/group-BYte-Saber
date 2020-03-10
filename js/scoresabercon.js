server_url = "http://18.212.147.154";

function getAllRankedMaps(){

	return new Promise(function(resolve, reject){
		$.ajax(server_url+"/allsongs", {
        	success: function (data, status, xhr) {// success callback function
        		resolve(JSON.parse(data)["songs"]);
        	},		
		})
	});
}

function getAllUserData(user_id){

	return new Promise(function(resolve, reject){
		$.ajax(server_url+"/history?user_id="+user_id, {
        	success: function (data, status, xhr) {// success callback function
        		resolve(data);
        	},		
		})

	});

}

async function getData(user_id){
	return Promise.all([getAllRankedMaps(), getAllUserData(user_id)])
}
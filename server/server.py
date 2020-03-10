from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import requests, json

app = Flask(__name__)
cors = CORS(app)

# SORRY UMBRA PLEASE DONT HURT ME

@app.route('/allsongs')
def all_songs():
	all_songs_url = "https://www.scoresaber.com/api.php?function=get-leaderboards&cat=3&page=1&limit=1000"
	r = requests.get(all_songs_url)
	return r.text
	


@app.route('/history')
def user():
	user_id = request.args.get('user_id', '')
	
	user_history_url = "https://new.scoresaber.com/api/player/"+user_id+"/scores/top/"	
	user_profile_url = "https://new.scoresaber.com/api/player/"+user_id+"/full"
	current_page = 1
	data = []
	
	last_is_ranked = True
	while last_is_ranked:
		# print("Fetching page", current_page)
		r = requests.get(user_history_url+str(current_page))
		data.extend(json.loads(r.text)["scores"])

		if data[-1]["pp"] == 0:
			last_is_ranked = False

		current_page += 1

	# remove non-ranked elements, veeeery lazyly
	data = list(filter(lambda x: x["pp"] > 0, data))
	aggregate_data = {}
	aggregate_data["scores"] = data
	r = requests.get(user_profile_url)
	aggregate_data["profile"] = json.loads(r.text)

	return jsonify(aggregate_data)

app.run(host='0.0.0.0', port=80)

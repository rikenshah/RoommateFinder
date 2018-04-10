import json
import requests

# See flask app on pythonanywhere to host it somewhere

def auth(customer_id, api_key):
    try:
        credentials = {
            'customer_id': customer_id,
            'api_key': api_key
        }
        response = requests.post('https://api.applymagicsauce.com/auth', json=credentials)
        response.raise_for_status()
        return response.json()['token']
    except requests.exceptions.HTTPError as e:
        print e.response.json()


def predict_from_text(token, text):
    try:
        response = requests.post(url='https://api.applymagicsauce.com/text',
                                 params={
                                     'source': 'OTHER'
                                 },
                                 data=text,
                                 headers={'X-Auth-Token': token})
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        print e.response.json()


def predict_from_like_ids(token, like_ids):
    try:
        response = requests.post(url='https://api.applymagicsauce.com/like_ids',
                                 json=like_ids,
                                 headers={'X-Auth-Token': token})
        response.raise_for_status()
        if response.status_code == 204:
            raise ValueError('Not enough predictive like ids provided to make a prediction')
        else:
            return response.json()
    except requests.exceptions.HTTPError as e:
        print e.response.json()
    except ValueError as e:
        print e


# /auth
token = auth(3459, 'vmp75o3e1mqq9adt4968vqpdvv')

# /text
prediction_result = predict_from_text(token, "The world of computer science fascinates me. How a bunch of ones and zeros bundled with an enormous amount of creativity drives the technology at this time of the world is quite astonishing. From early on, my vision became clear to be a part of this community and contribute in whatever ways I can.Over the academic years, I have mastered a variety of software development skills and worked on numerous projects to enhance those skills. In my bachelor's course, I have developed a keen interest in fields of Natural Language Processing and Machine learning.I am focused on making computers talk. If we can converse with them swiftly and efficiently in natural language, I believe, we can overcome the last barrier to enter into a new era of technology and automation. Automation is the key to the evolution of computers and simultaneous development of human race, albeit with a right amount of control. (We don't want Transformers in real-life, though it would be pretty cool..!)")
print json.dumps(prediction_result, indent=4)

# /like ids
# prediction_result = predict_from_like_ids(token, ["5845317146", "6460713406", "22404294985", "35312278675",
#                                                   "105930651606", "171605907303", "199592894970", "274598553922",
#                                                   "340368556015", "100270610030980"])
# print json.dumps(prediction_result, indent=4)


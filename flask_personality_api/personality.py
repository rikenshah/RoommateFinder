import json
import requests

class Personality(object):
    def __init__(self):
        pass

    def auth(self,customer_id, api_key):
        try:
            credentials = {
                'customer_id': customer_id,
                'api_key': api_key
            }
            response = requests.post('https://api.applymagicsauce.com/auth', json=credentials)
            response.raise_for_status()
            return response.json()['token']
        except requests.exceptions.HTTPError as e:
            print(e.response.json())


    def predict_from_text(self,token, text):
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
            print(e.response.json())


    def predict_from_like_ids(self,token, like_ids):
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
            print(e.response.json())
        except ValueError as e:
            print(e)


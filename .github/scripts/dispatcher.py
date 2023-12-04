import requests
import os
import json

branch = os.getenv('BRANCH', '')
action = os.getenv('ACTION', '')
key = os.getenv('ACTIONS_KEY', '')

data = json.dumps({
    "event_type": action,
    "client_payload": {
        "branch": branch
    },
})
print(data)

response = requests.post(
    'https://api.github.com/repos/dvsa/cvs-tf-vtm/dispatches',
    headers={
        'Accept': 'application/vnd.github.everest-preview+json',
        'Authorization': 'Bearer {k}'.format(k=key)
    },
    data=data
).json

print(response)

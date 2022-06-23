from urllib import request
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        try:
            req_data = request.get_json()
            email = req_data['email']
            password = req_data['password']

            print(email, password)
            if(email=='admin@test.com' and password=='admin123'):
                return {
                    "message": "Logged In"
                }
            else:
                return "Wrong info", 403
        except KeyError:
            print("Could not find essential info required to login")
    return 'Something went wrong', 500

if __name__=='__main__':
    app.run(debug=True)

    
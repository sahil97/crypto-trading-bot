from crypt import methods
from urllib import request
from flask import Flask, request
from flask_cors import CORS
from pymongo import MongoClient
from bot import run_bot
import bcrypt
import json

MONGO_URI = 'mongodb://localhost:27017/'
DB_NAME = 'cryptobot'

app = Flask(__name__)
CORS(app)


app.config['SECRET_KEY'] = 'crypto'

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users = db['users']

@app.route("/signup", methods=['POST'])
def signup():
    if request.method == 'POST':
        req_data = request.get_json()
        signup_user = users.find_one({
            'email': req_data['email']
        })
        
        if signup_user:
            return {
                "message": "User already exists"
            }
         
        hashed = bcrypt.hashpw(req_data['password'].encode('utf-8'), bcrypt.gensalt(14))
        inserted_id = users.insert_one({'email': req_data['email'], 'password': hashed}).inserted_id
        
    return {
        "message": "User added"
    }

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        try:
            req_data = request.get_json()
            email = req_data['email']
            password = req_data['password']
            signin_user = users.find_one({'email': email})

            if signin_user:
                if bcrypt.checkpw(password.encode('utf-8'), signin_user['password']):
                    return {
                        "message": "Logged In",
                        "email": email
                    }
                else:
                    return {
                        "message": "Wrong credentials"
                    }
            else:
                return "Wrong info", 403
        except KeyError:
            print("Could not find essential info required to login")
    return 'Something went wrong', 500

@app.route('/autobot', methods=['POST'])
def autobot():
    result = []
    try:
        req_data = request.get_json()
        coin_name = req_data['coin']
        start_date = req_data['startDate']
        end_date = req_data['endDate']

        print(coin_name, start_date, end_date)

        buys, sells, balance_amount, balance_unit = run_bot(coin=coin_name, start_date=start_date, end_date=end_date)
        return {
            'buys': buys,
            'sells': sells,
            'balance_amount': balance_amount,
            'balance_unit': balance_unit
        }

    except Exception as e:
        print(e)
        return "Wrong or incomplete info", 403

    return result

@app.route('/details', methods=['POST'])
def get_details():
    acc_details = {}
    try:
        req_data = request.get_json()
        user = users.find_one({
            'email': req_data['email']
        })
        acc_details['email'] = user['email']
        acc_details['password'] = user['password']
    except Exception as e:
        print(e)
        return "Error"

    return json.dumps(acc_details, default=str)


# def check_login_details(username, password):


if __name__=='__main__':
    app.run(debug=True)

    
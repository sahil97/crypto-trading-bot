from urllib import request
from flask import Flask, request
from flask_cors import CORS
from bot import run_bot

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

if __name__=='__main__':
    app.run(debug=True)

    
from flask import Flask, send_file, request, make_response, jsonify, abort
import random
import jwt
import secret

app = Flask(__name__)
key = secret.key


def blackjack(cards):
    score = 0
    aces = []
    for card in cards:
        card2 = card % 13 + 1
        if card2 == 1:
            aces.append(card2)
        elif card2 >= 10:
            score += 10
        else:
            score += card2

    for a in aces:
        if score + 11 <= 21:
            score += 11
        else:
            score += 1

    if score > 21:
        return -1
    return score


@app.route("/")
def index():
    return send_file("index.html")


@app.route("/card/<int:card_id>.png")
def card(card_id):
    return send_file('images/{}.png'.format(card_id))


@app.route("/initialize", methods=["POST"])
def initialize():
    cards = list(range(13 * 4))
    random.shuffle(cards)

    player_cards = [cards[0]]
    dealer_cards = [cards[1]]
    player_score = blackjack(player_cards)
    dealer_score = blackjack(dealer_cards)
    state = {
        'player': player_cards,
        'dealer': dealer_cards,
        'chip': 100,
        'player_score': player_score,
        'dealer_score': dealer_score,
    }

    response = make_response(jsonify(state))
    state['cards'] = cards[2:]
    response.set_cookie('matsushima', jwt.encode(state, key, algorithm='HS256'), httponly=True, samesite='strict')
    return response


@app.route("/hit", methods=["POST"])
def hit():
    state = request.cookies.get('matsushima', None)
    if state is None:
        return abort(400)

    state = jwt.decode(state, key, algorithms=['HS256'])
    if state['chip'] <= 0:
        return abort(400)

    next_card = random.randrange(0, len(state['cards']))
    card = state['cards'][next_card]
    state['cards'] = state['cards'][:next_card] + state['cards'][next_card+1:]

    state['player'] = state['player'] + [card]
    state['player_score'] = blackjack(state['player'])
    if state['player_score'] < 0:
        state['chip'] = 0

    response = make_response(jsonify({
        'player': state['player'],
        'dealer': state['dealer'],
        'chip': state['chip'],
        'player_score': state['player_score'],
        'dealer_score': state['dealer_score'],
    }))

    response.set_cookie('matsushima', jwt.encode(state, key, algorithm='HS256'), httponly=True, samesite='strict')
    return response


@app.route("/stand", methods=["POST"])
def stand():
    state = request.cookies.get('matsushima', None)
    if state is None:
        return abort(400)

    state = jwt.decode(state, key, algorithms=['HS256'])
    if state['chip'] <= 0:
        return abort(400)

    while True:
        next_card = random.randrange(0, len(state['cards']))
        card = state['cards'][next_card]
        state['cards'] = state['cards'][:next_card] + state['cards'][next_card+1:]

        state['dealer'] = state['dealer'] + [card]
        state['dealer_score'] = blackjack(state['dealer'])
        if state['dealer_score'] < 0 or state['dealer_score'] >= 17:
            break

    if state['dealer_score'] < state['player_score']:
        state['chip'] = state['chip'] * 2
    else:
        state['chip'] = 0

    response = make_response(jsonify({
        'player': state['player'],
        'dealer': state['dealer'],
        'chip': state['chip'],
        'player_score': state['player_score'],
        'dealer_score': state['dealer_score'],
    }))

    response.set_cookie('matsushima', jwt.encode(state, key, algorithm='HS256'), httponly=True, samesite='strict')
    return response


@app.route("/nextgame", methods=["POST"])
def nextgame():
    state = request.cookies.get('matsushima', None)
    if state is None:
        return abort(400)

    state = jwt.decode(state, key, algorithms=['HS256'])
    if state['chip'] <= 0:
        return abort(400)

    if len(state['dealer']) < 2:
        return abort(400)

    if state['dealer_score'] >= state['player_score']:
        return abort(400)

    cards = list(range(13 * 4))
    random.shuffle(cards)
    state['player'] = [cards[0]]
    state['dealer'] = [cards[1]]
    state['cards'] = cards[2:]
    state['player_score'] = blackjack(state['player'])
    state['dealer_score'] = blackjack(state['dealer'])

    response = make_response(jsonify({
        'player': state['player'],
        'dealer': state['dealer'],
        'chip': state['chip'],
        'player_score': state['player_score'],
        'dealer_score': state['dealer_score'],
    }))

    response.set_cookie('matsushima', jwt.encode(state, key, algorithm='HS256'), httponly=True, samesite='strict')
    return response


@app.route('/flag')
def flag():
    state = request.cookies.get('matsushima', None)
    if state is None:
        return abort(400)

    state = jwt.decode(state, key, algorithms=['HS256'])
    if state['chip'] >= 999999:
        return jsonify({
            'flag': secret.flag,
        })
    else:
        return abort(400)


if __name__ == '__main__':
    from gevent import monkey
    monkey.patch_all()

    from gevent.pywsgi import WSGIServer

    http_server = WSGIServer(('0.0.0.0', 5000), app)
    http_server.serve_forever()

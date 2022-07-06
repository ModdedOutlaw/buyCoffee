let waxUser;

let txID = '';

let waxObj;

let session;

//let current_price_of_wax = 0;

//let current_price_of_coffee = 0;

let total_sent;

//sessionStorage.setItem('usd_price','18.99');


//automatically check for credentials
//autoLogin();


checkPriceofwax();

const wax = new waxjs.WaxJS({
    rpcEndpoint: 'https://wax.greymass.com'
});



//checks if autologin is available 
async function autoLogin() {
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    if (isAutoLoginAvailable) {
        let userAccount = wax.userAccount;
        let pubKeys = wax.pubKeys;

    } else {
        //document.getElementById('autologin').insertAdjacentHTML('beforeend', 'Not auto-logged in');
    }
}

//normal login. Triggers a popup for non-whitelisted dapps
async function loginWCW() {
    try {


        //if autologged in, this simply returns the userAccount w/no popup
        let userAccount = await wax.login();

        checkBalance(userAccount);
        let pubKeys = wax.pubKeys;
        //let str = 'Account: ' + userAccount + '<br/>Active: ' + pubKeys[0] + '<br/>Owner: ' + pubKeys[1]


        await wax.login(identifier).then((result) => {
            console.log("--------" + result);

            document.body.classList.add('logged-in');
            document.body.classList.remove('logged-in-wcw');

            // document.getElementById('wax-addr').textContent = result;
            document.getElementById('account-name').textContent = userAccount;

            session = wax;

            let waxString = JSON.stringify(wax);

            waxObj = JSON.parse(waxString);

            console.log('WAXOBJ: ' + wax.userAccount);
            waxUser = wax.userAccount;
            sessionStorage.setItem('name', waxUser);

            //didLogin();
        })
    } catch (e) {
        console.log("++++++" + e);
    }


}

function logoutWCW() {
    console.log("LOGOUT WCW");

    document.body.classList.remove('logged-in-wcw');


    //session.remove();
    //location.reload()
    sessionStorage.clear();
    localStorage.clear();
    document.location.reload();
}

async function transferWaxWCW() {

    try {

        total_sent = "0.01000000";
        // total_sent = sessionStorage.getItem('final_price_wax');
        let text2 = "WAX";
        let send_amount = total_sent.concat(" ", text2);



        if (anchorLogin) {
            console.log('Key Type = ' + keyType);
            const resultTrans = await link.transact({
                actions: [{
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: waxUser,
                        permission: keyType,
                    }],
                    data: {
                        from: waxUser,
                        to: 'd.2b4.wam',
                        quantity: send_amount,
                        memo: 'Thanks for the coffee!'
                    },
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30
            });

            txID = resultTrans.payload.tx;

            const resultsJson = JSON.stringify(resultTrans, getCircularReplacer());

            console.log('RESULTS -----> ' + resultsJson);

            txID = resultTrans.payload.tx;

            if (resultTrans.processed.receipt.status == 'executed') {
                document.getElementById("pay").style.display = "none";
                document.getElementById("ship").style.display = "block";
                document.getElementById("shipping-form").style.display = "block";
                document.getElementsByClassName('shopping-cart')[0].style.display = "none";


            }


        } else {
            const resultTrans = await wax.api.transact({
                actions: [{
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: waxUser,
                        permission: 'active',
                    }],
                    data: {
                        from: waxUser,
                        to: 'd.2b4.wam',
                        quantity: send_amount,
                        memo: 'Thanks for the coffee!'
                    },
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30
            });

            txID = resultTrans.transaction_id;

            if (resultTrans.processed.receipt.status == 'executed') {
                document.getElementById("pay").style.display = "none";
                document.getElementById("ship").style.display = "block";
                document.getElementById("shipping-form").style.display = "block";
                document.getElementsByClassName('shopping-cart')[0].style.display = "none";

            }
        }


    } catch (e) {
        console.log(e);
        document.getElementById('response').append(e.message);
    }


    return txID;

}

function hideBtn() {
    document.getElementById("pay").style.display = "none";
    document.getElementById("ship").style.display = "none";
}

async function checkTransaction(id) {


    await fetchTransaction(id).then(transaction_info => {
        return transaction_info.executed;
    });

}



async function checkBalance(wam) {


    await fetchBalance(wam).then(balance_info => {
        console.log("INFO--->" + JSON.stringify(balance_info.balances));

        const balanceJson = JSON.stringify(balance_info.balances);

        balanceObj = JSON.parse(balanceJson);
        const result = balanceObj.find(({
            currency
        }) => currency === 'WAX');
        console.log(result.amount);

        let balance = Number(result.amount).toFixed(2).toString();

        document.getElementById('user-balance').textContent = balance;
        document.getElementById("wax-balance").style.display = "block";


        return balance;
    });

}


async function fetchBalance(wam) {

    const response = await fetch('https://lightapi.eosamsterdam.net/api/balances/wax/' + wam);

    const balance = await response.json();

    return balance;

}


async function fetchTransaction(transaction_id) {

    const response = await fetch('https://api.waxsweden.org:443/v2/history/get_transaction?id=' + transaction_id);

    const transaction = await response.json();

    return transaction;

}

async function fetchWaxPrice() {

    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=wax&vs_currencies=usd');

    const wax_price = await response.json();

    return wax_price;

}

async function checkPriceofwax() {


    await fetchWaxPrice().then(price => {

        let current_price_of_wax = price.wax.usd;

        //localStorage.setItem('price_wax',price.wax.usd);
        sessionStorage.setItem('wax_price', price.wax.usd);

        console.log('PRICE OF WAX --- ' + sessionStorage.getItem('wax_price'));





        let usd_price = 18.99;

        let current_price_of_coffee = (usd_price / current_price_of_wax).toFixed(8);

        console.log(current_price_of_coffee);

        document.getElementById('wax-price').textContent = current_price_of_wax;
        document.getElementById('dollar-cost').textContent = usd_price;
        document.getElementById('wax-cost').textContent = current_price_of_coffee;

        return current_price_of_coffee;
    });

}





//ANCHOR LOGIN SECTION

// app identifier, should be set to the eosio contract account if applicable
const identifier = 'moddedoutlaw';
// initialize the browser transport
const transport = new AnchorLinkBrowserTransport();
// initialize the link
const link = new AnchorLink({
    transport,
    chains: [{
        chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
        nodeUrl: 'https://wax.greymass.com',
    }]
});
// the session instance, either restored using link.restoreSession() or created with link.login()
let sessionA;

let loginObj;

let linkObj;

let anchorLogin = false;

let keyType = '';

// tries to restore session, called when document is loaded
function restoreSession() {
    link.restoreSession(identifier).then((result) => {
        sessionA = result;
        if (sessionA) {
            didLogin();
        }
    })
}

// login and store session if sucessful
function login() {

    link.login(identifier).then((result) => {
        console.log(result);
        keyType = result.payload.sp;
        sessionA = result.session;
        didLogin();
    })
}

// logout and remove session from storage
function logout() {
    document.body.classList.remove('logged-in');
    sessionStorage.clear();
    document.location.reload();
    sessionA.remove();


}

// called when session was restored or created
function didLogin() {


    document.getElementById('account-name').textContent = sessionA.auth.actor;
    sessionStorage.setItem('name', waxUser);

    checkBalance(sessionA.auth.actor);


    document.body.classList.add('logged-in');
    document.body.classList.remove('app-ui');
    document.body.classList.remove('logged-in-wcw');

    const loginJson = JSON.stringify(sessionA, getCircularReplacer());
    loginObj = JSON.parse(loginJson);

    console.log("SESSION INFO: " + loginObj);

    const linkJson = JSON.stringify(link, getCircularReplacer());

    linkObj = JSON.parse(linkJson);

    waxUser = sessionA.auth.actor;

    sessionStorage.setItem('name', waxUser);

    anchorLogin = true;



}

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

async function buyCoffee() {

    let transfer_id = await transferWaxWCW();

    console.log('transaction id = ' + transfer_id);

    sessionStorage.setItem('transferId', transfer_id)

}
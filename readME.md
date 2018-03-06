 Welcome to block chain technology!!

Everything about Block Chain
[a link] https://blockgeeks.com/guides/what-is-blockchain-technology/

Ethereum:-
 [a link ] https://blockgeeks.com/guides/ethereum/
 
Smart Contracts:
  [a link] https://blockgeeks.com/guides/smart-contracts/

Solidity:

[a link] http://solidity.readthedocs.io/en/v0.4.20/


web3.js :

[a link] https://web3js.readthedocs.io/en/1.0/

nodeJS :
[a link] https://www.w3schools.com/nodejs/default.asp

Follow the steps:
step 1 :
    download gitbash for easy installation of packages required
    mkdir Remix_tool //create a directory called Remix_tool
    cd Remix_tool //change directory to Remix_tool
    git clone https://github.com/ethereum/browser-solidity //downloading solidity browser
    Install npm:
        sudo apt-get install nodejs //installing node.js
        sudo apt-get install npm // installing Node Package Manager
        sudo ln -s /usr/bin/nodejs /usr/bin/node //Create a symbolic link for node
    cd browser-solidity
        npm install
        npm run prepublish


step 2:
    clone the project and open the folder in gitbash
    now u need to install the packages , for that "npm install yarn" & "yarn init" commands are used
    install nodemon local server ("npm install nodemon")


step 3:
    run the solidity code in remix IDE and copy the ABI & contract Address and paste then in app.js 
    now in the console run the server (nodemon app.js)
    open the browser and follow the link (http://127.0.0.1:3000/account)


Private Block Chain:


1. Install geth cli 
    windows (download the .exe file from official site and install)
    ubuntu :
    Follow the commands:
        1. sudo apt-get install software-properties-common
        2. sudo add-apt-repository -y ppa:ethereum/ethereum
        3. sudo apt-get update
        4. sudo apt-get install ethereum


2. Open your gitbash and init the genesis file :
    geth --datadir "chain1" init "genesis.json"

3. Run the geth console in "8545" rpc port,
    geth --datadir "chain1" --port 30303 --networkid 1234 --rpc --rpcport "8545" --rpccorsdomain "*" console 2>console.log
    create few accounts
        personal.newAccount()
            //parsephrase (password)
        eth.setEtherbase(personal.listAccounts[0])
    start mining
        miner.start(4) //parameter indicates no. of threads for mining

3. Inthe remix IDE change the environment to web3 provider frrom javaScript




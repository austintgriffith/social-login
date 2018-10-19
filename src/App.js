import React, { Component } from 'react';
import './App.css';
import { Metamask, Gas, ContractLoader, Transactions, Events, Scaler, Blockie, Address, Button } from "dapparatus"
import Web3 from 'web3';
import SocialButton from './SocialButton'
import cookie from 'react-cookies'
var request = require("request");

const handleSocialLoginFailure = (err,a) => {
  console.error("GITHUB ERR",err,a)
}

class App extends Component {
  constructor(props) {
    super(props);
    let githubToken = cookie.load('githubToken');

    this.state = {
      web3: false,
      account: false,
      gwei: 4,
      doingTransaction: false,
      githubToken: githubToken,
      github: false
    }
  }
  componentDidMount(){
    if(this.state.githubToken){
      console.log("Looking up token",this.state.githubToken)
      request('http://localhost:8000/github/'+this.state.githubToken, (error, response, body) => {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        let github = JSON.parse(body)
        console.log("github:",github)
        this.setState({github:github})
      });
    }
  }
  handleInput(e){
    let update = {}
    update[e.target.name] = e.target.value
    this.setState(update)
  }
  handleSocialLogin(user){
    console.log("GITHUB USER",user._token.accessToken)
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);
    cookie.save('githubToken', user._token.accessToken, {
      path: '/',
      expires
    });
    window.location = "/"
  }
  render() {
    let {web3,account,contracts,tx,gwei,block,avgBlockTime,etherscan} = this.state
    let connectedDisplay = []
    let contractsDisplay = []
    if(web3){
      connectedDisplay.push(
       <Gas
         key="Gas"
         onUpdate={(state)=>{
           console.log("Gas price update:",state)
           this.setState(state,()=>{
             console.log("GWEI set:",this.state)
           })
         }}
       />
      )

      connectedDisplay.push(
        <ContractLoader
         key="ContractLoader"
         config={{DEBUG:true}}
         web3={web3}
         require={path => {return require(`${__dirname}/${path}`)}}
         onReady={(contracts,customLoader)=>{
           console.log("contracts loaded",contracts)
           this.setState({contracts:contracts},async ()=>{
             console.log("Contracts Are Ready:",this.state.contracts)
           })
         }}
        />
      )
      connectedDisplay.push(
        <Transactions
          key="Transactions"
          config={{DEBUG:false}}
          account={account}
          gwei={gwei}
          web3={web3}
          block={block}
          avgBlockTime={avgBlockTime}
          etherscan={etherscan}
          onReady={(state)=>{
            console.log("Transactions component is ready:",state)
            this.setState(state)
          }}
          onReceipt={(transaction,receipt)=>{
            // this is one way to get the deployed contract address, but instead I'll switch
            //  to a more straight forward callback system above
            console.log("Transaction Receipt",transaction,receipt)
          }}
        />
      )

      if(!this.state.github){
        if(!this.state.githubToken){
          connectedDisplay.push(
            <div>
              <SocialButton
                provider='github'
                appId='a11894effd87799f8a5d'
                gatekeeper='http://localhost:9999'
                redirect='http://localhost:3000'
                onLoginSuccess={this.handleSocialLogin.bind(this)}
                onLoginFailure={handleSocialLoginFailure}
              >
                Login
              </SocialButton>
            </div>
          )
        }else{
          connectedDisplay.push(
            <div>
              loading...
            </div>
          )
        }

      }else{
        connectedDisplay.push(
          <div>
            <img src={this.state.github.user.avatar_url} />
          </div>
        )
      }


      /*
      if(contracts){
        contractsDisplay.push(
          <div key="UI" style={{padding:30}}>
            <div>
              <Address
                {...this.state}
                address={contracts.YOURCONTRACT._address}
              />
            </div>
            broadcast string: <input
                style={{verticalAlign:"middle",width:400,margin:6,maxHeight:20,padding:5,border:'2px solid #ccc',borderRadius:5}}
                type="text" name="broadcastText" value={this.state.broadcastText} onChange={this.handleInput.bind(this)}
            />
            <Button color={this.state.doingTransaction?"orange":"green"} size="2" onClick={()=>{
                this.setState({doingTransaction:true})
                //tx(contracts.YOURCONTRACT.YOURFUNCTION(YOURARGUMENTS),(receipt)=>{
                //  this.setState({doingTransaction:false})
                //})
              }}>
              Send
            </Button>
            <Events
              config={{hide:false}}
              contract={contracts.YOURCONTRACT}
              eventName={"YOUREVENT"}
              block={block}
              onUpdate={(eventData,allEvents)=>{
                console.log("EVENT DATA:",eventData)
                this.setState({events:allEvents})
              }}
            />
          </div>
        )
      }
      */
    }
    return (
      <div className="App">
        <Metamask
          config={{requiredNetwork:['Unknown','Rinkeby']}}
          onUpdate={(state)=>{
           console.log("metamask state update:",state)
           if(state.web3Provider) {
             state.web3 = new Web3(state.web3Provider)
             this.setState(state)
           }
          }}
        />
        {connectedDisplay}
        {contractsDisplay}
      </div>
    );
  }
}

export default App;

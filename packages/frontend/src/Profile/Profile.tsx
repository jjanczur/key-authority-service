import * as React from 'react';
import Blockies from 'react-blockies';
import { Table } from 'reactstrap';
import { Button } from 'reactstrap';
let download = require('downloadjs');

// import Web3 from 'web3';
import getWeb3 from './getWeb3';

import * as DappToken from "./contracts/DappToken.json";
import * as DigitalContentContract from "./contracts/DigitalContentContract.json";
import * as ContentContractFactory from "./contracts/ContentContractFactory.json";

// import hamlet from '../data/Hamlet.txt';
// import romeo from '../data/Romeo-and-Juliet.txt';
// import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Auth } from '../types';
import './Profile.css';

const jwtDecode = require('jwt-decode');

interface Props {
  auth: Auth;
  onLoggedOut: () => void;
}

interface State {
  loading: boolean;
  user?: {
    id: number;
    username: string;
  };
  username: string;
  availableContent?: any[];
  _hamletToken?: any;
  _romeoToken?: any;
  web3?: any;
}

export class Profile extends React.Component<Props, State> {
  state: State = {
    loading: false,
    user: undefined,
    username: '',
    availableContent: []
  };

  async componentDidMount() {
    const {
      auth: { accessToken }
    } = this.props;
    const {
      payload: { id }
    } = jwtDecode(accessToken);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(user => this.setState({ user }))
      .catch(window.alert);

    const web3 = await getWeb3();
    if(web3 === undefined){
      throw new Error("No metamask client. Please setup metamask first.")
    }

    const _romeoToken = new web3.eth.Contract(
      DappToken.abi,
      process.env.REACT_APP_ROMEO_TOKEN
    );

    this.setState({ _romeoToken, web3 });


    // Use web3 to get the user's accounts.
    // const accounts = await web3.eth.getAccounts();
    await this.displayContent();
  }

  handleChange = ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: value });
  };

   displayContent = async () => {
    const { web3, _romeoToken} = this.state;
    const _hamletToken = new web3.eth.Contract(
      DappToken.abi,
      process.env.REACT_APP_HAMLET_TOKEN
    );

    this.setState({ _hamletToken });

     const coinbase = await web3.eth.getCoinbase();

     if (!coinbase) {
       window.alert("Please activate MetaMask first.");
     }

     const publicAddress = coinbase.toLowerCase();

    const hamletName = await _hamletToken.methods.name().call();
    const hamletOwned = await _hamletToken.methods
      .balanceOf(publicAddress)
      .call();

    const romeoName = await _romeoToken.methods.name().call();
    const romeoOwned = await _romeoToken.methods
      .balanceOf(publicAddress)
      .call();


    let files: any[];
    let romeo: [string, number, string];
    let hamlet: [string, number, string];
     romeo = [romeoName, Number(romeoOwned), "romeo"];
     hamlet = [hamletName, Number(hamletOwned), "hamlet"];
    // <Button color="primary"> Get a Book </Button>;
    files = [];
    Number(hamletOwned) === 0 ? null : files.push(hamlet);
    Number(romeoOwned) === 0 ? null : files.push(romeo);

    this.setState({ availableContent: files });
  };

  async handleGet(name: string) {
    const {
      auth: { accessToken }
    } = this.props;
    const { user, username } = this.state;

    console.log(name)
    if (!user) {
      window.alert(
        'The user id has not been fetched yet. Please try again in 5 seconds.'
      );
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/download`, {
      headers: {
        'Content-Type': 'text/example',
        'name': name
      },
      method: 'GET'
    })
      .then(function(resp) {
        return resp.blob();
      })
      .then(function(blob) {
        name === "romeo" ? download(blob, "Romeo-and-Juliet_decryption_key.txt", "text/txt") : download(blob, "Hamlet_decryption_key.txt", "text/txt");
      });

  }

  handleSubmit = () => {
    const {
      auth: { accessToken }
    } = this.props;
    const { user, username } = this.state;

    this.setState({ loading: true });

    if (!user) {
      window.alert(
        'The user id has not been fetched yet. Please try again in 5 seconds.'
      );
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`, {
      body: JSON.stringify({ username }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'PATCH'
    })
      .then(response => response.json())
      .then(user => this.setState({ loading: false, user }))
      .catch(err => {
        window.alert(err);
        this.setState({ loading: false });
      });
  };

  render() {
    const {
      auth: { accessToken },
      onLoggedOut
    } = this.props;
    const {
      payload: { publicAddress }
    } = jwtDecode(accessToken);
    const { loading, user, availableContent } = this.state;

    const username = user && user.username;

    return (
      <div className="Profile">
        <p>
          Logged in as <Blockies seed={publicAddress} />
        </p>
        <div>
          My username is {username ? <pre>{username}</pre> : 'not set.'} My
          publicAddress is <pre>{publicAddress}</pre>
        </div>
        <div>
          <label htmlFor="username">Change username: </label>
          <input name="username" onChange={this.handleChange} />
          <button disabled={loading} onClick={this.handleSubmit}>
            Submit
          </button>
        </div>
        <div>
          <Table>
            <thead>
              <tr>
                <th className="text-middle">Available keys</th>
                <th className="text-middle">Get a Key</th>
                <th className="text-middle">Number of owned pieces</th>
              </tr>
            </thead>
            <tbody>
              {availableContent != [] && availableContent != undefined
                ? availableContent.map((item, index) => (
                    <tr key={index}>
                      <th>{item[0]}</th>
                      <th>
                        {
                          <Button
                            color="primary"
                            onClick={async () => {
                              await this.handleGet(item[2]);
                            }}
                          >
                            Get a Key
                          </Button>
                        }
                      </th>
                      <th>{item[1]}</th>
                    </tr>
                  ))
                : null}
            </tbody>
          </Table>
        </div>
        <p>
          <button onClick={onLoggedOut}>Logout</button>
        </p>
      </div>
    );
  }
}

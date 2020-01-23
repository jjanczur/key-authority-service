import * as React from 'react';
import Blockies from 'react-blockies';
import { Table } from 'reactstrap';
import { Button } from 'reactstrap';
let download = require('downloadjs');

import Web3 from 'web3';
import getWeb3 from './getWeb3';

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
}

export class Profile extends React.Component<Props, State> {
  state: State = {
    loading: false,
    user: undefined,
    username: '',
    availableContent: []
  };

  componentDidMount() {
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
    this.displayContent();
  }

  handleChange = ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: value });
  };

  displayContent = () => {
    let files: any[];
    let romeo: [string, number];
    let hamlet: [string, number];
    romeo = ['romeoName', 4];
    hamlet = ['hamletName', 2];
    // <Button color="primary"> Get a Book </Button>;
    files = [];
    files.push(romeo);
    files.push(hamlet);

    this.setState({ availableContent: files });
  };

  async handleGet() {
    const {
      auth: { accessToken }
    } = this.props;
    console.log(accessToken);
    const { user, username } = this.state;

    if (!user) {
      window.alert(
        'The user id has not been fetched yet. Please try again in 5 seconds.'
      );
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/download`, {
      headers: {
        'Content-Type': 'text/example'
      },
      method: 'GET'
    })
      .then(function(resp) {
        return resp.blob();
      })
      .then(function(blob) {
        download(blob);
      });

    // .then(response => response.blob())
    // .then(res => {
    //   //Create a Blob from the Stream
    //   // console.log(res);
    //   const file = new Blob([res], {
    //     type: 'text/example'
    //   });
    //   //Build a URL from the file
    //   const fileURL = URL.createObjectURL(file);
    //   //Open the URL on new Window
    //   window.open(fileURL);
    // })
    // .catch(err => {
    //   window.alert(err);
    //   this.setState({ loading: false });
    // });
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
                <th className="text-middle">Available books</th>
                <th className="text-middle">Get a Book</th>
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
                              await this.handleGet();
                            }}
                          >
                            Get a Book
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

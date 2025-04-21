/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
import { apiKey } from "./apiKey";
import { JazzProvider } from "../jazz-solid";
import Auth from "./Auth";
import { TodoAccount, TodoProject } from "./schema";

const appName = "Jazz Todo List Example";
const root = document.getElementById('root');

render(() => <JazzProvider
      sync={{ peer: `wss://cloud.jazz.tools/?key=${apiKey}` }}
      AccountSchema={TodoAccount}
    >
      <Auth appName={appName}>
        <App />
      </Auth>
    </JazzProvider>, 
    root!);

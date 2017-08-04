import jsforce from 'jsforce';
import {SF_PROXY, SF_REDIRECT, SF_CLIENT_ID} from './constants';
const {jsforce0_instance_url, jsforce0_access_token} = localStorage;

export const __log = (text, obj) => 
  console.log(`%c [SFDC]: ${text}`, 'background: #fff; color: #9A67E1', obj ? obj : '');

export const isEmpty = obj =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

const localStorageLogin = () => {
  __log('CREDS FOUND - LOGGING YOU IN...\n');
  __log('> Access Token: ', localStorage.jsforce0_access_token);
  __log('> ID: ', localStorage.jsforce0_id);
  __log('> Instance URL ', localStorage.jsforce0_instance_url);
  __log('> Issued At: ', localStorage.jsforce0_issued_at);

  var conn = new jsforce.Connection({
    instanceUrl: localStorage.jsforce0_instance_url,
    accessToken: localStorage.jsforce0_access_token,
    proxyUrl: SF_PROXY,
    version: '40.0'
  });

  // API Connection
  return conn;
};

const windowLogin = () => {
  __log('[SFDC] NO CREDS - INITIATING WINDOW LOGIN')
  jsforce.browser.init({
    clientId: SF_CLIENT_ID,
    redirectUri: SF_REDIRECT,
    proxyUrl: SF_PROXY,
    version: '40.0'
  });
  jsforce.browser.login();
  const {connection} = jsforce.browser.on('connect', conn => conn);

  // Actual API Connection
  return connection;
};

export const hasCreds = (x, y) =>
  (x && y && (typeof x === 'string' && typeof y === 'string') ? true : false);

export const isSFInvalidSess = err => {
  if(typeof err === 'object') {
    return Object.values(err).filter(
      x => (x.includes('INVALID_SESSION_ID') ? true : false)
    );
  } 
  console.error('Unhandled error', err);
};

// Connection Logic
export const connect = (reset = false) => {
  const userCreds = hasCreds(jsforce0_access_token, jsforce0_instance_url);
  const loginType = reset ? windowLogin() : userCreds ? localStorageLogin() : windowLogin();
  
  return loginType;
};

export default connect;

/* eslint-disable semi */
import WebSocket from 'ws';

export default interface ClientInterface extends WebSocket {
  deviceDescriptor: string;
  name: string;
  os: string;
  hostname: string;
  ip: string;
  payload: [];
}

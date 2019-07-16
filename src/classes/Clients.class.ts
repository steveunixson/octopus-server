import WebSocket from 'ws';
import UUIDClass from '../helpers/UUID.class';
import ClientInterface from '../interfaces/Client.interface';
// please dear IDEA just commit it

export class ClientsClass {
  public clients: ClientInterface[] = [];

  public getClientsLength(): number {
    return this.clients.length;
  }

  public getClients(): ClientInterface[] {
    return this.clients;
  }

  public getClientByID(id: number): WebSocket {
    return this.clients[id];
  }

  public removeClient(): void {
    this.clients.pop();
  }

  public newClient(ws: ClientInterface): void {
    Object.defineProperty(ws, 'deviceDescriptor', {
      value: UUIDClass.generateUUID(), writable: true, enumerable: true, configurable: true,
    });
    this.clients.push(ws);
  }
}

export const clientArray = new ClientsClass();

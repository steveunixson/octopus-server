import WebSocket from 'ws';
import UUIDClass from '../helpers/UUID.class';

interface ClientIDInterface extends WebSocket {
  clientId: string;
}

// please dear IDEA just commit it

export class ClientsClass {
  public clients: WebSocket[] = [];

  public getClientsLength(): number {
    return this.clients.length;
  }

  public getClients(): WebSocket[] {
    return this.clients;
  }

  public getClientByID(id: number): WebSocket {
    const ID = this.clients[id] as ClientIDInterface;
    console.log(ID.clientId);
    return this.clients[id];
  }

  public removeClient(): void {
    this.clients.pop();
  }

  public newClient(ws: WebSocket): void {
    Object.defineProperty(ws, 'clientId', {
      value: UUIDClass.generateUUID(), writable: true, enumerable: true, configurable: true,
    });
    this.clients.push(ws);
  }
}

export const clientArray = new ClientsClass();

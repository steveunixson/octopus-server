import WebSocket from 'ws';

export class ClientsClass {
  public clients: WebSocket[] = [];

  public getClientsLength(): number {
    return this.clients.length;
  }

  public getClients(): WebSocket[] {
    return this.clients;
  }

  public getClientByID(id: number): WebSocket {
    return this.clients[id];
  }

  public removeClient(): void {
    this.clients.pop();
  }

  public newClient(ws: WebSocket): void {
    this.clients.push(ws);
  }
}

export const clientArray = new ClientsClass();

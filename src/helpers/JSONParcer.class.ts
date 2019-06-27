export interface Schema {
  data: {
    deviceDescriptor: string;
    name: string;
    os: string;
    hostname: string;
    ip: string;
  };
}

export class JSONParcer {
  public static serialize(event: string, data: Schema): string {
    const json = [event, data];
    return JSON.stringify(json);
  }

  public static deserialize(jsonString: string): Schema {
    return JSON.parse(jsonString);
  }
}

import uuidv4 from 'uuid/v4';

export default class UUIDClass {
  // please dear IDEA just commit it
  public static generateUUID(): string {
    const v4options = {
      random: [
        0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea,
        0x71, 0xb4, 0xef, 0xe1, 0x67, 0x1c, 0x58, 0x36,
      ],
    };
    return uuidv4(v4options);
  }
}

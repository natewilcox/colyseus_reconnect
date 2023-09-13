import { Schema, type, ArraySchema } from "@colyseus/schema";

export class PublicRoomState extends Schema {

    @type('number')
    index: number = 0;
}

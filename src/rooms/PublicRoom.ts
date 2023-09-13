import { Room, Client } from "@colyseus/core";
import { PublicRoomState } from "./schema/PublicRoomState";

export class PublicRoom extends Room<PublicRoomState> {
  
    maxClients = 2;

    onCreate (options: any) {

        console.log("room", this.roomId, "created...");
        this.setState(new PublicRoomState());
        this.autoDispose = false;

        setInterval(() => {
            this.state.index++;
        }, 1000);
    }

    onJoin (client: Client, options: any) {
        console.log(client.sessionId, "joined!");
        this.lock();
    }

    async onLeave (client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");

        try {

            console.log("allowing reconnect to " + client._reconnectionToken);
            const reconnection = await this.allowReconnection(client, 60);
            console.log("reconnected");
        }
        catch(e) {
            console.log("timeout waiting for reconnect");
        }
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}

import { Request, Response } from './bot';
import { MiddlewareMaker, Turn } from './middlewareMaker';
import { IStorage } from './storage';

export interface IState<Conversation, User> {
    readonly conversation: Conversation;
    readonly user: User;
}

export class StateManager <Conversation = any, User = any> extends MiddlewareMaker<IState<Conversation, User>> {
    constructor (
        private storage: IStorage
    ) {
        super();
    }

    private static keyFromRequest(req: Request) {
        return `${req.channelID}.${req.conversationID}.${req.userID}`;
    }

    getTurn(
        req: Request,
        res: Response
    ) {
        const artifact: IState<Conversation, User> = this.storage.get(StateManager.keyFromRequest(req)) || {
            conversation: {},
            user: {}
        };

        return {
            artifact,
            dispose() {
                this.storage.set(StateManager.keyFromRequest(req), artifact);
                return Promise.resolve();
            }
        };
    }
}

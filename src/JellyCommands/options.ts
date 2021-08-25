import { MessagePayload } from 'discord.js';
import Joi from 'joi';

export const schema = Joi.object({
    /**
     * Customisable responses
     */
    messages: Joi.object({
        /**
         * This is sent when a unkown command is given
         */
        unknownCommand: [
            Joi.string(),
            Joi.object().instance(MessagePayload),
            Joi.object(),
        ],
    }).default(),
});

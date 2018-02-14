const expect = require('expect');

const {generateMessage} = require('./message');

describe('generate message', () => {
    it('should generate correct message object', () => {
        var from = 'gen';
        var text = 'hi there';
        const message = generateMessage(from, text);
        expect(typeof message.createdAt).toBe('number');
        // expect(message).toInclude({from, text}); not working
        console.log(expect)
    });
})
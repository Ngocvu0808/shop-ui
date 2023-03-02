import {JoinPipe} from './join.pipe';

describe('JoinPipe', () => {
    let pipe = new JoinPipe();

    describe('when input value is an array', () => {
        const testInput = ['this', 'was', 'initially', 'an', 'array'];
        const testOutput = 'this was initially an array';
        it('tranforms input value into a string', () => {
            expect(pipe.transform(testInput)).toBe(testOutput);
        });
    });

    describe('when input value is not an array', () => {
        const testInput = {id: 1};
        it('returns the input value', () => {
            expect(pipe.transform(testInput)).toBe(testInput);
        });
    });
});

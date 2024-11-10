import { expect, it } from 'azle/test';
export function getTests(helloWorldCanister) {
    return () => {
        it('gets original message', async () => {
            const result = await helloWorldCanister.getMessage();
            expect(result).toBe('Hello world!');
        });
        it('sets a new message', async () => {
            const result = await helloWorldCanister.setMessage('Goodbye world!');
            expect(result).toBeUndefined();
        });
        it('gets persisted new message', async () => {
            const result = await helloWorldCanister.getMessage();
            expect(result).toBe('Goodbye world!');
        });
    };
}

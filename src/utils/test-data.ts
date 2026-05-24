export class TestDataGenerator {
    static generateUniqueEmail(prefix: string = 'test'): string {
        const timestamp = Date.now();
        return `${prefix}_${timestamp}@example.com`;
    }

    static generateUniqueUsername(prefix: string = 'user'): string {
        const timestamp = Date.now();
        return `${prefix}_${timestamp}`;
    }
}

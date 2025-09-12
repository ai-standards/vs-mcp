/**
 * A simple Greeting class that generates a greeting message.
 */
class Greeting {
    /**
     * Creates a new Greeting instance.
     * @param {string} name - The name to greet.
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Returns a greeting message.
     * @returns {string}
     */
    getMessage() {
        return `Hello, ${this.name}!`;
    }
}

// Example usage:
// const greet = new Greeting('VS-MCP User');
// console.log(greet.getMessage()); // Output: Hello, VS-MCP User!
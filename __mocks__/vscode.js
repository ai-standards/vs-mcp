// Manual mock for the 'vscode' module
module.exports = {
    window: {
        showInformationMessage: jest.fn(),
        showErrorMessage: jest.fn(),
        showWarningMessage: jest.fn(),
    },
    commands: {
        registerCommand: jest.fn(),
        executeCommand: jest.fn(),
    },
    workspace: {
        getConfiguration: jest.fn(),
    },
    ExtensionContext: jest.fn(),
};

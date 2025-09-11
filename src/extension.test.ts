import { describe, it, expect, vi } from 'vitest';
import * as vscode from 'vscode';

// Mock vscode module
vi.mock('vscode', () => ({
  window: {
    showInformationMessage: vi.fn()
  },
  commands: {
    registerCommand: vi.fn()
  },
  ExtensionContext: {}
}));

describe('Extension', () => {
  it('should register hello world command', () => {
    const mockRegisterCommand = vi.mocked(vscode.commands.registerCommand);
    
    // Import and activate the extension
    const { activate } = require('./extension');
    const mockContext = {
      subscriptions: []
    };
    
    activate(mockContext);
    
    expect(mockRegisterCommand).toHaveBeenCalledWith(
      'vs-mcp.helloWorld',
      expect.any(Function)
    );
  });

  it('should show information message when command is executed', () => {
    const mockShowInformationMessage = vi.mocked(vscode.window.showInformationMessage);
    const mockRegisterCommand = vi.mocked(vscode.commands.registerCommand);
    
    // Import and activate the extension
    const { activate } = require('./extension');
    const mockContext = {
      subscriptions: []
    };
    
    activate(mockContext);
    
    // Get the registered command callback
    const commandCallback = mockRegisterCommand.mock.calls[0][1];
    
    // Execute the command
    commandCallback();
    
    expect(mockShowInformationMessage).toHaveBeenCalledWith(
      'Hello World from AI Extension!'
    );
  });
});

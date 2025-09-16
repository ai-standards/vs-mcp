import { describe, it, expect, vi } from 'vitest';
import { activate } from './extension';

vi.mock('vscode', () => ({
  window: {
    showInformationMessage: vi.fn(),
    showInputBox: vi.fn().mockResolvedValue('test-api-key'),
    registerWebviewViewProvider: vi.fn(),
    showQuickPick: vi.fn().mockResolvedValue(undefined)
  },
  commands: {
    registerCommand: vi.fn()
  },
  workspace: {
    getConfiguration: vi.fn().mockReturnValue({ get: vi.fn().mockReturnValue('https://api.openai.com/v1') }),
    findFiles: vi.fn().mockResolvedValue([])
  },
  ExtensionContext: {}
}));

describe('Extension', () => {
  it('should activate without error', async () => {
    const mockContext = {
      subscriptions: [],
      workspaceState: {
        get: vi.fn(),
        update: vi.fn()
      },
      globalState: {
        get: vi.fn(),
        update: vi.fn()
      },
      extensionPath: '',
      asAbsolutePath: (p: string) => p,
      storagePath: '',
      globalStoragePath: '',
      logPath: '',
      extensionUri: {},
      environmentVariableCollection: {},
      secrets: {
        get: vi.fn().mockResolvedValue('test-api-key'),
        store: vi.fn()
      }
    };
    await expect(activate(mockContext)).resolves.not.toThrow();
  });
});

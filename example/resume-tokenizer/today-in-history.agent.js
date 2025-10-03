export const metadata = {
  id: 'write-article-about-history',
  name: 'Write Article About History',
  description: 'Generates an article about significant events that occurred on the current day in history.'
}

export const run = async ({ mcp, scope }) => {
  // Show a status message indicating that the article generation is starting
  await mcp.dispatch('status.showStatusBar', {
    message: 'Generating article about today in history...',
    id: 'generate-article',
    spinner: true
  });
  
  try {
    // Get the current date
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    // Generate a prompt for the AI to create an article
    const prompt = `Write a detailed article about significant historical events that occurred on ${dateString}.`;
    
    // Call the AI to generate the article text
    const article = await mcp.dispatch('ai.generateText', {
      prompt: prompt,
      maxTokens: 500 // Set a reasonable limit for the article length
    });
    
    // Dismiss the status message
    await mcp.dispatch('status.dismissStatus', { id: 'generate-article' });
    
    // Show the generated article to the user in an info message
    await mcp.dispatch('ui.showInfoMessage', { message: article.text });
  } catch (err) {
    // Handle any errors that occur during the process
    const msg = err && typeof err === 'object' && 'message' in err ? err.message : String(err);
    try {
      await mcp.dispatch('ui.showWarningMessage', { message: 'An error occurred: ' + msg });
    } catch {
      // Swallow to avoid unhandled rejections in extension host
    }
  }
}
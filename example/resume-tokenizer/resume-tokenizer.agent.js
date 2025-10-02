export const metadata = {
  id: 'tokenize-resumes',
  name: 'Resume Tokenizer',
  description: 'This agent tokenizes skills and experience from resumes to help identify key qualifications.'
}

export const run = async ({ mcp, scope }) => {
  
  // Show a status message indicating the start of the tokenization process
  await mcp.dispatch('status.showStatusBar', {
    message: 'Tokenizing resume for skills and experience...',
    id: 'tokenize',
    spinner: true
  });

  try {
    // Retrieve the active file's content, using scope.filepath if set
    let activeFile;
    if (scope && scope.filepath) {
      activeFile = await mcp.dispatch('fs.readFile', { path: scope.filepath });
    } else {
      activeFile = await mcp.dispatch('editor.activeFile');
    }
    const resumeContent = activeFile.text;

    const prompt = `
    You are evaluating programmer's skills based on their resumes. You will create a json file with an array of skills.

    Each skill will have the following attributes:

    - experience: this is an map of the last n years and whether they worked on this technology that year
    - category

    `

    console.log({resumeContent});

    // Tokenization logic: Extract skills and experience from the resume content
    const skills = extractSkills(resumeContent);
    const experience = extractExperience(resumeContent);

    // Dismiss the status message
    await mcp.dispatch('status.dismissStatus', { id: 'tokenize' });

    // Show the results to the user
    await mcp.dispatch('ui.showInfoMessage', { 
      message: `Extracted Skills: ${skills.join(', ')}\nExtracted Experience: ${experience.join(', ')}`
    });
  } catch (err) {
    // Handle any errors that occur during the process
    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
    await mcp.dispatch('ui.showWarningMessage', { message: 'An error occurred: ' + msg });
  }
};

// Helper function to extract skills from the resume content
function extractSkills(content) {
  // Placeholder logic for extracting skills
  // In a real implementation, this would involve parsing the content
  return content.match(/\b(skill1|skill2|skill3)\b/g) || [];
}

// Helper function to extract experience from the resume content
function extractExperience(content) {
  // Placeholder logic for extracting experience
  // In a real implementation, this would involve parsing the content
  return content.match(/\b(experience1|experience2|experience3)\b/g) || [];
}
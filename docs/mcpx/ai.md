# ai

## Generate Code

Generate new code from a natural language prompt, specifying language and style.

**Path:** src/tools/ai/generate-code.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| prompt | string | Yes |
| language | string | No |
| style | string | No |
| maxTokens | number | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| prompt | string | Yes |
| language | string | Yes |
| style | string | No |
| maxTokens | number | No |
| code | string | Yes |

## Generate Structured Data

Generate structured data (e.g., JSON) from a prompt and optional schema.

**Path:** src/tools/ai/generate-data.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| prompt | string | Yes |
| schema | string | No |
| maxTokens | number | No |
| model | string | No |
| temperature | number | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| prompt | string | Yes |
| schema | string | No |
| maxTokens | number | No |
| model | string | No |
| temperature | number | No |
| data | any | Yes |

## Generate Images

Generate images from a prompt using an AI model and optional parameters.

**Path:** src/tools/ai/generate-images.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| prompt | string | Yes |
| count | number | No |
| size | "512x512" | No |
| model | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| prompt | string | Yes |
| count | number | No |
| size | "512x512" | No |
| model | string | No |
| images | any[] | Yes |
| note | string | No |

## Generate Text

Generate plain text from a prompt.

**Path:** src/tools/ai/generate-text.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| prompt | string | Yes |
| maxTokens | number | No |
| model | string | No |
| temperature | number | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| prompt | string | Yes |
| maxTokens | number | No |
| model | string | No |
| temperature | number | No |
| text | string | Yes |

## Refactor Code

Refactor existing code based on instructions, language, and style.

**Path:** src/tools/ai/refactor-code.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| code | string | Yes |
| instructions | string | Yes |
| language | string | No |
| style | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| code | string | Yes |
| instructions | string | Yes |
| language | string | No |
| style | string | No |
| refactoredCode | string | Yes |

## Generate Tests

Generate unit tests for code using the specified framework and language.

**Path:** src/tools/ai/test-code.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| code | string | Yes |
| framework | string | No |
| language | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| code | string | Yes |
| framework | string | No |
| language | string | No |
| tests | string | Yes |

## Write Documentation

Write or update documentation for code in the specified format and audience.

**Path:** src/tools/ai/write-documentation.mcpx.ts

### Input
| Name | Type | Required |
| --- | --- | --- |
| code | string | Yes |
| format | string | No |
| audience | string | No |

### Output
| Name | Type | Required |
| --- | --- | --- |
| code | string | Yes |
| format | string | No |
| audience | string | No |
| docs | string | Yes |


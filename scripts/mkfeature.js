import fs from 'fs';
import path from 'path';

const [,, featureName] = process.argv;

if (!featureName) {
  console.error('Usage: npm run mkfeature <feature-name>');
  process.exit(1);
}

const toPascalCase = (str) => {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
};

const actionsDir = path.join('src/api/actions', featureName);
const controllersDir = path.join('src/api/controllers', featureName);

// Create directories
fs.mkdirSync(actionsDir, { recursive: true });
fs.mkdirSync(controllersDir, { recursive: true });

// Create actions index file
const actionsIndex = `// Auto-generated exports for ${featureName} actions
export {};
`;

fs.writeFileSync(path.join(actionsDir, 'index.ts'), actionsIndex);

// Create controller file
const controllerName = toPascalCase(featureName) + 'Controller';
const controllerContent = `import { NextRequest } from 'next/server';

export const ${controllerName} = {
  // Actions will be added here automatically
};
`;

fs.writeFileSync(path.join(controllersDir, 'index.ts'), controllerContent);

console.log(`✅ Feature '${featureName}' created successfully!`);
console.log(`📁 Created: src/api/actions/${featureName}/`);
console.log(`📁 Created: src/api/controllers/${featureName}/`);
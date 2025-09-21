import fs from 'fs';
import path from 'path';

const [,, feature, actionName, withParams] = process.argv;

if (!feature || !actionName) {
  console.error('Usage: npm run mkaction <feature> <action-name> [with-params]');
  process.exit(1);
}

const toCamelCase = (str) => {
  return str.split('-').map((word, index) => 
    index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
};

const toPascalCase = (str) => {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
};

const actionFunction = toCamelCase(actionName) + 'Action';
const actionsDir = path.join('src/api/actions', feature);
const controllersDir = path.join('src/api/controllers', feature);

// Check if feature exists
if (!fs.existsSync(actionsDir)) {
  console.error(`❌ Feature '${feature}' doesn't exist. Create it first with: npm run mkfeature ${feature}`);
  process.exit(1);
}

// Create action file
const actionParams = withParams === 'with-params' 
  ? `,\n  { params }: { params: { id: string } }`
  : '';

const actionContent = `import { NextRequest, NextResponse } from 'next/server';

export const ${actionFunction} = async (
  req: NextRequest${actionParams}
) => {
  try {
    // TODO: Implement ${actionName} logic here
    
    return NextResponse.json({
      success: true,
      message: '${actionName} executed successfully'
    });
  } catch (error) {
    console.error('${actionFunction} error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
};
`;

const actionFile = path.join(actionsDir, `${actionName}.action.ts`);
fs.writeFileSync(actionFile, actionContent);

// Update actions index file
const actionsIndexFile = path.join(actionsDir, 'index.ts');
const currentIndex = fs.readFileSync(actionsIndexFile, 'utf8');
const exportLine = `export { ${actionFunction} } from './${actionName}.action';`;

let newIndex;
if (currentIndex.includes('export {};')) {
  newIndex = currentIndex.replace('export {};', exportLine);
} else {
  newIndex = currentIndex + '\n' + exportLine;
}

fs.writeFileSync(actionsIndexFile, newIndex);

// Update controller file
const controllerFile = path.join(controllersDir, 'index.ts');
const controllerContent = fs.readFileSync(controllerFile, 'utf8');

const importMatch = controllerContent.match(/import.*from.*actions.*;\n/);
const importLine = `import { ${actionFunction} } from '../actions/${feature}';`;

let newController;
if (importMatch) {
  // Add to existing import
  const existingImport = importMatch[0];
  const updatedImport = existingImport.replace(/import\s*{([^}]*)}/, (match, imports) => {
    const cleanImports = imports.trim();
    const newImports = cleanImports ? `${cleanImports}, ${actionFunction}` : actionFunction;
    return `import { ${newImports} }`;
  });
  newController = controllerContent.replace(existingImport, updatedImport);
} else {
  // Add new import
  newController = controllerContent.replace(
    /import.*NextRequest.*\n/,
    `$&${importLine}\n`
  );
}

// Add action to controller object
const controllerMatch = newController.match(/export const \w+Controller = \{([^}]*)\}/s);
if (controllerMatch) {
  const controllerBody = controllerMatch[1];
  const actionKey = toCamelCase(actionName);
  const newControllerBody = controllerBody.trim() 
    ? `${controllerBody.trim()},\n  ${actionKey}: ${actionFunction}`
    : `\n  ${actionKey}: ${actionFunction}`;
    
  newController = newController.replace(
    /export const (\w+Controller) = \{([^}]*)\}/s,
    `export const $1 = {${newControllerBody}\n}`
  );
}

fs.writeFileSync(controllerFile, newController);

console.log(`✅ Action '${actionName}' added to feature '${feature}'!`);
console.log(`📄 Created: ${actionFile}`);
console.log(`📝 Updated: ${actionsIndexFile}`);
console.log(`📝 Updated: ${controllerFile}`);
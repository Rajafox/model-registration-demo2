
#!/bin/bash
echo "Installing TypeScript dependencies..."
npm install

echo "Compiling TypeScript files..."
npx tsc --outDir . --target ES5 interfaces.ts app.ts

echo "TypeScript compilation complete!"

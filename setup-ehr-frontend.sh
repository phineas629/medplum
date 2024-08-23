#!/bin/bash

# Function to print status messages
print_status() {
    echo "----------------------------------------"
    echo "$1"
    echo "----------------------------------------"
}

#TODO: don't automate for nextjs, nextauth, and react-native-example since they have their own setup scripts


# Create ehr-frontend directory if it doesn't exist
if [ ! -d "ehr-frontend" ]; then
    mkdir -p ehr-frontend
    print_status "Created ehr-frontend directory"
else
    print_status "ehr-frontend directory already exists"
fi

# Move example projects to ehr-frontend and rename them
for dir in examples/*; do
    if [ -d "$dir" ]; then
        new_name=$(basename "$dir" | sed 's/medplum-//g; s/-demo//g')
        if [ "$new_name" = "foomedical" ]; then
            new_name="core"
        fi
        target_dir="ehr-frontend/$new_name"
        if [ ! -d "$target_dir" ]; then
            mkdir -p "$target_dir"
            mv "$dir"/* "$target_dir/"
            rmdir "$dir"
            print_status "Moved and renamed $dir to $target_dir"
        else
            print_status "$target_dir already exists, skipping"
        fi
    fi
done

# Create package.json for ehr-frontend if it doesn't exist
if [ ! -f "ehr-frontend/package.json" ]; then
    cat << EOF > ehr-frontend/package.json
{
  "name": "ehr-frontend",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "core",
    "chat",
    "client-external-idp",
    "eligibility",
    "fhircast",
    "hello-world",
    "live-chat",
    "nextjs",
    "patient-intake",
    "photon-integration",
    "provider",
    "react-native-example",
    "scheduling",
    "task",
    "websocket-subscriptions"
  ],
  "scripts": {
    "build": "npm run build --workspaces --if-present",
    "dev": "npm run dev --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present",
    "test": "npm run test --workspaces --if-present"
  }
}
EOF
    print_status "Created package.json for ehr-frontend"
else
    print_status "package.json for ehr-frontend already exists"
fi

# Update root package.json
jq '
  .workspaces = [
    "packages/*",
    "ehr-frontend"
  ]
' package.json > temp.json && mv temp.json package.json
print_status "Updated root package.json"

# Create tsconfig.json for ehr-frontend if it doesn't exist
if [ ! -f "ehr-frontend/tsconfig.json" ]; then
    cat << EOF > ehr-frontend/tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF
    print_status "Created tsconfig.json for ehr-frontend"
else
    print_status "tsconfig.json for ehr-frontend already exists"
fi

# Create index.ts for ehr-frontend if it doesn't exist
if [ ! -f "ehr-frontend/index.ts" ]; then
    cat << EOF > ehr-frontend/index.ts

// Re-export sub-projects if needed
export { App as CoreApp } from './core/src/App';
export { App as HelloWorldApp } from './hello-world/src/App';
// ... other exports as needed
EOF
    print_status "Created index.ts for ehr-frontend"
else
    print_status "index.ts for ehr-frontend already exists"
fi

# Create standardized files
for template in index.html.template main.tsx.template vite.config.ts.template esbuild-script.mjs.template deploy-bots.ts.template; do
    if [ ! -f "ehr-frontend/${template%.template}" ]; then
        cp "ehr-frontend/$template" "ehr-frontend/${template%.template}"
        print_status "Created standardized ${template%.template}"
    else
        print_status "Standardized ${template%.template} already exists"
    fi
done

# Update individual projects
for project in ehr-frontend/*/; do
    project_name=$(basename "$project")
    print_status "Updating project: $project_name"

    # Copy standardized files if they don't exist
    for file in index.html main.tsx vite.config.ts; do
        if [ ! -f "$project/$file" ]; then
            cp "ehr-frontend/$file" "$project/$file"
            print_status "Copied $file to $project_name"
        else
            print_status "$file already exists in $project_name"
        fi
    done
    
    # Copy esbuild-script.mjs and deploy-bots.ts if needed
    if [ -f "$project/esbuild-script.mjs" ]; then
        cp ehr-frontend/esbuild-script.mjs "$project/esbuild-script.mjs"
        print_status "Updated esbuild-script.mjs for $project_name"
    else
        print_status "esbuild-script.mjs not found in $project_name"
    fi
    if [ -f "$project/src/scripts/deploy-bots.ts" ]; then
        cp ehr-frontend/deploy-bots.ts "$project/src/scripts/deploy-bots.ts"
        print_status "Updated deploy-bots.ts for $project_name"
    else
        print_status "deploy-bots.ts not found in $project_name"
    fi

# Update package.json
if [ -f "$project/package.json" ]; then
    jq '.name = "ehr-frontend-'"$project_name"'" | 
        .dependencies."@medplum/core" = "*" | 
        .dependencies."@medplum/react" = "*" | 
        .devDependencies."@medplum/eslint-config" = "*" | 
        .devDependencies."@medplum/fhirtypes" = "*" |
        .scripts.dev = "vite" |
        .scripts.build = "tsc && vite build" |
        .scripts.lint = "eslint ." |
        .scripts.test = "vitest"' "$project/package.json" > temp.json && mv temp.json "$project/package.json"
    print_status "Updated package.json for $project_name"
else
    print_status "package.json not found in $project_name"
fi

    # Update import statements in TypeScript files
    if [ -d "$project/src" ]; then
        find "$project/src" -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@medplum/core|workspace:@medplum/core|g; s|workspace:workspace:@medplum/core|workspace:@medplum/core|g'
        find "$project/src" -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@medplum/react|workspace:@medplum/react|g; s|workspace:workspace:@medplum/react|workspace:@medplum/react|g'
        print_status "Updated import statements for $project_name"
    else
        print_status "src directory not found in $project_name"
    fi
done

# Create root-level tsconfig.json if it doesn't exist
if [ ! -f "ehr-frontend/tsconfig.json" ]; then
    cat << EOF > ehr-frontend/tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./core" },
    { "path": "./chat" },
    { "path": "./client-external-idp" },
    { "path": "./eligibility" },
    { "path": "./fhircast" },
    { "path": "./hello-world" },
    { "path": "./live-chat" },
    { "path": "./nextjs" },
    { "path": "./patient-intake" },
    { "path": "./photon-integration" },
    { "path": "./provider" },
    { "path": "./react-native-example" },
    { "path": "./scheduling" },
    { "path": "./task" },
    { "path": "./websocket-subscriptions" }
  ]
}
EOF
    print_status "Created root-level tsconfig.json"
else
    print_status "Root-level tsconfig.json already exists"
fi

# ... existing code ...

# Run npm install to update workspace
print_status "Running npm install in ehr-frontend folder"
(
    cd ehr-frontend
    npm install
)
print_status "Completed npm install in ehr-frontend folder"

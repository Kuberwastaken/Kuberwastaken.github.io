# Portfolio Metadata Update Scripts

This directory contains scripts that automatically update metadata files (`llms.txt`, `profile.json`) during the build process to keep them in sync with your project data.

## Files

### `update-metadata.js`
Main script that updates both `llms.txt` and `profile.json` with current project information and timestamps.

### `extract-projects.js`
Helper script that dynamically extracts project data from `src/constants/projectsContent.js` to ensure metadata files stay in sync with your actual project data.

## How It Works

1. **During Build**: The `npm run build` command now automatically runs `npm run update-metadata` before and after the React build process.

2. **Dynamic Extraction**: The scripts parse your `projectsContent.js` file to extract current project information, ensuring metadata files are always up-to-date.

3. **Dual Updates**: Files are updated in both `public/` (for development) and `build/` (for production) directories.

## What Gets Updated

### `llms.txt`
- Last-Updated timestamp
- Top 12 projects with descriptions and links
- Maintains all static content (bio, links, etc.)

### `profile.json`
- last_updated timestamp  
- featured_projects array with top 8 projects
- Maintains all other profile data

## Usage

### Automatic (Recommended)
The scripts run automatically during:
```bash
npm run build    # Runs update-metadata before and after build
npm run deploy   # Runs via predeploy -> build
```

### Manual
You can also run the scripts manually:
```bash
npm run update-metadata    # Update both files
node scripts/update-metadata.js    # Direct execution
node scripts/extract-projects.js   # Test project extraction
```

## Benefits

1. **Always Current**: Metadata files automatically reflect your latest projects
2. **No Manual Updates**: Add projects to `projectsContent.js` and metadata updates automatically
3. **Consistent Data**: Single source of truth for project information
4. **Build Integration**: Seamlessly integrated into your deployment workflow

## Adding New Projects

1. Add your project to `src/constants/projectsContent.js` as usual
2. Run `npm run build` or `npm run update-metadata`
3. The new project will automatically appear in `llms.txt` and `profile.json`

## Customization

To modify which projects appear in metadata files or change the formatting, edit:
- `scripts/extract-projects.js` - Project selection and parsing logic
- `scripts/update-metadata.js` - Template content and formatting

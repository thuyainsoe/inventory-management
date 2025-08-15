import fs from 'fs-extra';
import * as path from 'path';

export async function validateProjectStructure(): Promise<boolean> {
  try {
    let cwd = process.cwd();
    
    // If we're in the cli directory, go up one level
    if (path.basename(cwd) === 'cli') {
      cwd = path.dirname(cwd);
    }
    
    // Check if we're in the right directory structure
    const backendExists = await fs.pathExists(path.join(cwd, 'backend'));
    const frontendExists = await fs.pathExists(path.join(cwd, 'frontend'));
    
    // Check for key files
    const backendPackageJson = await fs.pathExists(path.join(cwd, 'backend', 'package.json'));
    const frontendPackageJson = await fs.pathExists(path.join(cwd, 'frontend', 'package.json'));
    
    return backendExists && frontendExists && backendPackageJson && frontendPackageJson;
  } catch (error) {
    return false;
  }
}
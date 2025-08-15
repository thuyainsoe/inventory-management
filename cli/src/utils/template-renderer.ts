export function renderTemplate(template: string, data: any): string {
  let result = template;
  
  // Replace simple variables like {{singular.pascal}}
  result = result.replace(/\{\{([^}#/]+)\}\}/g, (match, path) => {
    const value = getNestedValue(data, path.trim());
    return value !== undefined ? String(value) : match;
  });
  
  // Handle {{#each fields}} blocks
  result = result.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayPath, content) => {
    const array = getNestedValue(data, arrayPath.trim());
    if (!Array.isArray(array)) return '';
    
    return array.map(item => {
      let itemContent = content;
      // Replace {{this.property}} with item properties
      itemContent = itemContent.replace(/\{\{this\.([^}]+)\}\}/g, (thisMatch: string, prop: string) => {
        const value = getNestedValue(item, prop.trim());
        return value !== undefined ? String(value) : thisMatch;
      });
      // Replace other variables in the context of this item
      itemContent = itemContent.replace(/\{\{([^}#/]+)\}\}/g, (varMatch: string, path: string) => {
        // First try to get from item, then from data
        const itemValue = getNestedValue(item, path.trim());
        if (itemValue !== undefined) return String(itemValue);
        
        const dataValue = getNestedValue(data, path.trim());
        return dataValue !== undefined ? String(dataValue) : varMatch;
      });
      return itemContent;
    }).join('');
  });
  
  // Handle {{#if condition}} blocks
  result = result.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
    const value = getNestedValue(data, condition.trim());
    return value ? content : '';
  });
  
  return result;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}
/**
 * Department Name Helper Utilities
 * Handles conversion between different department naming formats
 */

import { DEPARTMENT_SHORT_FORMS, SHORT_FORM_TO_DEPARTMENT } from '../config/constants';

/**
 * Converts any department ID format to display-friendly full name
 * Supports:
 * - Short forms: 'cse' → 'Computer Science & Engineering'
 * - Underscore format: 'computer_science___engineering' → 'Computer Science & Engineering'
 * - Full names: 'Computer Science & Engineering' → 'Computer Science & Engineering'
 * 
 * @param {string} deptId - Department ID in any format
 * @returns {string} - Display-friendly full department name
 */
export const getDepartmentDisplayName = (deptId) => {
  if (!deptId) return '';

  // First check if it's a short form mapping
  if (SHORT_FORM_TO_DEPARTMENT[deptId]) {
    return SHORT_FORM_TO_DEPARTMENT[deptId];
  }

  // Check if it's an underscore format
  if (deptId.includes('_')) {
    return deptId
      .split('_')
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/ {2,}/g, ' & '); // Handle multiple underscores as &
  }

  // Return as-is if already in readable format
  return deptId;
};

/**
 * Converts full department name to short form for database storage
 * Example: 'Computer Science & Engineering' → 'cse'
 * 
 * @param {string} departmentName - Full department name
 * @returns {string} - Short form ID, or sanitized name if no mapping exists
 */
export const getDepartmentShortForm = (departmentName) => {
  if (!departmentName) return '';

  // Check if mapping exists
  if (DEPARTMENT_SHORT_FORMS[departmentName]) {
    return DEPARTMENT_SHORT_FORMS[departmentName];
  }

  // Fallback: sanitize the name
  return departmentName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 64);
};

/**
 * Converts full department name to underscore format
 * Example: 'Computer Science & Engineering' → 'computer_science_engineering'
 * 
 * @param {string} departmentName - Full department name
 * @returns {string} - Underscore format
 */
export const getDepartmentUnderscoreFormat = (departmentName) => {
  if (!departmentName) return '';

  return departmentName
    .toLowerCase()
    .replace(/[&]/g, '_') // Convert & to underscore
    .replace(/[^a-z0-9_]/g, '_') // Replace non-alphanumeric with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
};

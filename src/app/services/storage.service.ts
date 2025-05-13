import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Save an item to local storage
   * @param key - The key under which the value will be stored
   * @param value - The value to store (automatically stringified)
   */
  setItem<T>(key: string, value: T): void {
    if (this.isLocalStorageAvailable()) {
      try {
        const stringified = JSON.stringify(value);
        localStorage.setItem(key, stringified);
      } catch (error) {
        console.error(`Error saving "${key}" to localStorage:`, error);
      }
    }
  }

  /**
   * Retrieve an item from local storage
   * @param key - The key of the item to retrieve
   * @returns The parsed value or null if not found or failed to parse
   */
  getItem<T>(key: string): T | null {
    if (this.isLocalStorageAvailable()) {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      try {
        return JSON.parse(item) as T;
      } catch (error) {
        console.warn(`Error parsing localStorage key "${key}":`, error);
        return null;
      }
    }
    return null;
  }

  /**
   * Remove an item from local storage
   * @param key - The key of the item to remove
   */
  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    }
  }

  /**
   * Clear all items from local storage
   */
  clear(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.clear();
    }
  }

  /**
   * Check if localStorage is available in the current environment
   * @returns true if available, false otherwise
   */
  private isLocalStorageAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && 'localStorage' in window;
    } catch {
      return false;
    }
  }
}

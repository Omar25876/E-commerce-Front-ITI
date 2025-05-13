import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * Save an item to local storage
   * @param key - The key under which the value will be stored
   * @param value - The value to store (can be any type)
   */
  setItem(key: string, value: any): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  }

  /**
   * Retrieve an item from local storage
   * @param key - The key of the item to retrieve
   * @returns The parsed value or null if the key does not exist
   */
  getItem<T>(key: string): T | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }

  /**
   * Remove an item from local storage
   * @param key - The key of the item to remove
   */
  removeItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }

  /**
   * Clear all items from local storage
   */
  clear(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
  }

}

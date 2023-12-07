import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    userId: number; // Add your custom property with its type
    userName: string;
    favMenus: string[];
  }
}

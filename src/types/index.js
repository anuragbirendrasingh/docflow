/**
 * @typedef {Object} Document
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} ownerId
 * @property {string} ownerEmail
 * @property {string[]} sharedWith
 * @property {string[]} sharedWithIds
 * @property {*} createdAt
 * @property {*} updatedAt
 */

/**
 * @typedef {Object} User
 * @property {string} uid
 * @property {string} email
 * @property {string} displayName
 * @property {*} createdAt
 */

/**
 * @typedef {Object} AuthContextType
 * @property {import('firebase/auth').User|null} user
 * @property {boolean} loading
 * @property {(email: string, password: string) => Promise<void>} login
 * @property {(email: string, password: string, name: string) => Promise<void>} signup
 * @property {() => Promise<void>} logout
 */

export {};

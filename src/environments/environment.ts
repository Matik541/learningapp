// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
};
export const appName = 'LearningApp';

export const API_URL = 'http://localhost:3000';

export const refreshToken = 'refreshToken';
export const accessToken = 'accessToken';

export type Tag = {
	id: Number;
	tagName: String;
};
export type Flashcard = {
	question: string;
	answer: string;
};
export type User = null | {
	userName: string;
	id: number;
};
export type Lesson = {
	id: number;
	title: string;
	description: string;
	iconPath: string;
	creator: User;
	flashcards: Flashcard[];
	tags: Tag[];
};
export type AddLesson = {
	title: string;
	description: string;
	iconPath: string;
	flashcards: Flashcard[];
	tags: Tag[];
};
export type Bar = {
	hidden: boolean;
	mode: 'indeterminate' | 'query' | 'determinate' | 'buffer';
	value: number;
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

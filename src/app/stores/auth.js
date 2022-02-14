//TODO: make auth readable-only store
import { writable } from 'svelte/store';

export const auth = writable(null);
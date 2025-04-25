import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		setupFiles: ['./src/test/setup.js'],
		environment: 'node',
		globals: true
	}
})

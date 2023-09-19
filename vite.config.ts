import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
    plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "expensync-8f35f7c69",
            project: "javascript-sveltekit"
        }
    }), sveltekit()]
};

export default config;
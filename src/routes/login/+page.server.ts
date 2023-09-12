import { AuthApiError, type Provider } from '@supabase/supabase-js';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	'signin-with-password': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!email) {
			return fail(400, {
				error: 'Please enter your email',
				values: {
					email
				}
			});
		}

		if (!password) {
			return fail(400, {
				error: 'Please enter your password',
				values: {
					email
				}
			});
		}

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		
		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: 'Invalid credentials.',
					values: {
						email
					}
				});
			}
			return fail(500, {
				error: 'Server error. Try again later.',
				values: {
					email
				}
			});
		}
		const { data } = await supabase.from('UserEmail').select('uuid').limit(1).single();
		if (data?.uuid) {
			throw redirect(303, '/dashboard');
		} else {
			throw redirect(303, '/register');
		}
	},

	'signin-with-oauth': async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const provider = formData.get('provider')?.toString();

		const {
			data: { url: oAuthUrl }
		} = await supabase.auth.signInWithOAuth({
			provider: provider as Provider,
			options: {
				redirectTo: `${url.origin}/api/auth/callback`
			}
		});

		if (!oAuthUrl) {
			return fail(500, {
				error: `Could not get provider url for ${provider}`
			});
		}

		throw redirect(303, oAuthUrl);
	},

	'send-magiclink': async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();

		if (!email) {
			return fail(500, {
				error: 'Please enter your email'
			});
		}

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${url.origin}/api/auth/callback`
			}
		});

		if (error) {
			return fail(500, {
				values: {
					email
				},
				error: 'Could not send magiclink'
			});
		}

		return {
			emailSent: true
		};
	},
	'signup': async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const passwordConfirm = formData.get('passwordconfirm') as string;
		
		if (password !== passwordConfirm) {
			return fail(400, {
				error: 'Mismatched Password',
				values: {
					email
				},
			})
		}

		if (!email) {
			return fail(400, {
				error: 'Please enter your email'
			});
		}
		if (!password) {
			return fail(400, {
				error: 'Please enter a password',
				values: {
					email
				},
			});
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: url.origin }
		});

		if (error) {
			return fail(500, {
				error: 'Server error. Try again later.',
				values: {
					email
				},
			});
		}
		return {
			emailSent: true
		}
	}
};

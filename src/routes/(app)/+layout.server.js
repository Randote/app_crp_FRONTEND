import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export async function load({ locals, url }) {
  if (!locals.user) {
    throw redirect(303, `${base}/?redirectTo=${url.pathname}`);
  }
  return { user: locals.user };
}
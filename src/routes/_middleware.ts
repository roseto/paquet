import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { supabaseService } from "@supabase";


export const handler = async (req: Request, ctx: MiddlewareHandlerContext) => {
	const cookies = await getCookies(req.headers);

	const { user } = await supabaseService.auth.api.getUser(cookies["access_token"]);
	if (user) {
		const { data: userData } = await supabaseService.from("users")
		.select("developer")
		.eq("id", user?.id)
		.single();
		
		ctx.state.developer = userData?.developer;
	}
	
	const dateTimeInSeconds = Math.floor(Date.now() / 1000);
	const accessTokenExpired = dateTimeInSeconds > parseInt(cookies["expires_at"]);

	ctx.state.accessToken = accessTokenExpired ? null : cookies["access_token"];
	ctx.state.user = user;

	if (["expires_at", "refresh_token"].every((key) => cookies[key])) {
		if (accessTokenExpired) {
			const { data } = await supabaseService.auth.api.refreshAccessToken(cookies["refresh_token"]);
			
			if (!data) {
				return ctx.next();
			}

			if (data.user) {
				const { data: userData } = await supabaseService.from("users")
					.select("developer")
					.eq("id", user?.id)
					.single();
				
				ctx.state.developer = userData.developer;
			}

			ctx.state.accessToken = data.access_token;
			ctx.state.user = data.user;

			const res = await ctx.next();

			setCookie(res.headers, {
				name: "access_token",
				value: data.access_token,
				maxAge: 365 * 24 * 60 * 60,
				httpOnly: true,
				sameSite: "Strict",
				path: "/",
			})
		
			setCookie(res.headers, {
				name: "refresh_token",
				value: data.refresh_token!,
				maxAge: 365 * 24 * 60 * 60,
				httpOnly: true,
				sameSite: "Strict",
				path: "/",
			})
			
			setCookie(res.headers, {
				name: "expires_at",
				value: data.expires_at!.toString(),
				maxAge: 365 * 24 * 60 * 60,
				httpOnly: true,
				sameSite: "Strict",
				path: "/",
			})

			return res;
		}
	}

	return ctx.next();
}
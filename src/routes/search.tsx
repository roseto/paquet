/**@jsx h */
import { h } from "preact";
import { tw } from "@twind";
import type { Handlers, PageProps } from "$fresh/server.ts"
import type { App } from "../types/App.ts";
import { supabase } from "@supabase";
import { getCategory } from "../utils/categories.ts";
import Root from "../components/Root.tsx";
import Stack from "../components/Stack.tsx";
import ListItem from "../components/ListItem.tsx";
import Navbar from "../islands/Navbar.tsx";
import Container from "../components/Container.tsx";
import SearchBox from "../components/SearchBox.tsx";

type DataProps = {
	apps: App[]
}

export default function Search(props: PageProps<DataProps>) {
	return (
		<Root>
			<Navbar back/>
			<Container
				class={tw`
					mt-16
				`}
			>
				<Stack>
					<SearchBox text={props.url.searchParams.get("q") || ""} />
						{props.data.apps?.map((app: App, idx: number) => (
							<a href={`/app/${app.id}`}>
								<ListItem
									button
									key={app.id}
									image={app.iconUrl}
									title={app.name}
									subtitle={getCategory(app.categoryId)?.name}
									divider={idx !== props.data.apps.length - 1}
								/>
							</a>
							// <AppListItem
							// 	app={app}
							// />
						))}
				</Stack>
			</Container>
		</Root>
	)
}

export const handler: Handlers = {
	async GET(req, ctx) {
		const searchParams = new URLSearchParams(req.url.split("?")[1]);
		const query = searchParams.get("q");

		if (!query) {
			return ctx.render({
				apps: [],
			})
		}

		const { data: apps } = await supabase.rpc("search_app", { search_term: query });

		return ctx.render({
			apps,
		})
	}
}
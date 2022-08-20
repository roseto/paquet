/**@jsx h */
/**@jsxFrag Fragment */
import { Fragment, h } from "preact";
import { tw } from "@/lib/twind.ts";
import Container from "@/components/Container.tsx";

const LINKS = [
	{
		title: "About",
		href: "/about",
	},
	{
		title: "Settings",
		href: "/settings",
	},
	{
		title: "Developers",
		href: "/developers",
	},
];

export default function Footer() {
	return (
		<footer
			class={tw`bg-paper-light dark:bg-paper-dark rounded-t p-4 mt-4`}
		>
			<Container>
				<h2
					class={tw`text-3xl`}
				>
					<img
						src="/icon.svg"
						class={tw`inline-block w-8 h-8 align-middle dark:(filter invert)`}
					/>{" "}
					Paquet
				</h2>
				<p
					class={tw`opacity-50`}
				>
					The web app shop
				</p>
				<div
					class={tw`mt-2 flex flex-row gap-2`}
				>
					<a
						href="https://github.com/notangelmario/paquet"
						target="_blank"
						rel="noreferrer noopener"
					>
						<img 
							src="/external-icons/github.svg"
							class={tw`w-6 h-6 dark:(filter invert)`}
						/>
					</a>
					<a
						href="https://www.madewithsupabase.com/p/paquet"
						target="_blank"
						rel="noreferrer noopener"
					>
						<img 
							src="/external-icons/supabase.svg"
							class={tw`w-6 h-6 dark:(filter invert)`}
						/>
					</a>
				</div>
				<div
					class={tw`mt-2 flex flex-row`}
				>
					{LINKS.map((link, idx) => (
						<>
							<a
								key={link.href}
								href={link.href}
								class={tw`opacity-50 hover:underline`}
							>
								{link.title}
							</a>
							{idx !== LINKS.length - 1 &&
								<span
									class={tw`opacity-50 mx-1`}
								>
									&middot;
								</span>
							}
						</>
					))}
				</div>
			</Container>
		</footer>
	);
}
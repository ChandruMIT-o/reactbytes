import Image from "next/image";
import LeftSidebarMenu from "./components/sidebar/LeftSidebarMenu";

export default function Home() {
	return (
		<div className="flex flex-col flex-1 items-center justify-center font-sans dark:bg-background">
			<LeftSidebarMenu />
		</div>
	);
}

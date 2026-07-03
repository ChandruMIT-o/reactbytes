import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const filePath = path.join(process.cwd(), "lib", "checklist.json");

async function getChecklistData() {
	try {
		const data = await fs.readFile(filePath, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		return {};
	}
}

export async function GET() {
	try {
		const fileData = await getChecklistData();
		return NextResponse.json({ checklist: fileData });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { componentId, field, value, checklist } = body;

		if (!componentId) {
			return NextResponse.json({ error: "Missing componentId" }, { status: 400 });
		}

		const fileData = await getChecklistData();

		if (checklist) {
			fileData[componentId] = {
				props: !!checklist.props,
				presets: !!checklist.presets,
				installation: !!checklist.installation,
				api: !!checklist.api,
				credits: !!checklist.credits,
				impact: !!checklist.impact,
			};
		} else if (field) {
			if (!fileData[componentId]) {
				fileData[componentId] = {
					props: false,
					presets: false,
					installation: false,
					api: false,
					credits: false,
					impact: false,
				};
			}
			fileData[componentId][field] = !!value;
		}

		await fs.mkdir(path.dirname(filePath), { recursive: true });
		await fs.writeFile(filePath, JSON.stringify(fileData, null, 2), "utf-8");
		return NextResponse.json({ success: true, updated: fileData[componentId] });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

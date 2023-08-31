import { NextResponse } from "next/server";
import { getPlayerNames } from "@/utiles/player";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const players = await getPlayerNames();
    return NextResponse.json(players);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

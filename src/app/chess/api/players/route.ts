import { NextResponse } from "next/server";
import { getPlayers } from "@/utiles/player";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    // Score 기준으로 플레이어 목록 가져오기
    const players = await getPlayers();
    return NextResponse.json(players);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

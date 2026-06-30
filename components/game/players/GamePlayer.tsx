"use client";

import type { SerializableGameType } from "@/lib/games/types";
import { ColoringPlayer } from "./ColoringPlayer";
import { HiddenObjectPlayer } from "./HiddenObjectPlayer";
import { MatchPlayer } from "./MatchPlayer";
import { MazePlayer } from "./MazePlayer";
import { QuizPlayer } from "./QuizPlayer";

export function GamePlayer({ title, gameType }: { title: string; gameType: SerializableGameType }) {
  switch (gameType.playerKind) {
    case "match":
      return <MatchPlayer title={title} />;
    case "maze":
      return <MazePlayer title={title} />;
    case "hidden-object":
      return <HiddenObjectPlayer title={title} />;
    case "coloring":
    case "drawing":
      return <ColoringPlayer title={title} />;
    case "quiz":
      return <QuizPlayer title={title} />;
    default:
      return (
        <div className="player-shell player-placeholder">
          <div className="player-placeholder-icon">🎮</div>
          <p className="player-message">
            Interactive demo for <strong>{title}</strong> is loading. Full gameplay is coming soon!
          </p>
          <p>{gameType.howItWorks}</p>
        </div>
      );
  }
}

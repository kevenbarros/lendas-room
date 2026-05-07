import { useEffect, useState } from "react";
import {
  fetchEnigmaCompletions,
  type EnigmaCompletion,
} from "../../services/googleSheets";
import "./MissionCompleted.css";

export function MissionCompleted() {
  const [completions, setCompletions] = useState<EnigmaCompletion[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchEnigmaCompletions().then((res) => {
      if (!cancelled && res.success && res.data) {
        setCompletions(res.data);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (completions.length === 0) return null;

  const MIN_ITEMS_PER_HALF = 20;
  const copiesPerHalf = Math.max(
    1,
    Math.ceil(MIN_ITEMS_PER_HALF / completions.length),
  );
  const half = Array.from({ length: copiesPerHalf }, () => completions).flat();
  const loop = [...half, ...half];

  return (
    <div className="mission-completed" aria-label="Decifradores do enigma">
      <div className="mission-completed__track">
        {loop.map((c, i) => (
          <span key={i} className="mission-completed__item">
            <span className="mission-completed__star" aria-hidden="true">
              ★
            </span>
            <strong className="mission-completed__name">{c.nome}</strong>
            <span className="mission-completed__text">
              decifrou o enigma
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

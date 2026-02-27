"use client";

import LightsOutCard from "./LightsOutCard";
import ImmersiveBlockCard from "./ImmersiveBlockCard";

export default function ScheduleBlockCard({
  block,
  tasks,
  yotoPrereqs,
  isParent,
  onMarkDone,
  onUndo,
  onAccept,
  onUnaccept,
  defaultExpanded = false,
}) {
  if (block.label === "Lights Out") {
    return <LightsOutCard block={block} />;
  }

  return (
    <ImmersiveBlockCard
      block={block}
      tasks={tasks}
      yotoPrereqs={yotoPrereqs}
      isParent={isParent}
      onMarkDone={onMarkDone}
      onUndo={onUndo}
      onAccept={onAccept}
      onUnaccept={onUnaccept}
      defaultExpanded={defaultExpanded}
    />
  );
}

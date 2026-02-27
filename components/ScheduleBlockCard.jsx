"use client";

import LightsOutCard from "./LightsOutCard";
import ImmersiveBlockCard from "./ImmersiveBlockCard";

export default function ScheduleBlockCard({
  block,
  tasks,
  yotoPrereqs,
  isParent,
  pastDayEdit = false,
  onMarkDone,
  onUndo,
  onAccept,
  onUnaccept,
  onPicklistSelect,
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
      pastDayEdit={pastDayEdit}
      onMarkDone={onMarkDone}
      onUndo={onUndo}
      onAccept={onAccept}
      onUnaccept={onUnaccept}
      onPicklistSelect={onPicklistSelect}
      defaultExpanded={defaultExpanded}
    />
  );
}

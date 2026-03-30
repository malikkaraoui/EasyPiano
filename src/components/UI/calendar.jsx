"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

function Calendar({
  className,
  selected,
  onSelect,
  minDate,
  maxDate,
  ...props
}) {
  const [currentMonth, setCurrentMonth] = useState(
    selected ? new Date(selected) : new Date(),
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const dayNames = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

  function prevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
  }

  function isDisabled(day) {
    const date = new Date(year, month, day);
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  }

  function isSelected(day) {
    if (!selected) return false;
    const date = new Date(year, month, day);
    const sel = new Date(selected);
    return (
      date.getFullYear() === sel.getFullYear() &&
      date.getMonth() === sel.getMonth() &&
      date.getDate() === sel.getDate()
    );
  }

  function handleDayClick(day) {
    if (isDisabled(day)) return;
    const date = new Date(year, month, day);
    const isoDate = date.toISOString().split("T")[0];
    onSelect?.(isoDate);
  }

  const days = [];
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDisabled(day);
    const sel = isSelected(day);
    days.push(
      <button
        key={day}
        onClick={() => handleDayClick(day)}
        disabled={disabled}
        className={cn(
          "h-9 w-9 rounded text-sm font-medium transition-colors",
          sel ? "bg-accent text-background" : "text-foreground hover:bg-card",
          disabled && "cursor-not-allowed opacity-30",
        )}
      >
        {day}
      </button>,
    );
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {monthNames[month]} {year}
        </span>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map((d) => (
          <div key={d} className="text-xs font-medium text-muted py-1">
            {d}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}

export { Calendar };

"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function MovieCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-secondary rounded-md overflow-hidden">
      <div
        className="p-5 cursor-pointer relative"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium">Merry psycho</h2>
            <p className="text-sm text-gray-300 pr-8 leading-relaxed">
              A sweet and happy two year marriage felt like a dream. One day,
              her husband disappeared without a trace. Han Sooryeong, an
              ordinary housewife and blind woman, desperately searches for
              him...
            </p>
          </div>
          <ChevronDown
            className={`w-10 h-10 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-gray-700 pt-4 mt-1">
            <p className="text-sm text-gray-300">
              As Han Sooryeong delves deeper into her husbands mysterious
              disappearance, she uncovers shocking secrets that make her
              question everything she thought she knew about him. Despite her
              visual impairment, she develops heightened senses that help her
              navigate a dangerous world of deception and betrayal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

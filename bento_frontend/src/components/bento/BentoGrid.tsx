"use client"

import { useState, useCallback, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { BentoBlock, BlockData } from "./BentoBlock"
import { cn } from "@/lib/utils"

interface BentoGridProps {
  blocks: BlockData[]
  isEditing?: boolean
  onBlocksChange?: (blocks: BlockData[]) => void
  onBlockEdit?: (block: BlockData) => void
  onBlockDelete?: (id: string) => void
  columns?: number
  gap?: number
  className?: string
}

export function BentoGrid({
  blocks,
  isEditing = false,
  onBlocksChange,
  onBlockEdit,
  onBlockDelete,
  columns = 4,
  gap = 4,
  className,
}: BentoGridProps) {
  const [items, setItems] = useState(blocks)

  // Sync internal state with prop changes (for real-time editing)
  useEffect(() => {
    setItems(blocks)
  }, [blocks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        setItems((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id)
          const newIndex = items.findIndex((item) => item.id === over.id)
          const newItems = arrayMove(items, oldIndex, newIndex)
          onBlocksChange?.(newItems)
          return newItems
        })
      }
    },
    [onBlocksChange]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div
          className={cn(
            "w-full max-w-6xl mx-auto grid gap-4",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
            "auto-rows-[minmax(140px,auto)]",
            className
          )}
          style={{ gap: `${gap * 4}px` }}
        >
          {items.map((block, index) => (
            <div
              key={block.id}
              className="animate-scale-in"
              style={{ 
                animationDelay: `${index * 50}ms`,
                gridColumn: `span ${Math.min(block.gridWidth, 4)}`,
                gridRow: `span ${block.gridHeight}`,
              }}
            >
              <BentoBlock
                block={block}
                isEditing={isEditing}
                onEdit={onBlockEdit}
                onDelete={onBlockDelete}
              />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

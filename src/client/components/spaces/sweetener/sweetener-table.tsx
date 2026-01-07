"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "~/client/components/ui/badge";
import { Input } from "~/client/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/client/components/ui/table";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { sweetenerData } from "./sweetener-data";
import type { SweetenerData } from "./sweetener-data";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { type ChangeEvent } from "react";
import { cn } from "~/client/lib/utils";

const GI_TABLE_SUGAR = 65;

// Color coding for glycemic index
const getGIColorClass = (gi: number): string => {
  if (gi <= 10) return "border-green-500/50 text-green-600 dark:text-green-400";
  if (gi <= 30)
    return "border-yellow-500/50 text-yellow-600 dark:text-yellow-400";
  if (gi <= 50)
    return "border-orange-500/50 text-orange-600 dark:text-orange-400";
  return "border-red-500/50 text-red-600 dark:text-red-400";
};

// Mobile Card Component
function SweetenerCard({
  item,
  isExpanded,
  onToggle,
}: {
  item: SweetenerData[0];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-border/30 rounded-lg border">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex-1">
          <h3 className="text-foreground font-medium">{item.name}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{item.tldr}</p>
        </div>
        <div className="ml-4 flex items-center gap-3">
          <Badge
            variant="outline"
            className={cn("text-xs", getGIColorClass(item.gi))}
          >
            GI {item.gi}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="text-muted-foreground h-4 w-4" />
          ) : (
            <ChevronDown className="text-muted-foreground h-4 w-4" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-border/30 border-t p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Sweetness</span>
              <p className="text-foreground font-medium">
                {item.relativeSweetness}x
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Calories/g</span>
              <p
                className={cn(
                  "font-medium",
                  item.caloriesPerGram === 0
                    ? "text-primary"
                    : "text-foreground",
                )}
              >
                {item.caloriesPerGram}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Form</span>
              <div className="mt-1 flex gap-2">
                {(item.state === "powder" || item.state === "both") && (
                  <span className="text-foreground text-xs">Powder</span>
                )}
                {(item.state === "liquid" || item.state === "both") && (
                  <span className="text-foreground text-xs">Liquid</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">vs Sugar</span>
              <p className="text-foreground font-medium">
                {item.gi === 0
                  ? "No impact"
                  : `${Math.round((item.gi / GI_TABLE_SUGAR) * 100)}%`}
              </p>
            </div>
          </div>

          {item.requiresCarrier && (
            <div className="border-border/30 mt-4 rounded border p-3">
              <span className="text-muted-foreground text-xs">
                Carrier Required
              </span>
              <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                {item.solidCarrier && (
                  <div>
                    <span className="text-muted-foreground">Solid:</span>{" "}
                    <span className="text-foreground">{item.solidCarrier}</span>
                  </div>
                )}
                {item.liquidCarrier && (
                  <div>
                    <span className="text-muted-foreground">Liquid:</span>{" "}
                    <span className="text-foreground">
                      {item.liquidCarrier}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Desktop Table Component
function DesktopTable({
  data,
  globalFilter,
}: {
  data: SweetenerData;
  globalFilter: string;
}) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set([""]));
  const [sorting, setSorting] = useState<SortingState>([]);

  const toggleRow = (rowId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  const columns = useMemo<ColumnDef<SweetenerData[0]>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            className="hover:text-foreground flex items-center gap-1 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Name</span>
            <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-foreground font-medium">
            {row.getValue("name")}
          </div>
        ),
        filterFn: "includesString",
      },
      {
        accessorKey: "gi",
        header: ({ column }) => (
          <button
            className="hover:text-foreground flex items-center gap-1 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>GI</span>
            <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => {
          const gi = row.getValue<number>("gi");
          return (
            <Badge
              variant="outline"
              className={cn("text-xs", getGIColorClass(gi))}
            >
              {gi}
            </Badge>
          );
        },
        sortingFn: "basic",
      },
      {
        accessorKey: "relativeSweetness",
        header: ({ column }) => (
          <button
            className="hover:text-foreground flex items-center gap-1 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Sweetness</span>
            <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <span>{row.getValue<number>("relativeSweetness")}x</span>
        ),
        sortingFn: "basic",
      },
      {
        accessorKey: "state",
        header: () => <span>Form</span>,
        cell: ({ row }) => {
          const state = row.getValue<string>("state");
          return (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {state === "powder" || state === "both" ? (
                  <Check className="text-primary h-4 w-4" />
                ) : (
                  <X className="text-muted-foreground h-4 w-4" />
                )}
                <span className="text-muted-foreground text-xs">P</span>
              </div>
              <div className="flex items-center gap-1">
                {state === "liquid" || state === "both" ? (
                  <Check className="text-primary h-4 w-4" />
                ) : (
                  <X className="text-muted-foreground h-4 w-4" />
                )}
                <span className="text-muted-foreground text-xs">L</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "caloriesPerGram",
        header: ({ column }) => (
          <button
            className="hover:text-foreground flex items-center gap-1 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span>Cal/g</span>
            <SortIcon isSorted={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => {
          const calories = row.getValue<number>("caloriesPerGram");
          return (
            <span className={calories === 0 ? "text-primary font-medium" : ""}>
              {calories}
            </span>
          );
        },
        sortingFn: "basic",
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    enableColumnFilters: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <div className="border-border/30 rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-border/30">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-muted-foreground text-xs font-medium"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  className="hover:bg-muted/20 border-border/30 cursor-pointer transition-colors"
                  onClick={() => toggleRow(row.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {expandedRows.has(row.id) && (
                  <TableRow className="border-border/30">
                    <TableCell colSpan={columns.length} className="p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="border-border/30 rounded border p-3">
                          <span className="text-muted-foreground text-xs">
                            Comparison to Sugar
                          </span>
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                GI Impact:
                              </span>
                              <span className="text-foreground font-medium">
                                {row.original.gi === 0
                                  ? "Zero impact"
                                  : `${Math.round((row.original.gi / GI_TABLE_SUGAR) * 100)}% of sugar`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Amount Needed:
                              </span>
                              <span className="text-foreground font-medium">
                                {row.original.relativeSweetness > 0
                                  ? `${(1 / row.original.relativeSweetness).toFixed(4)}x`
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {row.original.requiresCarrier && (
                          <div className="border-border/30 rounded border p-3">
                            <span className="text-muted-foreground text-xs">
                              Carrier Information
                            </span>
                            <div className="mt-2 space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Solid:
                                </span>
                                <span className="text-foreground font-medium">
                                  {row.original.solidCarrier ?? "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Liquid:
                                </span>
                                <span className="text-foreground font-medium">
                                  {row.original.liquidCarrier ?? "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground h-24 text-center"
              >
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Sort Icon Component
function SortIcon({ isSorted }: { isSorted: false | "asc" | "desc" }) {
  if (!isSorted) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  }

  return isSorted === "asc" ? (
    <ChevronUp className="h-3 w-3" />
  ) : (
    <ChevronDown className="h-3 w-3" />
  );
}

// Main Component
export function SweetenerTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const filteredData = useMemo(() => {
    if (!globalFilter) return sweetenerData;
    const lower = globalFilter.toLowerCase();
    return sweetenerData.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.tldr.toLowerCase().includes(lower),
    );
  }, [globalFilter]);

  const toggleCard = (name: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search sweeteners..."
        value={globalFilter}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setGlobalFilter(e.target.value)
        }
        className="max-w-sm"
      />

      {/* Mobile: Card view */}
      <div className="space-y-3 sm:hidden">
        {filteredData.map((item) => (
          <SweetenerCard
            key={item.name}
            item={item}
            isExpanded={expandedCards.has(item.name)}
            onToggle={() => toggleCard(item.name)}
          />
        ))}
        {filteredData.length === 0 && (
          <p className="text-muted-foreground py-8 text-center">
            No results found.
          </p>
        )}
      </div>

      {/* Desktop: Table view */}
      <div className="hidden sm:block">
        <DesktopTable data={sweetenerData} globalFilter={globalFilter} />
      </div>
    </div>
  );
}

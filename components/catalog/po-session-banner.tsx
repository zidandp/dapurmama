"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Package, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { POSession } from "@/lib/types";
import { formatPOSessionDateRange } from "@/lib/utils/po-session";

interface POSessionBannerProps {
  onSessionSelect?: (sessionId: string | null) => void;
  selectedSessionId?: string | null;
}

export function POSessionBanner({
  onSessionSelect,
  selectedSessionId,
}: POSessionBannerProps) {
  const [activeSessions, setActiveSessions] = useState<POSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  useEffect(() => {
    const fetchActiveSessions = async () => {
      try {
        const response = await fetch("/api/po-sessions/active");
        if (!response.ok) throw new Error("Failed to fetch active sessions");

        const sessions = await response.json();
        setActiveSessions(sessions);

        // PERBAIKAN: Hanya auto-select SEKALI dan hanya jika benar-benar belum ada yang dipilih
        if (
          sessions.length > 0 &&
          selectedSessionId === undefined &&
          !hasAutoSelected
        ) {
          onSessionSelect?.(null); // Default ke "Semua Produk" bukan session pertama
          setHasAutoSelected(true);
        }
      } catch (err) {
        setError("Gagal memuat sesi PO aktif");
        console.error("Error fetching active sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSessions();
  }, []); // PERBAIKAN: Hapus dependencies yang menyebabkan re-render

  if (loading) {
    return (
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <Card className="border-destructive/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeSessions.length === 0) {
    return (
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Tidak ada sesi PO aktif</p>
                <p className="text-xs text-muted-foreground">
                  Produk reguler tetap tersedia untuk pemesanan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Sesi Pre-Order Aktif</h2>
      </div>

      <div className="grid gap-3">
        {/* All Products Option */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedSessionId === null ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSessionSelect?.(null)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Semua Produk</p>
                  <p className="text-xs text-muted-foreground">
                    Tampilkan semua produk yang tersedia
                  </p>
                </div>
              </div>
              {selectedSessionId === null && (
                <Badge variant="default" className="text-xs">
                  Aktif
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active PO Sessions */}
        {activeSessions.map((session) => (
          <Card
            key={session.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedSessionId === session.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSessionSelect?.(session.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {session.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatPOSessionDateRange(
                          session.startDate,
                          session.endDate
                        )}
                      </span>
                    </div>
                    {session.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {session.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {selectedSessionId === session.id && (
                    <Badge variant="default" className="text-xs">
                      Dipilih
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {session.products.length} produk
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

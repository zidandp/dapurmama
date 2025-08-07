"use client";

import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderTimelineProps {
  status: string;
  timestamps: {
    createdAt: string;
    updatedAt: string;
  };
}

interface TimelineStep {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  estimatedMinutes?: number;
}

const timelineSteps: TimelineStep[] = [
  {
    key: "PENDING",
    label: "Pesanan Diterima",
    description: "Pesanan Anda telah masuk ke sistem",
    icon: Clock,
    estimatedMinutes: 0,
  },
  {
    key: "CONFIRMED",
    label: "Pesanan Dikonfirmasi",
    description: "Pesanan telah dikonfirmasi dan akan segera diproses",
    icon: CheckCircle,
    estimatedMinutes: 30,
  },
  {
    key: "PROCESSING",
    label: "Sedang Diproses",
    description: "Pesanan sedang dibuat dengan penuh cinta",
    icon: Package,
    estimatedMinutes: 120,
  },
  {
    key: "READY",
    label: "Siap Diambil",
    description: "Pesanan sudah siap untuk diambil atau diantar",
    icon: Truck,
    estimatedMinutes: 180,
  },
  {
    key: "COMPLETED",
    label: "Selesai",
    description: "Pesanan telah selesai. Terima kasih!",
    icon: CheckCircle,
    estimatedMinutes: 240,
  },
];

export function OrderTimeline({ status, timestamps }: OrderTimelineProps) {
  const currentStepIndex = timelineSteps.findIndex(
    (step) => step.key === status
  );
  const isCancelled = status === "CANCELLED";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getEstimatedCompletion = () => {
    if (isCancelled || status === "COMPLETED") return null;

    const createdTime = new Date(timestamps.createdAt);
    const estimatedMinutes = 240; // 4 jam default
    const estimatedTime = new Date(
      createdTime.getTime() + estimatedMinutes * 60000
    );

    return estimatedTime;
  };

  const estimatedCompletion = getEstimatedCompletion();

  if (isCancelled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Status Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-destructive/5">
            <XCircle className="h-6 w-6 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">
                Pesanan Dibatalkan
              </p>
              <p className="text-sm text-muted-foreground">
                Dibatalkan pada {formatDate(timestamps.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Status Pesanan
          </CardTitle>
          {estimatedCompletion && (
            <Badge variant="outline" className="text-xs">
              Estimasi selesai: {formatDate(estimatedCompletion.toISOString())}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex items-start gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {index < timelineSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-8 mt-2 ${
                        isCompleted ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-semibold ${
                        isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </h3>
                    {isCurrent && (
                      <Badge variant="default" className="text-xs">
                        Saat ini
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      isCompleted
                        ? "text-muted-foreground"
                        : "text-muted-foreground/70"
                    }`}
                  >
                    {step.description}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Diperbarui: {formatDate(timestamps.updatedAt)}
                    </p>
                  )}
                  {step.key === "PENDING" && isCompleted && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Dibuat: {formatDate(timestamps.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Catatan:</strong> Estimasi waktu bisa berubah tergantung
            kompleksitas pesanan dan antrian saat ini. Kami akan menghubungi
            Anda jika terjadi perubahan jadwal.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

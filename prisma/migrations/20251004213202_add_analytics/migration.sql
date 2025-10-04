-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "referrer" TEXT,
    "device" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "countryCode" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Analytics_timestamp_idx" ON "Analytics"("timestamp");

-- CreateIndex
CREATE INDEX "Analytics_ip_idx" ON "Analytics"("ip");

-- CreateIndex
CREATE INDEX "Analytics_path_idx" ON "Analytics"("path");

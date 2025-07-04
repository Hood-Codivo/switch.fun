"use client";

import React, { useState, useEffect } from "react";
import TipStats from "@/app/(dashboard)/u/[username]/profile/_components/TipStats";
import DonationChart from "@/app/(dashboard)/u/[username]/profile/_components/DonationChart";
import StreamStats from "@/app/(dashboard)/u/[username]/profile/_components/StreamStats";
import RecentTips from "@/app/(dashboard)/u/[username]/profile/_components/RecentTips";
import TokenBalance from "@/app/(dashboard)/u/[username]/profile/_components/TokenBalance";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartPie,
  Users,
  DollarSign,
  Wallet,
  TrendingUp,
  Copy,
} from "lucide-react";
import Modal from "react-modal";
import QRCode from "react-qr-code";
import { userHasWallet } from "@civic/auth-web3";
import { useUser } from "@civic/auth-web3/react";
import TopDonors from "./_components/TopDonors";
import { toast } from "sonner"; // Import Sonner toast

const Profile = () => {
  // 1️⃣ Fetch wallet from Civic Auth
  const userContext = useUser(); /* :contentReference[oaicite:10]{index=10} */
  const hasWallet =
    userHasWallet(userContext); /* :contentReference[oaicite:11]{index=11} */
  const address = hasWallet
    ? userContext.solana.address
    : ""; /* :contentReference[oaicite:12]{index=12} */

  // 2️⃣ Modal state
  const [isOpen, setIsOpen] = useState(false);

  // 3️⃣ Bind react-modal to <body>
  useEffect(() => {
    Modal.setAppElement("body");
  }, []); /* :contentReference[oaicite:13]{index=13} */

  // 4️⃣ Build Solana Pay URI
  const uri = address
    ? `solana:${address}`
    : ""; /* :contentReference[oaicite:14]{index=14} */

  // 5️⃣ Period state for donation chart
  const [selectedPeriod, setSelectedPeriod] = useState<
    "day" | "week" | "month" | "year"
  >("month");

  // Function to handle copy with toast notification
  const handleCopyAddress = () => {
    if (!address) return;

    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast.success("Wallet address copied to clipboard!", {
          position: "top-center",
          duration: 2000,
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "calc(var(--radius) - 2px)",
            padding: "8px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        });
      })
      .catch((err) => {
        toast.error("Failed to copy address", {
          position: "top-center",
          duration: 2000,
          style: {
            background: "hsl(var(--destructive))",
            color: "hsl(var(--destructive-foreground))",
            border: "1px solid hsl(var(--destructive))",
            borderRadius: "calc(var(--radius) - 2px)",
            padding: "8px 16px",
          },
        });
      });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between">
          <h1 className="text-3xl font-display mb-8">Streaming Dashboard</h1>
          {/* Header with QR trigger */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setIsOpen(true)}
              disabled={!hasWallet}
              className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-md disabled:opacity-50"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Deposit
            </button>
          </div>

          {/* Modal with QR code */}
          <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="Deposit to Wallet"
            style={{
              overlay: {
                backgroundColor: "hsl(var(--background) / 0.9)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              },
              content: {
                position: "relative",
                maxWidth: "440px",
                margin: "0 20px",
                padding: "32px",
                borderRadius: "calc(var(--radius) + 4px)",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                boxShadow: "0 12px 24px hsl(var(--background) / 0.25)",
              },
            }}
          >
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl gradient-text mb-2">
                  Deposit to Your Wallet
                </h2>
                <p className="text-muted-foreground text-sm">
                  Scan the QR code or copy your wallet address
                </p>
              </div>

              {hasWallet ? (
                <>
                  <div className="relative p-4 bg-card rounded-xl border border-border card-hover">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10" />
                    <QRCode
                      value={uri}
                      size={256}
                      className="relative z-10 mx-auto"
                      bgColor="hsl(var(--card))"
                      fgColor="hsl(var(--card-foreground))"
                    />
                  </div>

                  <div className="group relative">
                    <a
                      href={uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 pr-12 bg-muted rounded-lg text-sm hover:bg-accent/10 transition-colors truncate font-mono text-muted-foreground hover:text-foreground"
                    >
                      {address}
                    </a>
                    <button
                      onClick={handleCopyAddress} // Updated to use the new handler
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive text-destructive text-sm">
                  Please connect your wallet first.
                </div>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 px-6 bg-gradient-to-r from-primary to-secondary rounded-lg text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </Modal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Token Balance Card */}
          <TokenBalance />

          {/* Total Tips Card */}
          <TipStats />

          {/* Stream Stats Card */}
          <StreamStats />
        </div>

        {/* Charts and Data */}
        <Tabs defaultValue="donations" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="donations" className="flex items-center">
              <ChartPie className="w-4 h-4 mr-2" />
              <span>Donation Stats</span>
            </TabsTrigger>
            <TabsTrigger value="streams" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span>Stream Performance</span>
            </TabsTrigger>
            <TabsTrigger value="viewers" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>Viewer Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="space-y-6">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Donation Analytics</h2>

              {/* <-- Swap in DonationChart here (with period) --> */}
              <DonationChart period={selectedPeriod} />
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTips />
              <TopDonors />
            </div>
          </TabsContent>

          <TabsContent value="streams" className="space-y-6">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Stream Performance</h2>
              <div className="h-[350px]">
                <div className="text-center text-muted-foreground mt-16">
                  Stream performance chart will be displayed here
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Recent Streams</h2>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Stream #{i + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            Date.now() - i * 86400000
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{60 - i * 10} minutes</p>
                        <p className="text-sm text-muted-foreground">
                          {50 - i * 5} viewers
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">
                  Stream Highlights
                </h2>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Peak moment #{i + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {80 - i * 10} concurrent viewers
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(50 - i * 8).toFixed(2)} tips
                        </p>
                        <p className="text-sm text-muted-foreground">
                          During stream #{i + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="viewers" className="space-y-6">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">
                Viewer Demographics
              </h2>
              <div className="h-[350px]">
                <div className="text-center text-muted-foreground mt-16">
                  Viewer demographics chart will be displayed here
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Viewer Retention</h2>
                <div className="h-[250px]">
                  <div className="text-center text-muted-foreground mt-16">
                    Viewer retention chart will be displayed here
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Viewer Growth</h2>
                <div className="h-[250px]">
                  <div className="text-center text-muted-foreground mt-16">
                    Viewer growth chart will be displayed here
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;

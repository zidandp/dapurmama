"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Search, Filter, X, ChevronRight, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/data";
import { ProductCard } from "@/components/products/product-card";
import { POSessionBanner } from "./po-session-banner";
import { useSearchParams } from "next/navigation";
import type { Product, POSession } from "@/lib/types";

export function ProductCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Semua";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const desktopPanelRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeSessions, setActiveSessions] = useState<POSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products dan active sessions
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [productsRes, sessionsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/po-sessions/active"),
        ]);

        const productsData = await productsRes.json();
        const sessionsData = await sessionsRes.json();

        setProducts(productsData);
        setActiveSessions(sessionsData);

        // Auto-select first active session if available
        if (sessionsData.length > 0 && selectedSessionId === null) {
          setSelectedSessionId(sessionsData[0].id);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setProducts([]);
        setActiveSessions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter products berdasarkan sesi PO yang dipilih
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by PO Session
    if (selectedSessionId && activeSessions.length > 0) {
      const selectedSession = activeSessions.find(
        (s) => s.id === selectedSessionId
      );
      if (selectedSession) {
        const sessionProductIds = selectedSession.products.map((p) => p.id);
        filtered = filtered.filter(
          (product) =>
            sessionProductIds.includes(product.id) && product.isAvailable
        );
      }
    } else if (selectedSessionId === null) {
      // Show all available products
      filtered = filtered.filter((product) => product.isAvailable);
    }

    // Filter by category
    if (selectedCategory !== "Semua") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [
    products,
    activeSessions,
    selectedSessionId,
    searchTerm,
    selectedCategory,
  ]);

  // Get current session info for display
  const currentSession = useMemo(() => {
    if (!selectedSessionId) return null;
    return activeSessions.find((s) => s.id === selectedSessionId) || null;
  }, [selectedSessionId, activeSessions]);

  // Auto-close filters on scroll down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && isMobileFilterOpen) {
        setIsMobileFilterOpen(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobileFilterOpen]);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileDrawerRef.current &&
        !mobileDrawerRef.current.contains(event.target as Node)
      ) {
        setIsMobileFilterOpen(false);
      }
      if (
        desktopPanelRef.current &&
        !desktopPanelRef.current.contains(event.target as Node)
      ) {
        setIsDesktopFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle escape key to close filters
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileFilterOpen(false);
        setIsDesktopFilterOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsMobileFilterOpen(false);
    setIsDesktopFilterOpen(false);
  };

  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (selectedCategory !== "Semua") count++;
    if (selectedSessionId) count++;
    return count;
  }, [selectedCategory, selectedSessionId]);

  return (
    <div className="container-custom relative">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Katalog <span className="text-gradient">Produk</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          {currentSession
            ? `Produk dari sesi PO: ${currentSession.name}`
            : "Temukan dessert rumahan favorit Anda dari koleksi lengkap kami."}
        </p>
      </div>

      {/* PO Session Banner */}
      <POSessionBanner
        onSessionSelect={setSelectedSessionId}
        selectedSessionId={selectedSessionId}
      />

      {/* Sticky Search & Filter Bar */}
      <div className="sticky top-14 sm:top-16 z-40 bg-background/95 backdrop-blur-sm py-4 mb-6 -mx-3 px-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 btn-touch h-10 sm:h-11"
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileFilterOpen(true);
                } else {
                  setIsDesktopFilterOpen(!isDesktopFilterOpen);
                }
              }}
              className="btn-touch h-10 w-10 sm:h-11 sm:w-11 relative"
            >
              <Filter className="h-4 w-4" />
              {getActiveFiltersCount() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-pink-500 hover:bg-pink-500">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div
            ref={mobileDrawerRef}
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background border-l border-border shadow-xl animate-slide-in-right"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <h2 className="font-semibold">Filter Produk</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="btn-touch"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  {/* PO Session Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Sesi Pre-Order</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedSessionId(null)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors btn-touch flex items-center justify-between ${
                          selectedSessionId === null
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <span>Semua Produk</span>
                        {selectedSessionId === null && (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {activeSessions.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => setSelectedSessionId(session.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors btn-touch flex items-center justify-between ${
                            selectedSessionId === session.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <span className="truncate block">
                              {session.name}
                            </span>
                            <span className="text-xs opacity-70">
                              {session.products.length} produk
                            </span>
                          </div>
                          {selectedSessionId === session.id && (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <h3 className="font-medium mb-3">Kategori</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.name)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors btn-touch flex items-center justify-between ${
                            selectedCategory === category.name
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          <span>{category.name}</span>
                          {selectedCategory === category.name && (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("Semua");
                    setSelectedSessionId(null);
                    setSearchTerm("");
                  }}
                  className="w-full btn-touch"
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Panel */}
      <div className="hidden md:block relative">
        {isDesktopFilterOpen && (
          <div
            ref={desktopPanelRef}
            className="absolute left-0 top-0 w-80 bg-background border border-border rounded-lg shadow-lg z-30 animate-slide-in-left"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <h2 className="font-semibold">Filter Produk</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDesktopFilterOpen(false)}
                  className="btn-touch"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* PO Session Filter */}
                <div>
                  <h3 className="font-medium mb-3">Sesi Pre-Order</h3>
                  <div className="space-y-2">
                    <Button
                      variant={
                        selectedSessionId === null ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedSessionId(null)}
                      className="w-full justify-start btn-touch text-sm h-9"
                    >
                      Semua Produk
                    </Button>
                    {activeSessions.map((session) => (
                      <Button
                        key={session.id}
                        variant={
                          selectedSessionId === session.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedSessionId(session.id)}
                        className="w-full justify-start btn-touch text-sm h-9"
                      >
                        <div className="flex-1 text-left min-w-0">
                          <div className="truncate">{session.name}</div>
                          <div className="text-xs opacity-70">
                            {session.products.length} produk
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="font-medium mb-3">Kategori</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          selectedCategory === category.name
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleCategorySelect(category.name)}
                        className="btn-touch text-sm h-9 justify-start"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("Semua");
                    setSelectedSessionId(null);
                    setSearchTerm("");
                  }}
                  className="w-full btn-touch"
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== "Semua" || searchTerm || selectedSessionId) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedSessionId && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {currentSession?.name || "Sesi PO"}
              <button
                onClick={() => setSelectedSessionId(null)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedCategory !== "Semua" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedCategory}
              <button
                onClick={() => setSelectedCategory("Semua")}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div
        className={`grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 transition-all duration-300 ${
          isDesktopFilterOpen ? "md:ml-84" : ""
        }`}
      >
        {loading ? (
          <div className="col-span-full text-center py-16 animate-fade-in transition-all duration-300">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">
              Sedang memuat produk...
            </h3>
            <p className="text-muted-foreground mb-6">
              Harap tunggu sebentar, sedang mengambil data produk dari server.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-16 animate-fade-in transition-all duration-300">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-muted-foreground mb-6">
              {selectedSessionId
                ? "Tidak ada produk dalam sesi PO yang dipilih. Coba pilih sesi lain atau reset filter."
                : "Coba ubah kata kunci pencarian atau filter kategori."}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Semua");
                setSelectedSessionId(null);
              }}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} poSessionId={selectedSessionId} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

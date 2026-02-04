// ============================================
// FATI - Header
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore, useAuthStore } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { useAlerts } from '@/hooks/useData';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle,
  BarChart3,
  Map as MapIcon,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useSearch } from '@/hooks/useData';

interface HeaderProps {
  space: 'institution' | 'sector' | 'admin' | 'contributor' | 'annonceur';
}

const getSpaceTitle = (space: string) => {
  switch (space) {
    case 'institution':
      return 'Espace Institutions & Gouvernements';
    case 'sector':
      return 'Espace Secteurs';
    case 'admin':
      return 'Espace Administration';
    case 'contributor':
      return 'Espace Contributeur';
    case 'annonceur':
      return 'Espace Annonceur';
    default:
      return 'FATI';
  }
};

export const Header = ({ space }: HeaderProps) => {
  const navigate = useNavigate();
  const setTheme = useUIStore((state) => state.setTheme);
  const theme = useUIStore((state) => state.theme);
  const setSidebarMobileOpen = useUIStore((state) => state.setSidebarMobileOpen);
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();
  const { unreadAlertsCount } = useAlerts();
  const { searchAll } = useSearch();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    indicators: any[];
    geographic: any[];
    facilities: any[];
  }>({ indicators: [], geographic: [], facilities: [] });

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = await searchAll(query);
      setSearchResults(results);
    }
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Title */}
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold">{getSpaceTitle(space)}</h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Rechercher...</span>
            <span className="sm:hidden">Rechercher</span>
            <kbd className="ml-auto hidden rounded bg-muted px-2 py-0.5 text-xs font-medium sm:inline-block">
              ⌘K
            </kbd>
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <ThemeIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Clair
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Sombre
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                Système
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate(`/${space}/alerts`)}
          >
            <Bell className="h-5 w-5" />
            {unreadAlertsCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
              >
                {unreadAlertsCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                  alt={user?.firstName}
                  className="h-8 w-8 rounded-full bg-accent"
                />
                <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
                  {user?.firstName}
                </span>
                <ChevronDown className="hidden h-4 w-4 sm:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/help')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Aide
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Rechercher des indicateurs, régions, structures..."
          value={searchQuery}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

          {searchResults.indicators.length > 0 && (
            <CommandGroup heading="Indicateurs">
              {searchResults.indicators.map((indicator) => (
                <CommandItem
                  key={indicator.id}
                  onSelect={() => {
                    navigate(`/indicators/${indicator.id}`);
                    setSearchOpen(false);
                  }}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {indicator.name}
                  <span className="ml-auto text-xs text-muted-foreground">{indicator.code}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchResults.geographic.length > 0 && (
            <CommandGroup heading="Territoires">
              {searchResults.geographic.map((entity) => (
                <CommandItem
                  key={entity.id}
                  onSelect={() => {
                    navigate(`/map?region=${entity.id}`);
                    setSearchOpen(false);
                  }}
                >
                  <MapIcon className="mr-2 h-4 w-4" />
                  {entity.name}
                  <span className="ml-auto text-xs text-muted-foreground capitalize">{entity.level}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchResults.facilities.length > 0 && (
            <CommandGroup heading="Structures">
              {searchResults.facilities.map((facility) => (
                <CommandItem
                  key={facility.id}
                  onSelect={() => {
                    navigate(`/facilities/${facility.id}`);
                    setSearchOpen(false);
                  }}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  {facility.name}
                  <span className="ml-auto text-xs text-muted-foreground">{facility.code}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

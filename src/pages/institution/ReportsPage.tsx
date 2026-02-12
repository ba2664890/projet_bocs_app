import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Loader2,
  CheckCircle2,
  Archive,
  Sparkles,
} from 'lucide-react';

type ReportStatus = 'ready' | 'archived' | 'processing';

interface ReportRecord {
  id: number;
  name: string;
  category: 'Santé' | 'Éducation' | 'Global';
  date: string;
  type: 'PDF' | 'Excel';
  size: string;
  status: ReportStatus;
}

const initialReports: ReportRecord[] = [
  {
    id: 1,
    name: 'Rapport Annuel 2023 - Santé',
    category: 'Santé',
    date: '2024-01-15',
    type: 'PDF',
    size: '2.4 MB',
    status: 'ready',
  },
  {
    id: 2,
    name: 'Analyse Trimestrielle Q4 2023',
    category: 'Global',
    date: '2024-01-10',
    type: 'Excel',
    size: '1.1 MB',
    status: 'ready',
  },
  {
    id: 3,
    name: 'Couverture Vaccinale - Rapport Détaillé',
    category: 'Santé',
    date: '2023-12-05',
    type: 'PDF',
    size: '3.8 MB',
    status: 'ready',
  },
  {
    id: 4,
    name: 'Statistiques Scolaires Région Nord',
    category: 'Éducation',
    date: '2023-11-20',
    type: 'Excel',
    size: '0.9 MB',
    status: 'ready',
  },
  {
    id: 5,
    name: 'Performance Hospitalière',
    category: 'Santé',
    date: '2023-10-30',
    type: 'PDF',
    size: '5.2 MB',
    status: 'archived',
  },
];

export const ReportsPage = () => {
  const [reports, setReports] = useState<ReportRecord[]>(initialReports);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ReportRecord['category']>('all');
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const matchesSearch =
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
        return matchesSearch && matchesCategory;
      }),
    [reports, searchTerm, categoryFilter]
  );

  const readyCount = reports.filter((report) => report.status === 'ready').length;
  const archivedCount = reports.filter((report) => report.status === 'archived').length;
  const storageVolume = reports
    .map((report) => Number.parseFloat(report.size.replace(' MB', '')))
    .reduce((sum, value) => sum + (Number.isNaN(value) ? 0 : value), 0);

  const handleGenerateReport = () => {
    setIsLoading(true);
    setGenerationNotice(null);

    window.setTimeout(() => {
      const newReport: ReportRecord = {
        id: Date.now(),
        name: `Synthèse institutionnelle ${new Date().toLocaleDateString('fr-FR')}`,
        category: 'Global',
        date: new Date().toISOString().slice(0, 10),
        type: 'PDF',
        size: '1.6 MB',
        status: 'ready',
      };

      setReports((previous) => [newReport, ...previous]);
      setIsLoading(false);
      setGenerationNotice('Nouveau rapport généré et ajouté au centre de documents.');
    }, 1800);
  };

  const handleDownloadReport = (reportId: number, reportName: string) => {
    const element = document.createElement('a');
    const file = new Blob(['Rapport: ' + reportName], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `rapport_${reportId}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderStatusBadge = (status: ReportStatus) => {
    if (status === 'ready') {
      return (
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300" variant="outline">
          Prêt
        </Badge>
      );
    }

    if (status === 'archived') {
      return (
        <Badge className="border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300" variant="outline">
          Archivé
        </Badge>
      );
    }

    return (
      <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300" variant="outline">
        En cours
      </Badge>
    );
  };

  return (
    <div className="space-y-7">
      <section className="institution-hero">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="institution-kicker">Capitalisation documentaire</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Rapports et analyses</h1>
            <p className="max-w-2xl text-sm text-slate-100/90 sm:text-base">
              Centralisez vos livrables, générez des synthèses de pilotage et partagez des exports fiables avec
              les décideurs.
            </p>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="bg-white text-slate-900 hover:bg-slate-100"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Générer un rapport
          </Button>
        </div>

        <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Documents prêts</p>
            <p className="mt-1 text-2xl font-semibold">{readyCount}</p>
            <p className="text-xs text-slate-200/85">Disponibles immédiatement</p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Archives</p>
            <p className="mt-1 text-2xl font-semibold">{archivedCount}</p>
            <p className="text-xs text-slate-200/85">Historique sécurisé</p>
          </div>
          <div className="rounded-xl border border-white/25 bg-white/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-200">Volume total</p>
            <p className="mt-1 text-2xl font-semibold">{storageVolume.toFixed(1)} MB</p>
            <p className="text-xs text-slate-200/85">Base documentaire</p>
          </div>
        </div>
      </section>

      {generationNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          {generationNotice}
        </div>
      )}

      <Card className="institution-panel shadow-sm">
        <CardHeader className="space-y-4 border-b border-slate-200/70 pb-5 dark:border-slate-800/80">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Centre de documents</CardTitle>
              <CardDescription>Consultez, filtrez et exportez les rapports institutionnels.</CardDescription>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un rapport..."
                  className="h-10 pl-9"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={(value: 'all' | ReportRecord['category']) => setCategoryFilter(value)}>
                <SelectTrigger className="h-10 w-full sm:w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="Santé">Santé</SelectItem>
                  <SelectItem value="Éducation">Éducation</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          <div className="rounded-xl border border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-950/45">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-slate-100 p-2 text-[hsl(var(--institution-blue))] dark:bg-slate-800">
                          {report.status === 'archived' ? <Archive className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-900 dark:text-slate-100">{report.name}</span>
                          <span className="text-xs text-muted-foreground">{report.size}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{report.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        {new Date(report.date).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{renderStatusBadge(report.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-[hsl(var(--institution-blue))]"
                        onClick={() => handleDownloadReport(report.id, report.name)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-28 text-center text-muted-foreground">
                      Aucun document ne correspond à vos filtres actuels.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

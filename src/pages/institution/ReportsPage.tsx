import { useState } from 'react';
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
import { FileText, Download, Search, Filter, Calendar as CalendarIcon, Loader2 } from 'lucide-react';

export const ReportsPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock reports data
    const reports = [
        { id: 1, name: 'Rapport Annuel 2023 - Santé', category: 'Santé', date: '2024-01-15', type: 'PDF', size: '2.4 MB', status: 'ready' },
        { id: 2, name: 'Analyse Trimestrielle Q4 2023', category: 'Global', date: '2024-01-10', type: 'Excel', size: '1.1 MB', status: 'ready' },
        { id: 3, name: 'Couverture Vaccinale - Rapport Détailé', category: 'Santé', date: '2023-12-05', type: 'PDF', size: '3.8 MB', status: 'ready' },
        { id: 4, name: 'Statistiques Scolaires Région Nord', category: 'Éducation', date: '2023-11-20', type: 'Excel', size: '0.9 MB', status: 'ready' },
        { id: 5, name: 'Performance Hospitalière', category: 'Santé', date: '2023-10-30', type: 'PDF', size: '5.2 MB', status: 'archived' },
    ];

    const filteredReports = reports.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleGenerateReport = () => {
        setIsLoading(true);
        // Simulate API call to generate a new report
        setTimeout(() => {
            setIsLoading(false);
            alert('Nouveau rapport généré avec succès !');
        }, 2000);
    };

    const handleDownloadReport = (reportId: number, reportName: string) => {
        // Simulate downloading a report
        const element = document.createElement('a');
        const file = new Blob(['Rapport: ' + reportName], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `rapport_${reportId}_${Date.now()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Rapports et Analyses</h1>
                    <p className="text-muted-foreground">Accédez à l'ensemble des documents et exports de données.</p>
                </div>
                <Button onClick={handleGenerateReport} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    Générer un rapport
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <CardTitle>Centre de Documents</CardTitle>
                            <CardDescription>Consultez et téléchargez les rapports disponibles.</CardDescription>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher un rapport..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes</SelectItem>
                                    <SelectItem value="health">Santé</SelectItem>
                                    <SelectItem value="education">Éducation</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom du document</TableHead>
                                    <TableHead>Catégorie</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Format</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-muted rounded-md text-blue-600">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>{report.name}</span>
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
                                                {new Date(report.date).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>{report.type}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="hover:text-blue-600"
                                                onClick={() => handleDownloadReport(report.id, report.name)}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Télécharger
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredReports.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            Aucun résultat trouvé pour votre recherche.
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

// ============================================
// FATI - Formulaire de Soumission Complète
// Formules détaillés pour Santé & Éducation
// ============================================

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    CheckCircle2,
    FileText,
    Hospital,
    School,
    ArrowLeft,
    MapPin,
    Users,
    Building2,
    Loader2
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { dataCollectionService } from '@/services/dataCollection';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGeolocation } from '@/hooks/useGeolocation';

// ===== FORMULAIRE SANTÉ =====
const HealthForm = ({ formsPath }: { formsPath: string }) => {
    const [formData, setFormData] = useState({
        // Informations de base
        facilityName: '',
        facilityCode: '',
        facilityType: '',
        region: '',
        department: '',
        commune: '',
        address: '',
        phone: '',
        email: '',
        managerName: '',

        // Infrastructure
        buildingCondition: '',
        electricityAccess: false,
        waterAccess: false,
        internetAccess: false,
        emergencyPower: false,

        // Capacité
        bedCapacity: '',
        outpatientCapacity: '',
        surgicalRooms: '',
        laboratoryEquipped: false,
        imagingEquipped: false,

        // Personnel
        doctors: '',
        nurses: '',
        technicians: '',
        midwives: '',
        otherStaff: '',
        doctorvacancies: '',
        nursevacancies: '',

        // Services
        emergencyService: false,
        maternityService: false,
        pediatricService: false,
        surgicalService: false,
        laboratoryService: false,
        imagingService: false,
        outpatientService: false,

        // Équipements critiques
        defibrillator: false,
        xrayMachine: false,
        ultrasound: false,
        incubator: false,
        respirator: false,
        bloodBank: false,

        // Données de performance
        monthlyPatients: '',
        monthlyBirths: '',
        monthlyDeaths: '',
        surgeryPerformed: '',

        // Remarques
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState(0);
    const navigate = useNavigate();
    const { coords, isLoading: geoLoading, getPosition } = useGeolocation();

    useEffect(() => {
        getPosition();
    }, [getPosition]);

    const sections = [
        { id: 0, label: 'Informations de Base', icon: Building2 },
        { id: 1, label: 'Infrastructure', icon: MapPin },
        { id: 2, label: 'Capacité & Équipements', icon: Hospital },
        { id: 3, label: 'Personnel', icon: Users },
        { id: 4, label: 'Services', icon: FileText },
        { id: 5, label: 'Performance', icon: CheckCircle2 },
    ];
    const sectionCardClass = 'rounded-2xl border border-slate-200/70 bg-white/95 backdrop-blur-sm shadow-xl shadow-indigo-100/40 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none';

    const progress = Math.round(((activeSection + 1) / sections.length) * 100);

    const handleInputChange = (e: any) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                type: 'health',
                location: coords ? {
                    type: 'Point',
                    coordinates: [coords.longitude, coords.latitude]
                } : null
            };
            await dataCollectionService.createSubmission({ data: payload, status: 'draft' } as any);
            alert('Formulaire sauvegardé avec succès!');
            navigate(formsPath);
        } catch (err) {
            console.error('Erreur:', err);
            alert('Erreur lors de la sauvegarde');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50/80 to-indigo-50/40 p-4 shadow-[0_30px_70px_-40px_rgba(99,102,241,0.45)] sm:p-6 lg:p-8 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 [&_label]:mb-1.5 [&_label]:block [&_label]:text-xs [&_label]:font-semibold [&_label]:tracking-wide [&_label]:text-slate-600 dark:[&_label]:text-slate-300 [&_input]:h-11 [&_input]:rounded-xl [&_input]:border-slate-200 dark:[&_input]:border-slate-700 [&_textarea]:rounded-xl [&_textarea]:border-slate-200 dark:[&_textarea]:border-slate-700">
            {/* Header avec progress */}
            <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-white/80 p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center dark:border-indigo-900/40 dark:bg-slate-900/60">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">Progression du formulaire</h2>
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2.5 rounded-full" />
                    <p className="text-xs text-muted-foreground">
                        Étape {activeSection + 1} sur {sections.length}
                    </p>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    {geoLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin text-indigo-600" />
                    ) : coords ? (
                        <MapPin className="h-3 w-3 text-emerald-600" />
                    ) : (
                        <MapPin className="h-3 w-3 text-rose-600" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-tight">
                        {geoLoading ? 'GPS en cours...' : coords ? 'GPS Fixé' : 'GPS Non fixé'}
                    </span>
                </div>
            </div>

            {/* Sections et contenu */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Navigation */}
                <div className="md:col-span-1">
                    <div className="md:sticky md:top-4">
                        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/80 p-2 shadow-sm md:flex-col dark:border-slate-800 dark:bg-slate-900/60">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                    className={`min-w-fit rounded-xl px-4 py-2.5 text-left transition-all md:w-full ${activeSection === section.id
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/70 dark:bg-indigo-500 dark:text-white'
                                    : 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <section.icon className="h-4 w-4" />
                                    <span className="text-xs font-semibold sm:text-sm">{section.label}</span>
                                </div>
                            </button>
                        ))}
                        </div>
                    </div>
                </div>

                {/* Contenu */}
                <div className="md:col-span-3 space-y-6">
                    {/* Section 0: Informations de Base */}
                    {activeSection === 0 && (
                        <Card className={sectionCardClass}>
                            <CardHeader>
                                <CardTitle>Informations de Base</CardTitle>
                                <CardDescription>Identifiez la structure de santé</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Nom de la structure</label>
                                        <Input name="facilityName" value={formData.facilityName} onChange={handleInputChange} placeholder="Hôpital / Clinique..." />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Code</label>
                                        <Input name="facilityCode" value={formData.facilityCode} onChange={handleInputChange} placeholder="SN-2024-001" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Type de structure</label>
                                    <Select value={formData.facilityType} onValueChange={(v) => setFormData({ ...formData, facilityType: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hospital">Hôpital</SelectItem>
                                            <SelectItem value="health_center">Centre de Santé</SelectItem>
                                            <SelectItem value="health_post">Poste de Santé</SelectItem>
                                            <SelectItem value="clinic">Clinique</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label className="text-sm font-medium">Région</label>
                                        <Input name="region" value={formData.region} onChange={handleInputChange} placeholder="Dakar" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Département</label>
                                        <Input name="department" value={formData.department} onChange={handleInputChange} placeholder="Rufisque" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Commune</label>
                                        <Input name="commune" value={formData.commune} onChange={handleInputChange} placeholder="Thiaroye" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Adresse</label>
                                    <Textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="50 Rue de la Paix..." />
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Téléphone</label>
                                        <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+221 33..." />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="contact@..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Nom du Responsable</label>
                                    <Input name="managerName" value={formData.managerName} onChange={handleInputChange} placeholder="Dr. Jean Dupont" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Section 1: Infrastructure */}
                    {activeSection === 1 && (
                        <Card className={sectionCardClass}>
                            <CardHeader>
                                <CardTitle>État de l'Infrastructure</CardTitle>
                                <CardDescription>Évaluez les services de base</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">État du bâtiment</label>
                                    <Select value={formData.buildingCondition} onValueChange={(v) => setFormData({ ...formData, buildingCondition: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="excellent">Excellente</SelectItem>
                                            <SelectItem value="good">Bon</SelectItem>
                                            <SelectItem value="fair">Moyen</SelectItem>
                                            <SelectItem value="poor">Mauvais</SelectItem>
                                            <SelectItem value="critical">Critique</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm">Services de base disponibles</h4>
                                    <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                                        {[
                                            { name: 'electricityAccess', label: 'Électricité', icon: '⚡' },
                                            { name: 'waterAccess', label: 'Eau potable', icon: '💧' },
                                            { name: 'internetAccess', label: 'Internet', icon: '🌐' },
                                            { name: 'emergencyPower', label: 'Générateur/Énergie urgence', icon: '🔋' }
                                        ].map(item => (
                                            <label key={item.name} className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-900/60">
                                                <Checkbox
                                                    name={item.name}
                                                    checked={(formData as any)[item.name]}
                                                    onCheckedChange={(checked) => handleInputChange({ target: { name: item.name, type: 'checkbox', checked } })}
                                                />
                                                <span className="text-sm">{item.icon} {item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Section 2: Capacité */}
                    {activeSection === 2 && (
                        <Card className={sectionCardClass}>
                            <CardHeader>
                                <CardTitle>Capacité & Équipements</CardTitle>
                                <CardDescription>Ressources disponibles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Capacité de lits</label>
                                        <Input type="number" name="bedCapacity" value={formData.bedCapacity} onChange={handleInputChange} placeholder="50" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Capacité ambulatoire</label>
                                        <Input type="number" name="outpatientCapacity" value={formData.outpatientCapacity} onChange={handleInputChange} placeholder="100" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Salles opératoires</label>
                                        <Input type="number" name="surgicalRooms" value={formData.surgicalRooms} onChange={handleInputChange} placeholder="2" />
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                                    <h4 className="font-medium text-sm">Équipements clés</h4>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {[
                                            { name: 'laboratoryEquipped', label: 'Laboratoire' },
                                            { name: 'imagingEquipped', label: 'Imagerie' },
                                            { name: 'defibrillator', label: 'Défibrillateur' },
                                            { name: 'xrayMachine', label: 'Rayon-X' },
                                            { name: 'ultrasound', label: 'Échographie' },
                                            { name: 'incubator', label: 'Couveuse' },
                                            { name: 'respirator', label: 'Respirateur' },
                                            { name: 'bloodBank', label: 'Banque de sang' }
                                        ].map(item => (
                                            <label key={item.name} className="flex cursor-pointer items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-900/60">
                                                <Checkbox
                                                    name={item.name}
                                                    checked={(formData as any)[item.name]}
                                                    onCheckedChange={(checked) => handleInputChange({ target: { name: item.name, type: 'checkbox', checked } })}
                                                />
                                                <span className="text-sm">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Section 3: Personnel */}
                    {activeSection === 3 && (
                        <Card className={sectionCardClass}>
                            <CardHeader>
                                <CardTitle>Ressources Humaines</CardTitle>
                                <CardDescription>Effectifs et postes vacants</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-medium text-sm mb-4">Personnel en Poste</h4>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {[
                                            { name: 'doctors', label: 'Médecins' },
                                            { name: 'nurses', label: 'Infirmiers' },
                                            { name: 'technicians', label: 'Techniciens' },
                                            { name: 'midwives', label: 'Sages-femmes' },
                                            { name: 'otherStaff', label: 'Autres' }
                                        ].map(item => (
                                            <div key={item.name}>
                                                <label className="text-sm font-medium">{item.label}</label>
                                                <Input type="number" name={item.name} value={(formData as any)[item.name]} onChange={handleInputChange} placeholder="0" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-4">Postes Vacants</h4>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm font-medium">Médecins</label>
                                            <Input type="number" name="doctorvacancies" value={formData.doctorvacancies} onChange={handleInputChange} placeholder="0" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Infirmiers</label>
                                            <Input type="number" name="nursevacancies" value={formData.nursevacancies} onChange={handleInputChange} placeholder="0" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Section 4: Services */}
                    {activeSection === 4 && (
                        <Card className={sectionCardClass}>
                            <CardHeader>
                                <CardTitle>Services Offerts</CardTitle>
                                <CardDescription>Sélectionnez les services disponibles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                                {[
                                    { name: 'emergencyService', label: '🚑 Service d\'urgence' },
                                    { name: 'maternityService', label: '👶 Maternité' },
                                    { name: 'pediatricService', label: '🧒 Pédiatrie' },
                                    { name: 'surgicalService', label: '🏥 Chirurgie' },
                                    { name: 'laboratoryService', label: '🔬 Laboratoire' },
                                    { name: 'imagingService', label: '📸 Imagerie' },
                                    { name: 'outpatientService', label: '👨‍⚕️ Consultation externe' }
                                ].map(item => (
                                    <label key={item.name} className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-900/60">
                                        <Checkbox
                                            name={item.name}
                                            checked={(formData as any)[item.name]}
                                            onCheckedChange={(checked) => handleInputChange({ target: { name: item.name, type: 'checkbox', checked } })}
                                        />
                                        <span className="text-sm">{item.label}</span>
                                    </label>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Section 5: Performance */}
                    {activeSection === 5 && (
                        <Card className={sectionCardClass}>
                            <CardHeader>
                                <CardTitle>Données de Performance</CardTitle>
                                <CardDescription>Activités mensuelles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Patients vus (mois)</label>
                                        <Input type="number" name="monthlyPatients" value={formData.monthlyPatients} onChange={handleInputChange} placeholder="500" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Accouchements (mois)</label>
                                        <Input type="number" name="monthlyBirths" value={formData.monthlyBirths} onChange={handleInputChange} placeholder="50" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Décès (mois)</label>
                                        <Input type="number" name="monthlyDeaths" value={formData.monthlyDeaths} onChange={handleInputChange} placeholder="2" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Interventions chirurgicales</label>
                                        <Input type="number" name="surgeryPerformed" value={formData.surgeryPerformed} onChange={handleInputChange} placeholder="10" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Remarques additionelles</label>
                                    <Textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Ajoutez toute remarque pertinente..." />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/70">
                        <Button
                            variant="outline"
                            onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                            disabled={activeSection === 0}
                        >
                            ← Précédent
                        </Button>
                        <div className="text-sm text-muted-foreground sm:order-none order-first">
                            Étape {activeSection + 1} / {sections.length}
                        </div>
                        {activeSection === sections.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                {isSubmitting ? 'Envoi...' : 'Soumettre'}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                            >
                                Suivant →
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===== FORMULAIRE ÉDUCATION =====
const EducationForm = ({ formsPath }: { formsPath: string }) => {
    const [formData, setFormData] = useState({
        // Informations de base
        schoolName: '',
        schoolCode: '',
        schoolType: '',
        schoolLevel: '',
        region: '',
        department: '',
        commune: '',
        address: '',
        phone: '',
        email: '',
        principalName: '',

        // Infrastructure
        classrooms: '',
        usableClassrooms: '',
        toilets: '',
        functionalToilets: '',
        waterAccess: false,
        electricityAccess: false,
        internetAccess: false,
        playground: false,
        library: false,
        computerLab: false,

        // Personnel enseignant
        totalTeachers: '',
        trainedTeachers: '',
        femaleTeachers: '',
        maleTeachers: '',
        supportStaff: '',
        teachervacancies: '',

        // Données étudiantes
        totalStudents: '',
        femaleStudents: '',
        maleStudents: '',
        repeaters: '',
        dropouts: '',
        completionRate: '',

        // Services
        freeMeals: false,
        meditationProgram: false,
        counseling: false,
        sportsProgram: false,
        artProgram: false,
        scholarshipProgram: false,

        // Remarques
        notes: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState(0);
    const navigate = useNavigate();
    const { coords, isLoading: geoLoading, getPosition } = useGeolocation();

    useEffect(() => {
        getPosition();
    }, [getPosition]);

    const sections = [
        { id: 0, label: 'Informations', icon: School },
        { id: 1, label: 'Infrastructure', icon: Building2 },
        { id: 2, label: 'Personnel', icon: Users },
        { id: 3, label: 'Étudiants', icon: FileText },
        { id: 4, label: 'Programmes', icon: CheckCircle2 },
    ];
    const sectionCardClass = 'rounded-2xl border border-slate-200/70 bg-white/95 backdrop-blur-sm shadow-xl shadow-emerald-100/40 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none';

    const progress = Math.round(((activeSection + 1) / sections.length) * 100);

    const handleInputChange = (e: any) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                type: 'education',
                location: coords ? {
                    type: 'Point',
                    coordinates: [coords.longitude, coords.latitude]
                } : null
            };
            await dataCollectionService.createSubmission({ data: payload, status: 'draft' } as any);
            alert('Formulaire sauvegardé avec succès!');
            navigate(formsPath);
        } catch (err) {
            console.error('Erreur:', err);
            alert('Erreur lors de la sauvegarde');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50/80 to-emerald-50/40 p-4 shadow-[0_30px_70px_-40px_rgba(16,185,129,0.45)] sm:p-6 lg:p-8 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 [&_label]:mb-1.5 [&_label]:block [&_label]:text-xs [&_label]:font-semibold [&_label]:tracking-wide [&_label]:text-slate-600 dark:[&_label]:text-slate-300 [&_input]:h-11 [&_input]:rounded-xl [&_input]:border-slate-200 dark:[&_input]:border-slate-700 [&_textarea]:rounded-xl [&_textarea]:border-slate-200 dark:[&_textarea]:border-slate-700">
            {/* Header avec progress */}
            <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center dark:border-emerald-900/40 dark:bg-slate-900/60">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">Progression du formulaire</h2>
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2.5 rounded-full" />
                    <p className="text-xs text-muted-foreground">
                        Étape {activeSection + 1} sur {sections.length}
                    </p>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    {geoLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin text-indigo-600" />
                    ) : coords ? (
                        <MapPin className="h-3 w-3 text-emerald-600" />
                    ) : (
                        <MapPin className="h-3 w-3 text-rose-600" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-tight">
                        {geoLoading ? 'GPS en cours...' : coords ? 'GPS Fixé' : 'GPS Non fixé'}
                    </span>
                </div>
            </div>

            {/* Sections et contenu */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Navigation */}
                <div className="md:col-span-1">
                    <div className="md:sticky md:top-4">
                        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/80 p-2 shadow-sm md:flex-col dark:border-slate-800 dark:bg-slate-900/60">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`min-w-fit rounded-xl px-4 py-2.5 text-left transition-all md:w-full ${activeSection === section.id
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200/70 dark:bg-emerald-500 dark:text-white'
                                    : 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <section.icon className="h-4 w-4" />
                                    <span className="text-xs font-semibold sm:text-sm">{section.label}</span>
                                </div>
                            </button>
                        ))}
                        </div>
                    </div>
                </div>

                {/* Contenu */}
                <div className="md:col-span-3 space-y-6">
                    {/* Section 0: Informations */}
                    {activeSection === 0 && (
                        <Card className={sectionCardClass}>
                            <CardHeader>
                                <CardTitle>Informations de l'École</CardTitle>
                                <CardDescription>Identifiez l'établissement scolaire</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Nom de l'école</label>
                                        <Input name="schoolName" value={formData.schoolName} onChange={handleInputChange} placeholder="Lycée Seydou Nourou Tall..." />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Code</label>
                                        <Input name="schoolCode" value={formData.schoolCode} onChange={handleInputChange} placeholder="SN-2024-001" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Type d'école</label>
                                        <Select value={formData.schoolType} onValueChange={(v) => setFormData({ ...formData, schoolType: v })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="primary">École Primaire</SelectItem>
                                                <SelectItem value="secondary">Collège</SelectItem>
                                                <SelectItem value="high_school">Lycée</SelectItem>
                                                <SelectItem value="vocational">Professionnel</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Niveau</label>
                                        <Select value={formData.schoolLevel} onValueChange={(v) => setFormData({ ...formData, schoolLevel: v })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="basic">Élémentaire</SelectItem>
                                                <SelectItem value="secondary">Secondaire</SelectItem>
                                                <SelectItem value="superior">Supérieur</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label className="text-sm font-medium">Région</label>
                                        <Input name="region" value={formData.region} onChange={handleInputChange} placeholder="Dakar" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Département</label>
                                        <Input name="department" value={formData.department} onChange={handleInputChange} placeholder="Rufisque" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Commune</label>
                                        <Input name="commune" value={formData.commune} onChange={handleInputChange} placeholder="Thiaroye" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Adresse</label>
                                    <Textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="50 Rue de l'Éducation..." />
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Téléphone</label>
                                        <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+221 33..." />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="contact@..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Nom du Principal/Directeur</label>
                                    <Input name="principalName" value={formData.principalName} onChange={handleInputChange} placeholder="M. Jean Dupont" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Section 1: Infrastructure */}
                    {activeSection === 1 && (
                        <Card className={sectionCardClass}>
                            <CardHeader>
                                <CardTitle>Infrastructure Scolaire</CardTitle>
                                <CardDescription>Équipements et ressources disponibles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Nombre total de salles de classe</label>
                                        <Input type="number" name="classrooms" value={formData.classrooms} onChange={handleInputChange} placeholder="20" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Salles utilisables</label>
                                        <Input type="number" name="usableClassrooms" value={formData.usableClassrooms} onChange={handleInputChange} placeholder="18" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Toilettes totales</label>
                                        <Input type="number" name="toilets" value={formData.toilets} onChange={handleInputChange} placeholder="10" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Toilettes fonctionnelles</label>
                                        <Input type="number" name="functionalToilets" value={formData.functionalToilets} onChange={handleInputChange} placeholder="8" />
                                    </div>
                                </div>

                                <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                                    <h4 className="font-medium text-sm">Services et équipements</h4>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {[
                                            { name: 'waterAccess', label: '💧 Eau potable' },
                                            { name: 'electricityAccess', label: '⚡ Électricité' },
                                            { name: 'internetAccess', label: '🌐 Internet' },
                                            { name: 'playground', label: '⚽ Terrain de jeux' },
                                            { name: 'library', label: '📚 Bibliothèque' },
                                            { name: 'computerLab', label: '🖥️ Salle informatique' }
                                        ].map(item => (
                                            <label key={item.name} className="flex cursor-pointer items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-900/60">
                                                <Checkbox
                                                    name={item.name}
                                                    checked={(formData as any)[item.name]}
                                                    onCheckedChange={(checked) => handleInputChange({ target: { name: item.name, type: 'checkbox', checked } })}
                                                />
                                                <span className="text-sm">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Section 2: Personnel */}
                    {activeSection === 2 && (
                        <Card className={sectionCardClass}>
                            <CardHeader>
                                <CardTitle>Corps Enseignant</CardTitle>
                                <CardDescription>Ressources humaines</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-medium text-sm mb-4">Personnel enseignant</h4>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm font-medium">Total d'enseignants</label>
                                            <Input type="number" name="totalTeachers" value={formData.totalTeachers} onChange={handleInputChange} placeholder="40" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Enseignants formés</label>
                                            <Input type="number" name="trainedTeachers" value={formData.trainedTeachers} onChange={handleInputChange} placeholder="35" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Femmes enseignantes</label>
                                            <Input type="number" name="femaleTeachers" value={formData.femaleTeachers} onChange={handleInputChange} placeholder="15" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Hommes enseignants</label>
                                            <Input type="number" name="maleTeachers" value={formData.maleTeachers} onChange={handleInputChange} placeholder="25" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-4">Postes vacants</h4>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm font-medium">Personnel de soutien</label>
                                            <Input type="number" name="supportStaff" value={formData.supportStaff} onChange={handleInputChange} placeholder="8" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Postes vacants d'enseignants</label>
                                            <Input type="number" name="teachervacancies" value={formData.teachervacancies} onChange={handleInputChange} placeholder="0" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Section 3: Étudiants */}
                    {activeSection === 3 && (
                        <Card className={sectionCardClass}>
                            <CardHeader>
                                <CardTitle>Population Scolaire</CardTitle>
                                <CardDescription>Données des apprenants</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Total d'étudiants</label>
                                        <Input type="number" name="totalStudents" value={formData.totalStudents} onChange={handleInputChange} placeholder="1200" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Étudiantes</label>
                                        <Input type="number" name="femaleStudents" value={formData.femaleStudents} onChange={handleInputChange} placeholder="550" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Étudiants</label>
                                        <Input type="number" name="maleStudents" value={formData.maleStudents} onChange={handleInputChange} placeholder="650" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Redoublants</label>
                                        <Input type="number" name="repeaters" value={formData.repeaters} onChange={handleInputChange} placeholder="50" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Abandons</label>
                                        <Input type="number" name="dropouts" value={formData.dropouts} onChange={handleInputChange} placeholder="20" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Taux de complètion (%)</label>
                                        <Input type="number" name="completionRate" value={formData.completionRate} onChange={handleInputChange} placeholder="92" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Section 4: Programmes */}
                    {activeSection === 4 && (
                        <Card className={sectionCardClass}>
                            <CardHeader>
                                <CardTitle>Programmes et Services</CardTitle>
                                <CardDescription>Activités additionnelles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                                {[
                                    { name: 'freeMeals', label: '🍚 Repas scolaires gratuits' },
                                    { name: 'meditationProgram', label: '🧘 Programme de bien-être' },
                                    { name: 'counseling', label: '💬 Service de consiliance' },
                                    { name: 'sportsProgram', label: '⚽ Programme sportif' },
                                    { name: 'artProgram', label: '🎨 Programme artistique' },
                                    { name: 'scholarshipProgram', label: '🎓 Programme de bourses' }
                                ].map(item => (
                                    <label key={item.name} className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-900/60">
                                        <Checkbox
                                            name={item.name}
                                            checked={(formData as any)[item.name]}
                                            onCheckedChange={(checked) => handleInputChange({ target: { name: item.name, type: 'checkbox', checked } })}
                                        />
                                        <span className="text-sm">{item.label}</span>
                                    </label>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/70">
                        <Button
                            variant="outline"
                            onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                            disabled={activeSection === 0}
                        >
                            ← Précédent
                        </Button>
                        <div className="text-sm text-muted-foreground sm:order-none order-first">
                            Étape {activeSection + 1} / {sections.length}
                        </div>
                        {activeSection === sections.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                {isSubmitting ? 'Envoi...' : 'Soumettre'}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                            >
                                Suivant →
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ===== PAGE PRINCIPALE =====
export const FormSubmissionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isEducationSpace = location.pathname.includes('/sector/education');
    const formType: 'health' | 'education' = isEducationSpace ? 'education' : 'health';
    const formsPath = isEducationSpace ? '/sector/education/forms' : '/sector/health/forms';

    return (
        <MainLayout space="sector">
            <div className="max-w-[1480px] mx-auto space-y-6 pb-12">
                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 text-white shadow-2xl sm:p-7">
                    <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3 sm:items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                                onClick={() => navigate(formsPath)}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Formulaire de Collecte</h1>
                                <p className="text-sm text-slate-300 sm:text-base">
                                    {formType === 'health' ? 'Parcours Santé' : 'Parcours Éducation'}
                                </p>
                            </div>
                        </div>
                        <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider sm:text-sm">
                            {formType === 'health' ? 'Secteur Santé' : 'Secteur Éducation'}
                        </div>
                    </div>
                </div>

                {/* Formulaires */}
                {formType === 'health'
                    ? <HealthForm formsPath={formsPath} />
                    : <EducationForm formsPath={formsPath} />}
            </div>
        </MainLayout>
    );
};

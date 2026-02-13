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
        <div className="space-y-6">
            {/* Header avec progress */}
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-medium">Progression du formulaire</h2>
                        <span className="text-sm font-bold text-indigo-600">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Navigation */}
                <div className="md:col-span-1">
                    <div className="space-y-2 sticky top-4">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeSection === section.id
                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-600'
                                    : 'hover:bg-muted'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <section.icon className="h-4 w-4" />
                                    <span className="text-sm font-medium">{section.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenu */}
                <div className="md:col-span-3 space-y-6">
                    {/* Section 0: Informations de Base */}
                    {activeSection === 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de Base</CardTitle>
                                <CardDescription>Identifiez la structure de santé</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
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
                                <div className="grid grid-cols-3 gap-4">
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
                                <div className="grid grid-cols-2 gap-4">
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
                        <Card>
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
                                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                        {[
                                            { name: 'electricityAccess', label: 'Électricité', icon: '⚡' },
                                            { name: 'waterAccess', label: 'Eau potable', icon: '💧' },
                                            { name: 'internetAccess', label: 'Internet', icon: '🌐' },
                                            { name: 'emergencyPower', label: 'Générateur/Énergie urgence', icon: '🔋' }
                                        ].map(item => (
                                            <label key={item.name} className="flex items-center gap-3 cursor-pointer">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Capacité & Équipements</CardTitle>
                                <CardDescription>Ressources disponibles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Capacité de lits</label>
                                        <Input type="number" name="bedCapacity" value={formData.bedCapacity} onChange={handleInputChange} placeholder="50" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Capacité ambulatoire</label>
                                        <Input type="number" name="outpatientCapacity" value={formData.outpatientCapacity} onChange={handleInputChange} placeholder="100" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Salles opératoires</label>
                                        <Input type="number" name="surgicalRooms" value={formData.surgicalRooms} onChange={handleInputChange} placeholder="2" />
                                    </div>
                                </div>

                                <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                                    <h4 className="font-medium text-sm">Équipements clés</h4>
                                    <div className="grid grid-cols-2 gap-3">
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
                                            <label key={item.name} className="flex items-center gap-2 cursor-pointer">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Ressources Humaines</CardTitle>
                                <CardDescription>Effectifs et postes vacants</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-medium text-sm mb-4">Personnel en Poste</h4>
                                    <div className="grid grid-cols-2 gap-4">
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
                                    <div className="grid grid-cols-2 gap-4">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Services Offerts</CardTitle>
                                <CardDescription>Sélectionnez les services disponibles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 bg-muted/50 p-4 rounded-lg">
                                {[
                                    { name: 'emergencyService', label: '🚑 Service d\'urgence' },
                                    { name: 'maternityService', label: '👶 Maternité' },
                                    { name: 'pediatricService', label: '🧒 Pédiatrie' },
                                    { name: 'surgicalService', label: '🏥 Chirurgie' },
                                    { name: 'laboratoryService', label: '🔬 Laboratoire' },
                                    { name: 'imagingService', label: '📸 Imagerie' },
                                    { name: 'outpatientService', label: '👨‍⚕️ Consultation externe' }
                                ].map(item => (
                                    <label key={item.name} className="flex items-center gap-3 cursor-pointer">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Données de Performance</CardTitle>
                                <CardDescription>Activités mensuelles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
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
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                            disabled={activeSection === 0}
                        >
                            ← Précédent
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            Étape {activeSection + 1} / {sections.length}
                        </div>
                        {activeSection === sections.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700"
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
        <div className="space-y-6">
            {/* Header avec progress */}
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-sm font-medium">Progression du formulaire</h2>
                        <span className="text-sm font-bold text-emerald-600">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border ml-4">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Navigation */}
                <div className="md:col-span-1">
                    <div className="space-y-2 sticky top-4">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeSection === section.id
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-l-4 border-emerald-600'
                                    : 'hover:bg-muted'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <section.icon className="h-4 w-4" />
                                    <span className="text-sm font-medium">{section.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenu */}
                <div className="md:col-span-3 space-y-6">
                    {/* Section 0: Informations */}
                    {activeSection === 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de l'École</CardTitle>
                                <CardDescription>Identifiez l'établissement scolaire</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Nom de l'école</label>
                                        <Input name="schoolName" value={formData.schoolName} onChange={handleInputChange} placeholder="Lycée Seydou Nourou Tall..." />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Code</label>
                                        <Input name="schoolCode" value={formData.schoolCode} onChange={handleInputChange} placeholder="SN-2024-001" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
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
                                <div className="grid grid-cols-3 gap-4">
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
                                <div className="grid grid-cols-2 gap-4">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Infrastructure Scolaire</CardTitle>
                                <CardDescription>Équipements et ressources disponibles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
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

                                <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                                    <h4 className="font-medium text-sm">Services et équipements</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { name: 'waterAccess', label: '💧 Eau potable' },
                                            { name: 'electricityAccess', label: '⚡ Électricité' },
                                            { name: 'internetAccess', label: '🌐 Internet' },
                                            { name: 'playground', label: '⚽ Terrain de jeux' },
                                            { name: 'library', label: '📚 Bibliothèque' },
                                            { name: 'computerLab', label: '🖥️ Salle informatique' }
                                        ].map(item => (
                                            <label key={item.name} className="flex items-center gap-2 cursor-pointer">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Corps Enseignant</CardTitle>
                                <CardDescription>Ressources humaines</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-medium text-sm mb-4">Personnel enseignant</h4>
                                    <div className="grid grid-cols-2 gap-4">
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
                                    <div className="grid grid-cols-2 gap-4">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Population Scolaire</CardTitle>
                                <CardDescription>Données des apprenants</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
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

                                <div className="grid grid-cols-2 gap-4">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Programmes et Services</CardTitle>
                                <CardDescription>Activités additionnelles</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 bg-muted/50 p-4 rounded-lg">
                                {[
                                    { name: 'freeMeals', label: '🍚 Repas scolaires gratuits' },
                                    { name: 'meditationProgram', label: '🧘 Programme de bien-être' },
                                    { name: 'counseling', label: '💬 Service de consiliance' },
                                    { name: 'sportsProgram', label: '⚽ Programme sportif' },
                                    { name: 'artProgram', label: '🎨 Programme artistique' },
                                    { name: 'scholarshipProgram', label: '🎓 Programme de bourses' }
                                ].map(item => (
                                    <label key={item.name} className="flex items-center gap-3 cursor-pointer">
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
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                            disabled={activeSection === 0}
                        >
                            ← Précédent
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            Étape {activeSection + 1} / {sections.length}
                        </div>
                        {activeSection === sections.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700"
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
            <div className="max-w-[1400px] mx-auto pb-12">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(formsPath)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Formulaire de Collecte</h1>
                        <p className="text-muted-foreground">
                            {formType === 'health' ? 'Secteur Santé' : 'Secteur Éducation'}
                        </p>
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

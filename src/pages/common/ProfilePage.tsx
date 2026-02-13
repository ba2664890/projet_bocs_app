import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store';
import authService from '@/services/auth';

const getInitials = (firstName?: string, lastName?: string): string => {
  const first = (firstName || '').trim().charAt(0);
  const last = (lastName || '').trim().charAt(0);
  const initials = `${first}${last}`.toUpperCase();
  return initials || 'U';
};

const getLayoutSpace = (role?: string): 'institution' | 'sector' | 'admin' | 'annonceur' => {
  if (role === 'admin') return 'admin';
  if (role === 'sector_health' || role === 'sector_education' || role === 'local_manager') return 'sector';
  if (role === 'annonceur' || role === 'viewer') return 'annonceur';
  return 'institution';
};

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    department: '',
    phone: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      organization: user.organization || '',
      department: user.department || '',
      phone: user.phone || '',
    });
  }, [user]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  const effectiveAvatar = useMemo(() => {
    if (avatarPreview) return avatarPreview;
    return user?.avatar || undefined;
  }, [avatarPreview, user?.avatar]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);

    const file = event.target.files?.[0];
    if (!file) {
      setAvatarFile(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide.');
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError('Image trop volumineuse. Taille max: 5 Mo.');
      return;
    }

    setAvatarFile(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      let updated;

      if (avatarFile) {
        const form = new FormData();
        form.append('first_name', formData.firstName);
        form.append('last_name', formData.lastName);
        form.append('organization', formData.organization);
        form.append('department', formData.department);
        form.append('phone', formData.phone);
        form.append('avatar', avatarFile);
        updated = await authService.updateProfile(form);
      } else {
        updated = await authService.updateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          organization: formData.organization,
          department: formData.department,
          phone: formData.phone,
        });
      }

      updateUser(updated);
      setAvatarFile(null);
      setSuccess('Profil mis à jour avec succès.');
    } catch (err: any) {
      const apiDetail =
        err?.response?.data?.detail ||
        err?.response?.data?.avatar?.[0] ||
        err?.response?.data?.error;
      setError(apiDetail || 'Impossible de mettre à jour le profil.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout space={getLayoutSpace(user?.role)}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mon profil</CardTitle>
            <CardDescription>
              Ajoutez votre photo et mettez à jour vos informations personnelles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={effectiveAvatar} alt={user?.firstName || 'Utilisateur'} />
                  <AvatarFallback>{getInitials(user?.firstName, user?.lastName)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="avatar">Photo de profil</Label>
                  <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organisation</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData((prev) => ({ ...prev, organization: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

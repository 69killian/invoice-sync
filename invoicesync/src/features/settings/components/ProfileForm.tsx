import * as React from "react"
import { Mail, Save, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "../../../lib/utils"
import { useForm } from "react-hook-form"
import type { UserUpdate } from "../types"
import { useUser } from "../hooks/useUser"
import { useAuth } from "../../../contexts/AuthContext"

const ProfileForm: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const { user: authUser, loading: authLoading } = useAuth();
  const { user, isLoading, updateUser, isUpdating } = useUser(authUser?.id);
  const [updateStatus, setUpdateStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { isDirty }, reset } = useForm<UserUpdate>({
    defaultValues: {
      company: user?.company || '',
      jobTitle: user?.jobTitle || '',
      bio: user?.bio || '',
    }
  });

  // Reset form when user data changes
  React.useEffect(() => {
    if (user) {
      reset({
        company: user.company || '',
        jobTitle: user.jobTitle || '',
        bio: user.bio || '',
      });
    }
  }, [user, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (authUser?.id) {
      try {
        await updateUser(data);
        setUpdateStatus('success');
        setTimeout(() => setUpdateStatus('idle'), 3000);
      } catch (error) {
        setUpdateStatus('error');
        setTimeout(() => setUpdateStatus('idle'), 3000);
      }
    }
  });

  if (authLoading || isLoading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!authUser?.id) {
    return <div className="p-8">Erreur: Utilisateur non authentifié</div>;
  }

  return (
    <div className={cn("px-8", className)} {...props}>
      <div className="max-w-2xl mx-auto">
        {updateStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-900/20 border border-green-500 rounded-none flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-sm text-green-500">Modifications enregistrées avec succès</span>
          </div>
        )}
        
        {updateStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-500 rounded-none flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-sm text-red-500">Erreur lors de l'enregistrement des modifications</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="bg-background border border-border rounded-none">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-medium" style={{ color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                  Informations du profil
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Gérez vos informations professionnelles
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  readOnly
                  value={authUser.email}
                  className="w-full bg-background border border-border text-xs px-3 py-2 pl-10 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Entreprise</label>
              <input
                type="text"
                placeholder="Nom de votre entreprise"
                {...register('company')}
                className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Poste</label>
              <input
                type="text"
                placeholder="Votre poste actuel"
                {...register('jobTitle')}
                className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Bio</label>
              <textarea
                rows={3}
                placeholder="Décrivez votre activité en quelques mots"
                {...register('bio')}
                className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                type="submit"
                disabled={!isDirty || isUpdating}
                className={cn(
                  "px-4 py-2 text-xs rounded-none transition-colors flex items-center gap-2 border",
                  isDirty && !isUpdating ? "bg-white text-black hover:bg-white/90" : "bg-white/10 text-white/50"
                )}
                style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
              >
                <Save size={14} />
                {isUpdating ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm; 
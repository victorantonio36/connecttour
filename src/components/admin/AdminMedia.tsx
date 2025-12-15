import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Image as ImageIcon, FolderOpen, RefreshCw } from 'lucide-react';

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
  publicUrl: string;
}

const BUCKETS = [
  { id: 'platform-media', name: 'Mídia da Plataforma', description: 'Imagens institucionais, banners, etc.' },
  { id: 'partner-logos', name: 'Logos de Parceiros', description: 'Logotipos das empresas parceiras' },
  { id: 'partner-covers', name: 'Capas de Parceiros', description: 'Imagens de capa das empresas' },
  { id: 'service-images', name: 'Imagens de Serviços', description: 'Fotos dos serviços turísticos' }
];

const AdminMedia = () => {
  const [selectedBucket, setSelectedBucket] = useState(BUCKETS[0].id);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { logAdminAction } = useAdmin();
  const { toast } = useToast();

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(selectedBucket)
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (error) throw error;

      const filesWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const { data: urlData } = supabase.storage
            .from(selectedBucket)
            .getPublicUrl(file.name);

          return {
            ...file,
            publicUrl: urlData.publicUrl
          };
        })
      );

      setFiles(filesWithUrls);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({ title: 'Erro', description: 'Falha ao carregar arquivos.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedBucket]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const { error } = await supabase.storage
        .from(selectedBucket)
        .upload(fileName, file);

      if (error) throw error;

      await logAdminAction('upload', 'media', undefined, null, { bucket: selectedBucket, file: fileName }, `Upload: ${fileName} para ${selectedBucket}`);
      toast({ title: 'Sucesso', description: 'Arquivo enviado.' });
      fetchFiles();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao enviar arquivo.', variant: 'destructive' });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${fileName}?`)) return;

    try {
      const { error } = await supabase.storage
        .from(selectedBucket)
        .remove([fileName]);

      if (error) throw error;

      await logAdminAction('delete', 'media', undefined, { bucket: selectedBucket, file: fileName }, null, `Excluído: ${fileName} de ${selectedBucket}`);
      toast({ title: 'Sucesso', description: 'Arquivo excluído.' });
      fetchFiles();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao excluir arquivo.', variant: 'destructive' });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: 'Copiado', description: 'URL copiada para a área de transferência.' });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Mídia</CardTitle>
          <CardDescription>Gerencie imagens e arquivos da plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bucket Selection and Upload */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label>Selecionar Bucket</Label>
              <Select value={selectedBucket} onValueChange={setSelectedBucket}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUCKETS.map(bucket => (
                    <SelectItem key={bucket.id} value={bucket.id}>
                      <div>
                        <p>{bucket.name}</p>
                        <p className="text-xs text-muted-foreground">{bucket.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-end">
              <div>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Enviando...' : 'Upload'}
                  </div>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
              <Button variant="outline" onClick={fetchFiles}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Files Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum arquivo neste bucket</p>
              <p className="text-sm text-muted-foreground">Faça upload de imagens para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <div key={file.id} className="group relative border rounded-lg overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {(file.metadata?.mimetype as string)?.startsWith('image/') ? (
                      <img
                        src={file.publicUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyToClipboard(file.publicUrl)}
                    >
                      Copiar URL
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(file.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-2 bg-background">
                    <p className="text-xs truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {file.metadata?.size ? formatSize(file.metadata.size as number) : '-'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMedia;

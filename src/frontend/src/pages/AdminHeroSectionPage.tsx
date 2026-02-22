import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetHeroSection, useSetHeroSection } from '../hooks/useHeroSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

export default function AdminHeroSectionPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: heroSection, isLoading } = useGetHeroSection();
  const setHeroSection = useSetHeroSection();

  const [headline, setHeadline] = useState('');
  const [tagline, setTagline] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (heroSection) {
      setHeadline(heroSection.headline);
      setTagline(heroSection.tagline);
      if (heroSection.image) {
        setImagePreview(heroSection.image.getDirectURL());
      }
    } else {
      setHeadline('STREETWEAR REDEFINED');
      setTagline('Exclusive drops. Limited editions. Unmatched style.');
    }
  }, [heroSection]);

  if (!identity) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">Please log in to access this page</p>
            <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!headline.trim() || !tagline.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      let imageBlob: ExternalBlob | undefined = heroSection?.image;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      }

      await setHeroSection.mutateAsync({
        headline: headline.trim(),
        tagline: tagline.trim(),
        image: imageBlob,
      });

      toast.success('Hero section updated successfully!');
      setUploadProgress(0);
    } catch (error) {
      console.error('Failed to update hero section:', error);
      toast.error('Failed to update hero section');
      setUploadProgress(0);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/admin' })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="STREETWEAR REDEFINED"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Textarea
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Exclusive drops. Limited editions. Unmatched style."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Hero Background Image</Label>
              <div className="flex flex-col gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button type="submit" disabled={setHeroSection.isPending} className="w-full">
              {setHeroSection.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

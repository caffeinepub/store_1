import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetSocialLinks, useSetSocialLinks } from '../hooks/useSocialLinks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSocialLinksPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: socialLinks, isLoading } = useGetSocialLinks();
  const setSocialLinks = useSetSocialLinks();

  const [youtube, setYoutube] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [twitch, setTwitch] = useState('');
  const [kick, setKick] = useState('');

  useEffect(() => {
    if (socialLinks) {
      setYoutube(socialLinks.youtube || '');
      setInstagram(socialLinks.instagram || '');
      setTiktok(socialLinks.tiktok || '');
      setTwitch(socialLinks.twitch || '');
      setKick(socialLinks.kick || '');
    }
  }, [socialLinks]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await setSocialLinks.mutateAsync({
        youtube: youtube.trim(),
        instagram: instagram.trim(),
        tiktok: tiktok.trim(),
        twitch: twitch.trim(),
        kick: kick.trim(),
      });

      toast.success('Social links updated successfully!');
    } catch (error) {
      console.error('Failed to update social links:', error);
      toast.error('Failed to update social links');
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
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube URL</Label>
              <Input
                id="youtube"
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to hide this social icon
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/yourusername"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to hide this social icon
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok URL</Label>
              <Input
                id="tiktok"
                type="url"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="https://tiktok.com/@yourusername"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to hide this social icon
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitch">Twitch URL</Label>
              <Input
                id="twitch"
                type="url"
                value={twitch}
                onChange={(e) => setTwitch(e.target.value)}
                placeholder="https://twitch.tv/yourchannel"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to hide this social icon
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kick">Kick URL</Label>
              <Input
                id="kick"
                type="url"
                value={kick}
                onChange={(e) => setKick(e.target.value)}
                placeholder="https://kick.com/yourchannel"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to hide this social icon
              </p>
            </div>

            <Button type="submit" disabled={setSocialLinks.isPending} className="w-full">
              {setSocialLinks.isPending ? (
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

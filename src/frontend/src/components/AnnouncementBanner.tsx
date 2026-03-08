import { useGetAnnouncementBanner } from "../hooks/useProducts";

export default function AnnouncementBanner() {
  const { data: banner } = useGetAnnouncementBanner();

  if (!banner || !banner.enabled || !banner.message) {
    return null;
  }

  return (
    <div
      className="w-full bg-primary text-primary-foreground text-center py-2.5 px-4 text-sm font-medium"
      role="banner"
      aria-label="Site announcement"
      data-ocid="announcement.section"
    >
      {banner.message}
    </div>
  );
}

import { loadTripData } from "@/lib/trip-loader";
import { TripDataProvider } from "@/context/TripContext";
import { ThemeToggle } from "@/components/presentation/ThemeToggle";
import { MobileMenu } from "@/components/MobileMenu";
import { WeatherOverlay } from "@/components/fun/WeatherOverlay";
import { CurrencyConverter } from "@/components/fun/CurrencyConverter";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadTripData(slug);
  return {
    title: {
      default: data.trip.title,
      template: `%s — ${data.trip.title}`,
    },
    description: `${data.trip.dates} — ${data.trip.durationDays} Days, ${data.trip.travelers} Travelers. ${data.trip.route.join(" → ")}.`,
  };
}

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadTripData(slug);

  return (
    <TripDataProvider data={data} slug={slug}>
      {children}
      <ThemeToggle />
      <WeatherOverlay />
      <CurrencyConverter />
      <MobileMenu />
    </TripDataProvider>
  );
}

import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <div className="container mx-auto px-4 max-w-3xl md:px-0">
      <Slot />
    </div>
  );
}
